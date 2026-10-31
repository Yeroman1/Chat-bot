// Elements
const chatCard = document.getElementById('chatCard');
const messagesContainer = document.getElementById('messagesContainer');
const typingIndicator = document.getElementById('typingIndicator');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const charCounter = document.getElementById('charCounter');
const sendBtn = document.getElementById('sendBtn');
const newChatBtn = document.getElementById('newChatBtn');
const micBtn = document.getElementById('micBtn');
const voiceToggleBtn = document.getElementById('voiceToggleBtn');
const voiceSettingsBtn = document.getElementById('voiceSettingsBtn');
const voiceSettingsDropdown = document.getElementById('voiceSettingsDropdown');
const voiceSelect = document.getElementById('voiceSelect');
const voiceSpeed = document.getElementById('voiceSpeed');
const speedVal = document.getElementById('speedVal');
const voiceVisualizer = document.getElementById('voiceVisualizer');

// Initialize Session ID
let sessionId = sessionStorage.getItem('yeroeai_chat_session_id');
if (!sessionId) {
  sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  sessionStorage.setItem('yeroeai_chat_session_id', sessionId);
}

// Initial state
sendBtn.disabled = true;

