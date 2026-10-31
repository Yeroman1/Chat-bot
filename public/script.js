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

// Helper: Scroll to bottom
function scrollToBottom() {
  messagesContainer.scrollTo({
    top: messagesContainer.scrollHeight,
    behavior: 'smooth'
  });
}

// Helper: Format message text safely (simple Markdown parsing)
function formatMessageText(text) {
  if (!text) return '';

  // Escape HTML entities to prevent XSS attacks
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Render code blocks: ```lang code ```
  escaped = escaped.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre class="code-block"><code>${code.trim()}</code></pre>`;
  });

  // Render inline code: `code`
  escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Render bold text: **bold text**
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Render new lines to line breaks
  escaped = escaped.replace(/\n/g, '<br>');

  return escaped;
}

// Helper: Append Message Bubble to the Chat window
function appendMessage(sender, text, isError = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${sender} ${isError ? 'message-error' : ''}`;

  const avatarSvg = sender === 'user' 
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
       </svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z"/>
        <path d="M12 8v8M8 12h8"/>
       </svg>`;

  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let footerContent = `<span class="message-time">${timeString}</span>`;
  if (sender === 'ai' && !isError) {
    footerContent = `
      <div class="bubble-footer">
        <button class="btn-speak-msg" title="Speak response">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path class="speaker-wave-icon-path" d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>
        <span class="message-time">${timeString}</span>
      </div>
    `;
  }

  messageDiv.innerHTML = `
    <div class="avatar">
      ${avatarSvg}
    </div>
    <div class="message-bubble">
      <div class="message-content">${formatMessageText(text)}</div>
      ${sender === 'ai' && !isError ? footerContent : `<span class="message-time">${timeString}</span>`}
    </div>
  `;

  // Insert before the typing indicator
  messagesContainer.insertBefore(messageDiv, typingIndicator);
  scrollToBottom();
}

// Show/Hide typing indicator
function showTypingIndicator() {
  typingIndicator.classList.remove('hidden');
  scrollToBottom();
}

function hideTypingIndicator() {
  typingIndicator.classList.add('hidden');
}

// Auto-resize input textarea and manage counts
messageInput.addEventListener('input', () => {
  // Auto grow/shrink
  messageInput.style.height = 'auto';
  const newHeight = Math.min(messageInput.scrollHeight, 120);
  messageInput.style.height = `${newHeight}px`;

  // Character counter
  const len = messageInput.value.length;
  charCounter.textContent = `${len} / 1000`;

  // Send button disabled status
  sendBtn.disabled = len === 0;
});

// Trigger submit on Enter, but preserve Shift+Enter newline
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event('submit'));
  }
});

// Form Submission Event
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userMessageText = messageInput.value.trim();
  if (!userMessageText) return;

  // Stop recording/speaking if active
  stopRecording();
  stopSpeaking();

  // Clear inputs and reset height
  messageInput.value = '';
  messageInput.style.height = 'auto';
  charCounter.textContent = '0 / 1000';
  sendBtn.disabled = true;

  // Add User bubble
  appendMessage('user', userMessageText);

  // Show typing animation
  showTypingIndicator();

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessageText,
        sessionId: sessionId
      })
    });

    const data = await response.json();

    hideTypingIndicator();

    if (response.ok && data.response) {
      appendMessage('ai', data.response);
      if (isVoiceModeOn) {
        speakMessageText(data.response);
      }
    } else {
      appendMessage('ai', data.error || 'Server error. Failed to process your message.', true);
    }
  } catch (err) {
    console.error('Fetch error:', err);
    hideTypingIndicator();
    appendMessage('ai', 'Connection lost. Please check if your server is running and try again.', true);
  }
});

// New Chat Reset Action
newChatBtn.addEventListener('click', async () => {
  // Stop recording/speaking if active
  stopRecording();
  stopSpeaking();

  // Confirm with a subtle UI fade or simple confirmation. Since it's a smooth design, let's reset instantly.
  try {
    const response = await fetch('/chat/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionId })
    });

    if (response.ok) {
      // Animate card content transition optionally, or clear messages
      const messages = messagesContainer.querySelectorAll('.message:not(.welcome-message)');
      messages.forEach(msg => {
        msg.style.animation = 'slideUpFade 0.2s reverse forwards';
        setTimeout(() => msg.remove(), 200);
      });

      // Reset Session ID to start fresh
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      sessionStorage.setItem('yeroeai_chat_session_id', sessionId);
      
      // Focus on message input
      setTimeout(() => {
        messageInput.focus();
      }, 300);
    } else {
      console.error('Server failed to reset conversation.');
    }
  } catch (error) {
    console.error('Error during reset request:', error);
  }
});

// Speech Recognition (Web Speech API) Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let isRecording = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    isRecording = true;
    micBtn.classList.add('recording');
    micBtn.title = "Listening... Click to stop";
    messageInput.placeholder = "Listening...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (transcript) {
      const currentText = messageInput.value;
      const spacing = currentText && !currentText.endsWith(' ') ? ' ' : '';
      messageInput.value = currentText + spacing + transcript;
      
      // Trigger character count, auto-resize, and enable send button
      messageInput.dispatchEvent(new Event('input'));
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    if (event.error === 'not-allowed') {
      alert("Microphone permission was denied. Please allow microphone access in your browser settings to use voice input.");
    }
    stopRecording();
  };

  recognition.onend = () => {
    stopRecording();
  };
} else {
  // Disable microphone button if browser doesn't support Web Speech API
  micBtn.disabled = true;
  micBtn.title = "Speech recognition is not supported in this browser.";
}

function startRecording() {
  if (!recognition) return;
  try {
    recognition.start();
  } catch (error) {
    console.error('Failed to start speech recognition:', error);
  }
}

function stopRecording() {
  isRecording = false;
  if (micBtn) {
    micBtn.classList.remove('recording');
    micBtn.title = "Voice Input";
  }
  if (messageInput) {
    messageInput.placeholder = "Ask me anything...";
  }
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {
      // Ignored if already stopped
    }
  }
}

micBtn.addEventListener('click', () => {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
});

