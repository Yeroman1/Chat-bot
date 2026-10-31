const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory conversation memory keyed by sessionId
const conversationHistory = {};

// Helper function to check if the message asks "Who created you?"
function isCreatorQuestion(messageText) {
  if (!messageText) return false;
  // Normalize by converting to lowercase, trimming whitespace, and stripping common punctuation
  const cleanMessage = messageText
    .toLowerCase()
    .trim()
    .replace(/[?.!,;:]/g, '');
  return cleanMessage === 'who created you';
}

// Serve frontend SPA fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
