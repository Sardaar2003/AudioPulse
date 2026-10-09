const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const transcribeAudioFile = async (filePath, promptKeywords = '') => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    throw new Error('OPENAI_API_KEY is missing in backend/.env. Please configure your OpenAI API Key.');
  }

  try {
    console.log(`🤖 Triggering OpenAI Whisper API for file: ${path.basename(filePath)}...`);
    const openai = new OpenAI({ apiKey: apiKey.trim() });
    const audioStream = fs.createReadStream(filePath);

    const requestParams = {
      file: audioStream,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['word', 'segment'],
    };

    if (promptKeywords && promptKeywords.trim()) {
      requestParams.prompt = promptKeywords.trim();
      console.log(`💡 OpenAI Whisper Prompt Keywords: "${requestParams.prompt}"`);
    }

    const response = await openai.audio.transcriptions.create(requestParams);

    console.log(`✅ OpenAI Whisper API transcription successful for ${path.basename(filePath)}`);

    return {
      transcript: response.text || '',
      segments: response.segments || [],
      words: response.words || [],
      durationMs: (response.duration || 0) * 1000,
    };
  } catch (err) {
    console.error(`❌ OpenAI Whisper API call failed for ${path.basename(filePath)}: ${err.message}`);
    throw new Error(`OpenAI Whisper API Error: ${err.message}`);
  }
};

module.exports = {
  transcribeAudioFile,
};
