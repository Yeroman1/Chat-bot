// Elements
const chatCard = document.getElementById('chatCard');
const messagesContainer = document.getElementById('messagesContainer');
const typingIndicator = document.getElementById('typingIndicator');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const charCounter = document.getElementById('charCounter');
const sendBtn = document.getElementById('sendBtn');
const newChatBtn = document.getElementById('newChatBtn');
const newChatLabel = document.getElementById('newChatLabel');
const micBtn = document.getElementById('micBtn');
const voiceToggleBtn = document.getElementById('voiceToggleBtn');
const voiceStatusLabel = document.getElementById('voiceStatusLabel');
const voiceSettingsBtn = document.getElementById('voiceSettingsBtn');
const voiceSettingsDropdown = document.getElementById('voiceSettingsDropdown');
const voiceSettingsHeading = document.getElementById('voiceSettingsHeading');
const voiceSelect = document.getElementById('voiceSelect');
const voiceSelectLabel = document.getElementById('voiceSelectLabel');
const voiceSpeed = document.getElementById('voiceSpeed');
const voiceSpeedLabel = document.getElementById('voiceSpeedLabel');
const speedVal = document.getElementById('speedVal');
const voiceVisualizer = document.getElementById('voiceVisualizer');

// Language Elements
const langToggleBtn = document.getElementById('langToggleBtn');
const langName = document.getElementById('langName');
const langBadge = document.getElementById('langBadge');
const headerStatusText = document.getElementById('headerStatusText');
const welcomeGreeting = document.getElementById('welcomeGreeting');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const suggestionsTitle = document.getElementById('suggestionsTitle');
const suggestionsChips = document.getElementById('suggestionsChips');

// Language Dictionaries
const UI_TRANSLATIONS = {
  om: {
    langName: 'Afaan Oromoo',
    langBadge: 'OM',
    headerStatus: 'Waan feete gaafadhu',
    welcomeGreeting: `Akkam jirtu! Ani <strong>YeroeAI</strong>, gargaaraa keessan isa sammuu-namtolcheeti. Har'a pirojektii, qunnamtii ykn yaada keessan maaliin isin gargaaruu danda'a?`,
    inputPlaceholder: 'Waan barbaadde na gaafadhu...',
    listeningPlaceholder: 'Dhaggeeffachaa jira...',
    newChat: 'Haaraa Eegali',
    voiceOn: 'Sagalee BANI',
    voiceOff: 'Sagalee DHAAMI',
    voiceSettingsHeading: "Qindaa'ina Sagalee",
    voiceSelectLabel: 'Sagalee Filadhu / Accent',
    voiceSpeedLabel: 'Saffisa Sagalee',
    suggestionsTitle: 'Fakkeenyaaf Gaafadhu / Suggested Prompts:',
    micTitle: 'Sagaleen Gaafadhu (Afaan Oromoo / English)',
    sendTitle: 'Ergi / Send message',
    suggestions: [
      "Eenyutu si uume?",
      "Sammuu-namtolcheen (AI) maali?",
      "Akkamitti Python barachuu danda'a?",
      "Waa'ee Yuunivarsiitii ASTU natti himi"
    ]
  },
  en: {
    langName: 'English',
    langBadge: 'EN',
    headerStatus: 'Ask anything',
    welcomeGreeting: `Greetings. I am <strong>YeroeAI</strong>, an intelligent assistant developed by Yeroman Diriba. How can I assist you with your project, design, or ideas today?`,
    inputPlaceholder: 'Ask me anything...',
    listeningPlaceholder: 'Listening...',
    newChat: 'New Chat',
    voiceOn: 'Voice ON',
    voiceOff: 'Voice OFF',
    voiceSettingsHeading: 'Voice Settings',
    voiceSelectLabel: 'Select Accent / Voice',
    voiceSpeedLabel: 'Playback Speed',
    suggestionsTitle: 'Quick Suggested Prompts:',
    micTitle: 'Voice Input',
    sendTitle: 'Send message',
    suggestions: [
      "Who created you?",
      "What is Artificial Intelligence?",
      "How do I start learning Python?",
      "Tell me about ASTU University"
    ]
  }
};

// Initialize Active Language
let currentLanguage = localStorage.getItem('yeroeai_lang') || 'om';

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

// Render dynamic suggestion chips
function renderSuggestions() {
  if (!suggestionsChips) return;
  suggestionsChips.innerHTML = '';
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.om;
  
  t.suggestions.forEach(promptText => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'suggestion-chip';
    chip.innerHTML = `<span>💬</span> ${promptText}`;
    chip.addEventListener('click', () => {
      messageInput.value = promptText;
      messageInput.dispatchEvent(new Event('input'));
      messageInput.focus();
      chatForm.dispatchEvent(new Event('submit'));
    });
    suggestionsChips.appendChild(chip);
  });
}

