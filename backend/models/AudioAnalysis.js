const mongoose = require('mongoose');

const wordTimestampSchema = new mongoose.Schema(
  {
    word: String,
    start: Number, // in seconds
    end: Number,   // in seconds
  },
  { _id: false }
);

const segmentSchema = new mongoose.Schema(
  {
    id: Number,
    start: Number,
    end: Number,
    text: String,
  },
  { _id: false }
);

const proofMatchSchema = new mongoose.Schema(
  {
    groupId: String,
    groupName: String,
    color: String,
    keyword: String,
    startTime: Number,   // start time in seconds
    endTime: Number,     // end time in seconds
    formattedTime: String, // e.g. "01:24 - 01:27"
    contextSnippet: String, // surrounding text with [keyword] highlighted
    confidence: Number,     // e.g. 98.5%
  },
  { _id: false }
);

const audioAnalysisSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    folderName: {
      type: String,
      default: 'General',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: 'audio/mpeg',
    },
    status: {
      type: String,
      enum: ['uploaded', 'transcribing', 'completed', 'error'],
      default: 'uploaded',
    },
    transcript: {
      type: String,
      default: '',
    },
    segments: [segmentSchema],
    words: [wordTimestampSchema],
    keywordMatches: [proofMatchSchema],
    reliabilityScore: {
      type: Number,
      default: 100,
    },
    isFallback: {
      type: Boolean,
      default: false,
    },
    transcriptionNotice: {
      type: String,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    apiCostUSD: {
      type: Number,
      default: 0,
    },
    transcriptionCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

audioAnalysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('AudioAnalysis', audioAnalysisSchema);
