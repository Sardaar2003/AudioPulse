const fs = require('fs');
const path = require('path');
const AudioAnalysis = require('../models/AudioAnalysis');
const KeywordGroup = require('../models/KeywordGroup');
const { transcribeAudioFile } = require('../services/whisperService');
const { extractProofMatches } = require('../services/proofMatcher');

// @desc    Upload audio file or batch
// @route   POST /api/audio/upload
// @access  Protected
const uploadAudio = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No audio files uploaded' });
    }

    const folderName = req.body.folderName || 'Uploaded Folder';
    const createdRecords = [];

    for (const file of req.files) {
      const record = await AudioAnalysis.create({
        title: path.parse(file.originalname).name,
        originalFilename: file.originalname,
        filePath: file.path,
        folderName,
        fileSize: file.size,
        mimeType: file.mimetype,
        status: 'uploaded',
        userId: req.user._id,
      });
      createdRecords.push(record);
    }

    return res.status(201).json({
      message: `Successfully uploaded ${createdRecords.length} audio file(s)`,
      files: createdRecords,
    });
  } catch (error) {
    console.error('Error uploading audio:', error);
    return res.status(500).json({ message: 'Failed to process audio file upload' });
  }
};

// @desc    Trigger AI Transcription & Keyword Proof Extraction
// @route   POST /api/audio/transcribe/:id
// @access  Protected
const transcribeAudio = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await AudioAnalysis.findOne({ _id: id, userId: req.user._id });

    if (!analysis) {
      return res.status(404).json({ message: 'Audio analysis record not found' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(analysis.filePath)) {
      return res.status(404).json({ message: 'Audio file not found on server disk' });
    }

    analysis.status = 'transcribing';
    await analysis.save();

    // 1. Fetch user's keyword groups (seed default groups if empty)
    let keywordGroups = await KeywordGroup.find({ userId: req.user._id });
    if (keywordGroups.length === 0) {
      const defaultGroups = [
        { name: 'Security Alerts', color: '#ef4444', keywords: ['unauthorized', 'password', 'breached', 'risk', 'security', 'alert'] },
        { name: 'Financial Terms', color: '#06b6d4', keywords: ['refund', 'cancellation', 'transaction', 'cost', 'payment', 'charge'] },
        { name: 'Compliance & Audit', color: '#6366f1', keywords: ['compliance', 'protocol', 'verified', 'audit', 'supervisor', 'authorization'] },
        { name: 'Customer Satisfaction', color: '#10b981', keywords: ['help', 'requested', 'system', 'confirm', 'support'] },
      ];
      keywordGroups = await KeywordGroup.insertMany(defaultGroups.map((g) => ({ ...g, userId: req.user._id })));
    }

    const promptKeywords = keywordGroups.flatMap((g) => g.keywords || []).join(', ');

    // 2. Run Whisper AI transcription with prompt keyword context hints
    const { transcript, segments, words, durationMs, isFallback, transcriptionNotice } = await transcribeAudioFile(analysis.filePath, promptKeywords);

    // 3. Extract keyword timestamp proof matches
    const { matches, reliabilityScore } = extractProofMatches(transcript, words, keywordGroups);

    // OpenAI Whisper API Billing Rule: $0.006/min with 1-minute minimum billing per API call
    const actualDurationSecs = (durationMs || analysis.durationMs || 0) / 1000;
    const callCostUSD = Math.max(0.006, Math.ceil(Math.max(1, actualDurationSecs) / 60) * 0.006);

    // 4. Update analysis record in MongoDB
    analysis.transcript = transcript;
    analysis.segments = segments;
    analysis.words = words;
    analysis.keywordMatches = matches;
    analysis.reliabilityScore = reliabilityScore;
    analysis.durationMs = durationMs || analysis.durationMs;
    analysis.isFallback = isFallback || false;
    analysis.transcriptionNotice = transcriptionNotice || null;
    analysis.status = 'completed';
    analysis.transcriptionCount = (analysis.transcriptionCount || 0) + 1;
    analysis.apiCostUSD = (analysis.apiCostUSD || 0) + callCostUSD;
    await analysis.save();

    return res.json({
      message: 'AI transcription and keyword proof extraction completed successfully',
      analysis,
    });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    try {
      const { id } = req.params;
      await AudioAnalysis.updateOne(
        { _id: id, userId: req.user._id },
        { $set: { status: 'error', errorMessage: error.message } }
      );
    } catch (e) {
      console.error('Could not update error status in database:', e.message);
    }
    return res.status(400).json({ message: error.message || 'Failed to transcribe audio' });
  }
};

// @desc    Get all audio analyses for current user
// @route   GET /api/audio/list
// @access  Protected
const getAnalyses = async (req, res) => {
  try {
    const analyses = await AudioAnalysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ audioFiles: analyses });
  } catch (error) {
    console.error('Error fetching audio analyses:', error);
    return res.status(500).json({ message: 'Failed to fetch audio list' });
  }
};

// @desc    Delete audio analysis record and file
// @route   DELETE /api/audio/:id
// @access  Protected
const deleteAudio = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await AudioAnalysis.findOne({ _id: id, userId: req.user._id });

    if (!analysis) {
      return res.status(404).json({ message: 'Audio analysis record not found' });
    }

    if (fs.existsSync(analysis.filePath)) {
      try {
        fs.unlinkSync(analysis.filePath);
      } catch (e) {
        console.warn('Could not delete audio file from disk:', e.message);
      }
    }

    await AudioAnalysis.deleteOne({ _id: id });
    return res.json({ message: 'Audio analysis deleted successfully' });
  } catch (error) {
    console.error('Error deleting audio analysis:', error);
    return res.status(500).json({ message: 'Failed to delete audio analysis' });
  }
};

// @desc    Get single audio analysis details & transcript
// @route   GET /api/audio/analysis/:id
// @access  Protected
const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await AudioAnalysis.findOne({ _id: id, userId: req.user._id });

    if (!analysis) {
      return res.status(404).json({ message: 'Audio analysis record not found' });
    }

    const keywordGroups = await KeywordGroup.find({ userId: req.user._id });

    return res.json({
      analysis,
      keywordGroups,
    });
  } catch (error) {
    console.error('Error fetching analysis details:', error);
    return res.status(500).json({ message: 'Failed to fetch analysis record' });
  }
};

// @desc    Stream audio file for HTML5 audio player
// @route   GET /api/audio/stream/:id
// @access  Public or Protected
const streamAudio = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await AudioAnalysis.findById(id);

    if (!analysis || !fs.existsSync(analysis.filePath)) {
      return res.status(404).send('Audio file not found');
    }

    const filePath = analysis.filePath;
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': analysis.mimeType || 'audio/mpeg',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': analysis.mimeType || 'audio/mpeg',
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error('Error streaming audio:', error);
    return res.status(500).send('Streaming error');
  }
};

module.exports = {
  uploadAudio,
  transcribeAudio,
  getAnalyses,
  getAnalysisById,
  streamAudio,
  deleteAudio,
};