// Switch UI language
function applyLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('yeroeai_lang', lang);
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.om;

  if (langName) langName.textContent = t.langName;
  if (langBadge) langBadge.textContent = t.langBadge;
  if (headerStatusText) headerStatusText.textContent = t.headerStatus;
  if (welcomeGreeting) welcomeGreeting.innerHTML = t.welcomeGreeting;
  if (messageInput) messageInput.placeholder = isRecording ? t.listeningPlaceholder : t.inputPlaceholder;
  if (newChatLabel) newChatLabel.textContent = t.newChat;
  if (voiceSettingsHeading) voiceSettingsHeading.textContent = t.voiceSettingsHeading;
  if (voiceSelectLabel) voiceSelectLabel.textContent = t.voiceSelectLabel;
  if (voiceSpeedLabel) voiceSpeedLabel.textContent = t.voiceSpeedLabel;
  if (suggestionsTitle) suggestionsTitle.textContent = t.suggestionsTitle;
  if (micBtn) micBtn.title = t.micTitle;
  if (sendBtn) sendBtn.title = t.sendTitle;

  updateVoiceToggleUI();
  renderSuggestions();

  // Update Web Speech recognition language
  if (recognition) {
    recognition.lang = (lang === 'om') ? 'om-ET' : 'en-US';
  }
}

// Toggle language event listener
if (langToggleBtn) {
  langToggleBtn.addEventListener('click', () => {
    const nextLang = currentLanguage === 'om' ? 'en' : 'om';
    applyLanguage(nextLang);
  });
}

// Helper: Append Message Bubble to the Chat window
function appendMessage(sender, text, isError = false) {
  // Hide starter suggestions once first message is sent
  if (suggestionsContainer) {
    suggestionsContainer.style.display = 'none';
  }

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
        <button class="btn-speak-msg" title="Sagaleen Dubbisi | Speak response">
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

  if (sender === 'ai' && !isError) {
    const speakBtn = messageDiv.querySelector('.btn-speak-msg');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        speakMessageText(text, speakBtn);
      });
    }
  }

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
  messageInput.style.height = 'auto';
  const newHeight = Math.min(messageInput.scrollHeight, 120);
  messageInput.style.height = `${newHeight}px`;

  const len = messageInput.value.length;
  charCounter.textContent = `${len} / 1000`;
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
        sessionId: sessionId,
        language: currentLanguage
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
      appendMessage('ai', data.error || (currentLanguage === 'om' ? "Dogoggora sarvaraati. Maaloo irra deebiaa yaalaa." : 'Server error. Failed to process your message.'), true);
    }
  } catch (err) {
    console.error('Fetch error:', err);
    hideTypingIndicator();
    appendMessage('ai', currentLanguage === 'om' ? "Qunnamtiin addaan cite. Maaloo sarvarri keessan hojjachaa jiraachuu mirkaneessaa." : 'Connection lost. Please check if your server is running and try again.', true);
  }
});

