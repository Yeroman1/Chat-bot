# ✨ YeroeAI — Next-Gen Intelligent Conversational Assistant (Afaan Oromoo & English)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Languages](https://img.shields.io/badge/Languages-Afaan%20Oromoo%20%7C%20English-teal.svg?style=flat-square)](#-bilingual-excellence-afaan-oromoo--english)
[![UI Design](https://img.shields.io/badge/UI-Glassmorphism-purple.svg?style=flat-square)](#ui-and-design-philosophy)
[![Voice Mode](https://img.shields.io/badge/Voice-Speech%20Recognition%20(om--ET%20%26%20en--US)-orange.svg?style=flat-square)](#voice-interaction)

A premium, full-stack, glassmorphic conversational AI assistant web application featuring native **Afaan Oromoo** and **English** language support, voice interactions, markdown parsing, custom persona memory, and OpenRouter API integration.

Developed by **Yeroman Diriba**, Software Engineering student at *Adama Science and Technology University (ASTU)*.

---

## 🌟 Bilingual Excellence (Afaan Oromoo & English)

YeroeAI features specialized enhancements for high-fidelity **Afaan Oromoo** conversational intelligence:
- **🔤 Qubee Orthography & Grammar Grounding**: Adheres to standard Qubee vowel lengthening (`aa, ee, ii, oo, uu`), consonant gemination, compound letters (`ch, dh, ny, ph, sh`), and natural Subject-Object-Verb (SOV) grammatical order.
- **⚡ High-Capacity Language Model**: Powered by Google's state-of-the-art multilingual model (`google/gemini-2.5-flash`), trained extensively on Ethiopian and Cushitic language datasets.
- **🌐 One-Click UI Language Toggle**: Seamlessly switch between **Afaan Oromoo (OM)** and **English (EN)** directly from the chat header.
- **🎙️ Speech Recognition (STT)**: Supports both `om-ET` (Oromo - Ethiopia) and `en-US` via the Web Speech API.
- **💡 Quick Starter Suggestion Chips**: Interactive prompt pills in both Afaan Oromoo (*"Eenyutu si uume?"*, *"Sammuu-namtolcheen (AI) maali?"*) and English.
- **🛡️ Localized Identity Handler**: Detects creator questions in both languages (*"Eenyutu si uume?"*, *"Who created you?"*) and responds with the official identity.

---

## 🚀 Key Features

- **🎨 Ultra-Modern Glassmorphic UI**: Ambient fluid glowing background orbs, frosted glass containers (`backdrop-filter: blur`), glowing neon borders, and custom micro-animations.
- **🎙️ Voice Mode & Speech Interaction**:
  - **Speech-to-Text (STT)**: Hands-free voice input with real-time visual feedback and locale adaptation.
  - **Text-to-Speech (TTS)**: Natural voice playback with accent selection and playback speed customization.
  - **Animated Audio Visualizer**: Real-time bouncing frequency waves during speech synthesis.
- **🧠 Session Isolation & Memory**:
  - Persistent conversation history within unique browser sessions.
  - Context retention across multi-turn dialogues.
  - Instant "New Chat" clearing and session renewal.
- **🤖 Branded Persona Engine**:
  - Custom persona identity configuration with intelligent creator query normalization and detection.
- **📝 Rich Markdown & Code Formatting**:
  - Code syntax highlighting blocks with built-in one-click clipboard copying.
  - Safe HTML escaping against Cross-Site Scripting (XSS).
- **📱 Fully Responsive Design**:
  - Optimized for desktop, ultra-wide displays, tablets, and mobile smartphones.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, Axios, dotenv, CORS
- **Frontend**: Vanilla JavaScript (ES6+), Modern Semantic HTML5, CSS3 Custom Properties (Variables)
- **AI Engine**: OpenRouter API (`google/gemini-2.5-flash` / `openai/gpt-4o-mini`), Web Speech API (STT & TTS)
- **Typography**: Google Fonts (*Outfit* and *Inter*)

---

## 📂 Project Structure

```
ai-chatbot/
├── public/
│   ├── index.html       # Single-page application structure & language toggle
│   ├── style.css        # Glassmorphic styles, suggestions & animations
│   └── script.js        # Bilingual logic, speech engine & API integration
├── server.js            # Express server with OpenRouter & Afaan Oromoo persona
├── package.json         # Node.js dependencies & scripts
├── .env.example         # Template for environment variables
├── .gitignore           # Git ignore configuration
├── LICENSE              # MIT License
└── README.md            # Comprehensive project documentation
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (installed with Node.js)
- An API Key from [OpenRouter](https://openrouter.ai/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Yeroman1/Chat-bot.git
   cd Chat-bot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your OpenRouter API key and preferred model:
   ```env
   OPENROUTER_API_KEY=your_actual_key_here
   AI_MODEL=google/gemini-2.5-flash
   MAX_TOKENS=1000
   PORT=3001
   ```

4. **Start the application**:
   ```bash
   npm start
   ```
   For development with automatic reload (nodemon):
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to `http://localhost:3001`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/chat` | Send user message (Afaan Oromoo / English) and get AI response |
| `POST` | `/chat/reset` | Clear conversation history for the session |
| `GET` | `/api/health` | Healthcheck, active AI model, and supported languages |
| `GET` | `/` | Serve frontend single-page application |

---

## 👨‍💻 Author

**Yeroman Diriba**
- Software Engineering Student at Adama Science and Technology University (ASTU)
- Full-Stack Developer & AI Solutions Enthusiast
- GitHub: [@Yeroman1](https://github.com/Yeroman1)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
