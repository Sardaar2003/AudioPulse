const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
const { OpenAI } = require('openai');

async function testWhisperAPI() {
  console.log('--- OpenAI Whisper API Test Script ---');
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ ERROR: OPENAI_API_KEY is not defined in backend/.env');
    process.exit(1);
  }

  console.log(`🔑 Using API Key: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 8)}`);

  const uploadsDir = path.join(__dirname, 'uploads', 'audio');
  if (!fs.existsSync(uploadsDir)) {
    console.error(`❌ ERROR: Uploads directory does not exist: ${uploadsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(uploadsDir).filter((f) => /\.(mp3|wav|m4a|flac|ogg)$/i.test(f));
  if (files.length === 0) {
    console.error('❌ ERROR: No audio files found in uploads/audio directory to test.');
    process.exit(1);
  }

  const targetFile = path.join(uploadsDir, files[0]);
  console.log(`🎙️ Target Audio File: ${files[0]} (${(fs.statSync(targetFile).size / (1024 * 1024)).toFixed(2)} MB)`);

  const openai = new OpenAI({ apiKey: apiKey.trim() });

  try {
    console.log('🤖 Sending audio stream to OpenAI Whisper API (model: whisper-1)...');
    const audioStream = fs.createReadStream(targetFile);

    const response = await openai.audio.transcriptions.create({
      file: audioStream,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['word', 'segment'],
    });

    console.log('\n✅ --- TRANSCRIPTION SUCCESSFUL ---');
    console.log('Transcript Text Snippet:');
    console.log(response.text ? response.text.substring(0, 300) + '...' : '(Empty text)');
    console.log(`\nDuration: ${response.duration} seconds`);
    console.log(`Words Extracted: ${response.words ? response.words.length : 0}`);
    console.log(`Segments Extracted: ${response.segments ? response.segments.length : 0}`);

    if (response.words && response.words.length > 0) {
      console.log('\nSample Word Timestamps (First 5 words):');
      console.log(response.words.slice(0, 5));
    }
  } catch (err) {
    console.error('\n❌ --- TRANSCRIPTION FAILED ---');
    console.error(`Error Code / Status: ${err.status || err.code || 'UNKNOWN'}`);
    console.error(`Error Message: ${err.message}`);
    if (err.response) {
      console.error('API Error Response Details:', err.response.data);
    }
  }
}

testWhisperAPI();
