require('dotenv').config();
const { OpenAI } = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
console.log('Key:', apiKey ? `${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 8)}` : 'NONE');

if (!apiKey) {
  console.log('No OPENAI_API_KEY found in .env');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: apiKey.trim() });

openai.models.list()
  .then((res) => console.log('✅ OpenAI Authentication SUCCESS! Total models:', res.data.length))
  .catch((err) => console.error('❌ OpenAI Auth Error:', err.status, err.message));
