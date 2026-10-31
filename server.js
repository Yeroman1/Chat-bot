const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const AI_MODEL = process.env.AI_MODEL || 'google/gemini-2.5-flash';
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS) || 1000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory conversation memory keyed by sessionId
const conversationHistory = {};

// Master System Prompt with deep Afaan Oromoo linguistic grounding
const SYSTEM_PROMPT = `You are YeroeAI, an intelligent, helpful, and highly articulate AI assistant developed by Yeroman Diriba, a software engineering student at Adama Science and Technology University (ASTU) and full-stack developer who builds AI-powered web applications.

CORE IDENTITY & CREATOR RULES:
- Your name is YeroeAI.
- Your creator and developer is Yeroman Diriba from Adama Science and Technology University (ASTU).
- Never mention OpenAI, Google, Anthropic, or other model providers as your creator. Stay consistent with this identity rule at all times.
- If asked in English who created, developed, or built you, answer:
  "I was developed by Yeroman Diriba, a software engineering student at Adama Science and Technology University and a full-stack developer who builds AI-powered web applications."
- If asked in Afaan Oromoo who created, developed, or built you, answer:
  "Ani YeroeAI jedhama. Kan ani uumamee fi hojjetame Yeromaan Diribaatiin - barataa 'Software Engineering' Yuunivarsiitii Saayinsii fi Teeknooloojii Adaamaa (ASTU) fi full-stack developer AI-powered web applications ijaaruuni."

LANGUAGE MASTERY & ACCURACY GUIDELINES FOR AFAAN OROMOO:
1. Native Fluency & Natural Phrasing:
   - When the user communicates in Afaan Oromoo, always respond in fluent, grammatically accurate, and standard Afaan Oromoo using standard Qubee script.
   - Use correct vowel lengthening (aa, ee, ii, oo, uu), consonant gemination, and compound characters (ch, dh, ny, ph, sh).
   - Follow standard Subject-Object-Verb (SOV) grammatical structure.
   - Properly apply agglutinative suffixes, case markers, and postpositions (e.g., '-n', '-tu', '-dha', '-ti', '-f', '-irra', '-keessa', '-irraa').
2. Tone & Politeness:
   - Use natural greetings and respectful phrasing: "Akkam jirtu?", "Nagaa qabduu?", "Fayyaa keessanii?", "Akkam bultan?", "Akkam ooltan?".
3. Technical & Educational Terminology:
   - Use accurate Afaan Oromoo concepts:
     * Artificial Intelligence (AI) -> Sammuu-namtolchee
     * Computer -> Kompiitara
     * Internet / Web -> Marsariitii
     * Software / Program -> Sagantaa / Sooftiweerii
     * Data / Information -> Odeeffannoo
     * Science and Technology -> Saayinsii fi Teeknooloojii
4. Bilingual Flexibility:
   - If the user communicates in English, respond in natural English.
   - If the user asks for translations or explanations between English and Afaan Oromoo, provide accurate, high-fidelity translations.`;

// Helper function to detect creator questions in both English and Afaan Oromoo
function detectCreatorQuestion(messageText) {
  if (!messageText) return null;
  const cleanMessage = messageText
    .toLowerCase()
    .trim()
    .replace(/[?.!,;:'"`]/g, '')
    .replace(/\s+/g, ' ');

  const englishTriggers = [
    'who created you',
    'who made you',
    'who developed you',
    'who is your creator',
    'who built you',
    'who designed you',
    'who programmed you',
    'who is yeroman'
  ];

  const oromoTriggers = [
    'eenyutu si uume',
    'eenyuutu si uume',
    'eenyutu si hojjete',
    'eenyuutu si hojjete',
    'eenyu si uume',
    'eenyu si hojjete',
    'eenyutu si tolche',
    'eenyu si tolche',
    'eenyutu si qopheesse',
    'eenyu si qopheesse',
    'eenyutu si ijaare',
    'eenyu si ijaare',
    'eenyutu si barreesse',
    'eenyutu si guddise',
    'eenyutu si barsiise'
  ];

  if (englishTriggers.some(t => cleanMessage.includes(t))) return 'en';
  if (oromoTriggers.some(t => cleanMessage.includes(t))) return 'om';
  return null;
}

// POST /chat - Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const session = sessionId || 'default-session';

    // Initialize session history if it doesn't exist
    if (!conversationHistory[session]) {
      conversationHistory[session] = [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        }
      ];
    }

    // Intercept creator questions in English or Afaan Oromoo
    const creatorLang = detectCreatorQuestion(message);
    if (creatorLang) {
      let creatorReply = '';
      if (creatorLang === 'om' || language === 'om') {
        creatorReply = "Ani YeroeAI jedhama. Kan ani uumamee fi hojjetame Yeromaan Diribaatiin - barataa 'Software Engineering' Yuunivarsiitii Saayinsii fi Teeknooloojii Adaamaa (ASTU) fi full-stack developer AI-powered web applications ijaaruuni.";
      } else {
        creatorReply = 'I was developed by Yeroman Diriba, a software engineering student at Adama Science and Technology University and a full-stack developer who builds AI-powered web applications.';
      }
      
      // Store in memory to preserve history
      conversationHistory[session].push({ role: 'user', content: message });
      conversationHistory[session].push({ role: 'assistant', content: creatorReply });
      
      return res.json({ response: creatorReply });
    }

    // Add user message to history
    conversationHistory[session].push({ role: 'user', content: message });

    // Retrieve OpenRouter API Key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'your_key_here') {
      console.warn('Warning: OPENROUTER_API_KEY is not set properly in .env');
      const errorReply = 'API Key configuration error. Please make sure the OPENROUTER_API_KEY is set in your .env file.';
      return res.status(500).json({ error: errorReply });
    }

    // Send request to OpenRouter with configured model and max_tokens
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: AI_MODEL,
        messages: conversationHistory[session],
        max_tokens: MAX_TOKENS,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/Yeroman1/Chat-bot',
          'X-Title': 'YeroeAI'
        }
      }
    );

    // Validate OpenRouter response structure
    const aiResponse = response.data?.choices?.[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('Invalid response structure received from OpenRouter API.');
    }

    // Add AI response to history
    conversationHistory[session].push({ role: 'assistant', content: aiResponse });

    // Send response back to frontend
    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Error in /chat endpoint:', error.message);
    if (error.response) {
      console.error('OpenRouter API Details:', error.response.status, error.response.data);
    }
    
    res.status(500).json({ 
      error: 'An error occurred while processing your request. Please try again later.',
      details: error.response?.data?.error?.message || error.message 
    });
  }
});

// POST /chat/reset - Reset endpoint
app.post('/chat/reset', (req, res) => {
  const { sessionId } = req.body;
  const session = sessionId || 'default-session';

  conversationHistory[session] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT
    }
  ];
  res.json({ success: true, message: 'Conversation history reset successfully.' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'YeroeAI API',
    model: AI_MODEL,
    languages: ['Afaan Oromoo', 'English'],
    timestamp: new Date().toISOString()
  });
});

// Serve frontend SPA fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Configured AI Model: ${AI_MODEL}`);
});