// New Chat Reset Action
newChatBtn.addEventListener('click', async () => {
  stopRecording();
  stopSpeaking();

  try {
    const response = await fetch('/chat/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionId })
    });

    if (response.ok) {
      const messages = messagesContainer.querySelectorAll('.message:not(.welcome-message)');
      messages.forEach(msg => {
        msg.style.animation = 'slideUpFade 0.2s reverse forwards';
        setTimeout(() => msg.remove(), 200);
      });

      // Re-display suggestion chips
      if (suggestionsContainer) {
        suggestionsContainer.style.display = 'block';
      }

      sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      sessionStorage.setItem('yeroeai_chat_session_id', sessionId);
      
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
  recognition.lang = currentLanguage === 'om' ? 'om-ET' : 'en-US';

  recognition.onstart = () => {
    isRecording = true;
    micBtn.classList.add('recording');
    const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.om;
    micBtn.title = t.listeningPlaceholder;
    messageInput.placeholder = t.listeningPlaceholder;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (transcript) {
      const currentText = messageInput.value;
      const spacing = currentText && !currentText.endsWith(' ') ? ' ' : '';
      messageInput.value = currentText + spacing + transcript;
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
  micBtn.disabled = true;
  micBtn.title = "Speech recognition is not supported in this browser.";
}

function startRecording() {
  if (!recognition) return;
  try {
    recognition.lang = currentLanguage === 'om' ? 'om-ET' : 'en-US';
    recognition.start();
  } catch (error) {
    console.error('Failed to start speech recognition:', error);
  }
}

function stopRecording() {
  isRecording = false;
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.om;
  if (micBtn) {
    micBtn.classList.remove('recording');
    micBtn.title = t.micTitle;
  }
  if (messageInput) {
    messageInput.placeholder = t.inputPlaceholder;
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
    stopSpeaking();
    startRecording();
  }
});

// Voice Mode (Speech Synthesis) Setup
let isVoiceModeOn = localStorage.getItem('yeroeai_voice_mode') === 'true';
let selectedVoiceName = localStorage.getItem('yeroeai_selected_voice');
let playbackSpeed = parseFloat(localStorage.getItem('yeroeai_playback_speed')) || 1.0;
let currentUtterance = null;
let speakingElement = null;

function updateVoiceToggleUI() {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.om;
  if (isVoiceModeOn) {
    voiceToggleBtn.classList.add('voice-on');
    if (voiceStatusLabel) voiceStatusLabel.textContent = t.voiceOn;
  } else {
    voiceToggleBtn.classList.remove('voice-on');
    if (voiceStatusLabel) voiceStatusLabel.textContent = t.voiceOff;
    stopSpeaking();
  }
}

let voices = [];
function populateVoiceList() {
  if (typeof speechSynthesis === 'undefined') return;
  voices = speechSynthesis.getVoices();
  
  voiceSelect.innerHTML = '';
  
  const sortedVoices = [...voices].sort((a, b) => {
    const aMatch = a.lang.startsWith('om') || a.lang.startsWith('en');
    const bMatch = b.lang.startsWith('om') || b.lang.startsWith('en');
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return a.name.localeCompare(b.name);
  });

  sortedVoices.forEach(voice => {
    const option = document.createElement('option');
    option.textContent = `${voice.name} (${voice.lang})`;
    option.value = voice.name;
    if (voice.name === selectedVoiceName) {
      option.selected = true;
    }
    voiceSelect.appendChild(option);
  });

  if (!selectedVoiceName && sortedVoices.length > 0) {
    const defaultVoice = sortedVoices.find(v => v.lang.includes('US') || v.lang.includes('GB')) || sortedVoices[0];
    if (defaultVoice) {
      selectedVoiceName = defaultVoice.name;
      localStorage.setItem('yeroeai_selected_voice', selectedVoiceName);
      voiceSelect.value = selectedVoiceName;
    }
  }
}

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

voiceSpeed.value = playbackSpeed;
speedVal.textContent = `${playbackSpeed.toFixed(1)}x`;

voiceSpeed.addEventListener('input', (e) => {
  playbackSpeed = parseFloat(e.target.value);
  speedVal.textContent = `${playbackSpeed.toFixed(1)}x`;
  localStorage.setItem('yeroeai_playback_speed', playbackSpeed);
});

voiceSelect.addEventListener('change', (e) => {
  selectedVoiceName = e.target.value;
  localStorage.setItem('yeroeai_selected_voice', selectedVoiceName);
});

voiceSettingsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  voiceSettingsDropdown.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!voiceSettingsDropdown.classList.contains('hidden') && 
      !voiceSettingsDropdown.contains(e.target) && 
      e.target !== voiceSettingsBtn && 
      !voiceSettingsBtn.contains(e.target)) {
    voiceSettingsDropdown.classList.add('hidden');
  }
});

voiceToggleBtn.addEventListener('click', () => {
  isVoiceModeOn = !isVoiceModeOn;
  localStorage.setItem('yeroeai_voice_mode', isVoiceModeOn);
  updateVoiceToggleUI();
});

function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, '[Code block]')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

function speakMessageText(text, bubbleSpeakBtn = null) {
  if (typeof speechSynthesis === 'undefined') return;

  stopSpeaking();

  const cleanedText = cleanTextForSpeech(text);
  if (!cleanedText) return;

  currentUtterance = new SpeechSynthesisUtterance(cleanedText);
  currentUtterance.rate = playbackSpeed;

  if (selectedVoiceName) {
    const voiceObj = voices.find(v => v.name === selectedVoiceName);
    if (voiceObj) {
      currentUtterance.voice = voiceObj;
    }
  }

  currentUtterance.onstart = () => {
    voiceToggleBtn.classList.add('speaking');
    voiceVisualizer.classList.remove('hidden');
    if (bubbleSpeakBtn) {
      speakingElement = bubbleSpeakBtn;
      speakingElement.classList.add('active-speaking');
    }
  };

  const handleEnd = () => {
    voiceToggleBtn.classList.remove('speaking');
    voiceVisualizer.classList.add('hidden');
    if (speakingElement) {
      speakingElement.classList.remove('active-speaking');
      speakingElement = null;
    }
    currentUtterance = null;
  };

  currentUtterance.onend = handleEnd;
  currentUtterance.onerror = handleEnd;

  speechSynthesis.speak(currentUtterance);
}

function stopSpeaking() {
  if (typeof speechSynthesis === 'undefined') return;
  speechSynthesis.cancel();
  
  voiceToggleBtn.classList.remove('speaking');
  voiceVisualizer.classList.add('hidden');
  if (speakingElement) {
    speakingElement.classList.remove('active-speaking');
    speakingElement = null;
  }
  currentUtterance = null;
}

// Apply initial language state
applyLanguage(currentLanguage);

// Focus input on load
messageInput.focus();
