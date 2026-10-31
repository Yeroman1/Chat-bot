# ✨ YeroeAI — Next-Gen Intelligent Conversational Assistant

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![UI Design](https://img.shields.io/badge/UI-Glassmorphism-purple.svg?style=flat-square)](#ui-and-design-philosophy)
[![Voice Mode](https://img.shields.io/badge/Voice-Speech%20Recognition%20%26%20TTS-orange.svg?style=flat-square)](#voice-interaction)

A premium, full-stack, glassmorphic conversational AI assistant web application featuring voice interactions, markdown parsing, custom persona memory, and OpenRouter API integration.

Developed by **Yeroman Diriba**, Software Engineering student at *Adama Science and Technology University*.

---

## 🚀 Features

- **🎨 Ultra-Modern Glassmorphic UI**: Ambient fluid glowing background orbs, frosted glass containers (`backdrop-filter: blur`), glowing neon borders, and custom micro-animations.
- **🎙️ Voice Mode & Speech Interaction**:
  - **Speech-to-Text (STT)**: Hands-free voice input via Web Speech API with real-time feedback.
  - **Text-to-Speech (TTS)**: Natural voice playback with accent selection and playback speed customization.
  - **Animated Audio Visualizer**: Real-time bouncing frequency bars during assistant speech.
- **🧠 Session Isolation & Memory**:
  - Persistent conversation history within unique browser sessions.
  - Context retention across multi-turn dialogues.
  - Seamless "New Chat" clearing and session renewal.
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
- **APIs**: OpenRouter API (`openai/gpt-4o-mini`), Web Speech API (Recognition & Synthesis)
- **Typography**: Google Fonts (*Outfit* and *Inter*)

---

## 📂 Project Structure

```
ai-chatbot/
├── public/
│   ├── index.html       # Single-page application structure
│   ├── style.css        # Glassmorphic styles and animations
│   └── script.js        # Client logic, voice engine & API integration
├── server.js            # Express server with OpenRouter & session memory
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
   Add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your_actual_key_here
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
| `POST` | `/chat` | Send user message and get AI completion |
| `POST` | `/chat/reset` | Clear conversation history for the session |
| `GET` | `/api/health` | Healthcheck and service status endpoint |
| `GET` | `/` | Serve frontend single-page application |

---

## 👨‍💻 Author

**Yeroman Diriba**
- Software Engineering Student at Adama Science and Technology University
- Full-Stack Developer & AI Solutions Enthusiast
- GitHub: [@Yeroman1](https://github.com/Yeroman1)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
