# 🌐 AlphaTranslate - AI Language Translation Tool

> **CodeAlpha Artificial Intelligence Internship — Project 1: Language Translation Tool**  
> A full-stack, enterprise-grade neural translation and speech synthesis platform built with **React 19**, **TypeScript**, **Node.js/Express**, and Google Translation Services.

---

## 📌 Project Overview

**AlphaTranslate** is an interactive, multi-language translation application engineered for seamless text translation across **16+ global and Indian regional languages**. It is designed with a hybrid translation architecture:
1. **Google Cloud Translation API (Enterprise tier)**: Activated when a private Google API key is configured.
2. **High-Accuracy Google Neural Engine (Free live tier)**: Real-time public neural translation engine requiring no API keys.
3. **MyMemory Translation API**: Automatic secondary fallback.
4. **Contextual Offline Mock Fallback**: Ensures resilient operation even in isolated offline environments.

The frontend incorporates browser-native **Web Speech API** for natural audio speech synthesis, clipboard actions, responsive split-screen workspaces, live character counting, keyboard shortcuts (`Ctrl+Enter`), and persistent translation history.

---

## ✨ Features

- **Multi-Language Support**: Complete support for core Indian languages (**Tamil**, **Hindi**, **Telugu**, **Malayalam**, **Kannada**) and global languages (**English**, **French**, **Spanish**, **German**, **Japanese**, **Chinese**, **Arabic**, **Russian**, **Portuguese**, **Italian**, **Korean**).
- **Auto Language Detection**: Automatically recognizes input text language.
- **Bi-directional Language Swapping**: One-click instant language and text swapping with smooth animation.
- **Text-to-Speech (TTS) Articulation**: Native pronunciation of translated text powered by the browser Web Speech API.
- **Copy & Share**: Quick clipboard copy with toast notifications and native Web Share integration.
- **Keyboard Shortcuts**: Fast translation trigger via <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (or <kbd>Cmd</kbd> + <kbd>Enter</kbd>).
- **Translation History**: Persistent slide-out history drawer saved to `localStorage`, allowing one-click restore and item deletion.
- **Interactive UI Feedback**: Loading spinner, skeleton pulse placeholder, character limit meters (up to 5,000 chars), and clear buttons.
- **Secure Backend Gateway**: All external translation requests are proxied through an Express backend to keep API keys secure.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript (Strict Mode)
- **Bundler**: Vite 8 with optimized HMR
- **Icons**: Lucide React
- **Audio / TTS**: Browser Web Speech API (`window.speechSynthesis`)
- **Styling**: Modern Vanilla CSS Design System with dark glassmorphism, fluid typography, and custom micro-animations

### Backend
- **Runtime**: Node.js v24 + Express 4
- **Language**: TypeScript (`tsx` runner)
- **Security & Networking**: CORS middleware, Dotenv configuration, input sanitization, and HTTP error normalization
- **APIs**: Google Cloud Translation API v2 & Google Neural API Engine with multi-layer fallback

---

## 🔄 Translation Flow Architecture

```
[User Interface]
       │
       ▼ (Ctrl+Enter or Translate Button)
[Vite Frontend Client (/api/translate)]
       │
       ▼ (Reverse Proxy / CORS)
[Node.js Express Server (Port 5000)]
       │
       ├──► 1. Check for GOOGLE_TRANSLATE_API_KEY
       │         └──► If present: Call Google Cloud Translation API v2
       │
       ├──► 2. Google Neural Public Engine (Live High-Accuracy Fallback)
       │         └──► Translates in real-time with zero API key needed
       │
       ├──► 3. MyMemory Public Translation API (Secondary Fallback)
       │
       └──► 4. Offline Mock Dictionary (Emergency offline mode)
       │
       ▼ (Normalized JSON Response)
[Display Translated Text + Web Speech TTS + History Cache]
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Task-1 CodeAlpha"
```

### 2. Install Dependencies
You can install dependencies for all packages in one command:
```bash
npm run install:all
```
*(Or manually run `npm install` inside both `server/` and `client/` directories).*

---

## 🔑 Environment Variable Setup

The backend comes with pre-configured defaults so that it **works immediately out-of-the-box without requiring a paid API key**. 

If you have a Google Cloud Translation API key:
1. Navigate to the `server/` folder:
   ```bash
   cd server
   ```
2. Copy the template:
   ```bash
   cp .env.example .env
   ```
3. Open `server/.env` and insert your key:
   ```env
   PORT=5000
   GOOGLE_TRANSLATE_API_KEY=AIzaSyYourActualGoogleCloudKeyHere
   CLIENT_ORIGIN=http://localhost:5173
   ```

> **Note**: If `GOOGLE_TRANSLATE_API_KEY` is left empty, the server automatically uses the real live translation engine and fallback, ensuring 100% testability.

---

## 🏃 Running the Application

### Option A: Run Both Frontend & Backend Concurrently (Recommended)
From the root folder:
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

### Option B: Run Individually

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

---

## 📡 API Reference

### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "online",
  "service": "Language Translation Tool API",
  "internship": "CodeAlpha AI Internship",
  "configuredProvider": "MyMemory Live Public API (Fallback Ready)",
  "timestamp": "2026-09-30T17:30:00.000Z"
}
```

### Translate Text
```http
POST /api/translate
Content-Type: application/json
```
**Request Body:**
```json
{
  "text": "Hello, how are you today?",
  "sourceLanguage": "en",
  "targetLanguage": "ta"
}
```
**Response:**
```json
{
  "translatedText": "வணக்கம், இன்று எப்படி இருக்கிறீர்கள்?",
  "detectedSourceLanguage": "en",
  "sourceLanguage": "en",
  "targetLanguage": "ta",
  "provider": "mymemory",
  "timestamp": "2026-09-30T17:30:16.183Z"
}
```

---

## 🧪 Testing the Application

1. **Verify Backend**: Open `http://localhost:5000/api/health` in your browser or test with curl to verify `status: online`.
2. **Open Frontend**: Open `http://localhost:5173` in any modern web browser (Chrome, Edge, Firefox, Safari).
3. **Select Languages**:
   - Source: `English` or `Auto Detect`
   - Target: `Tamil`, `Hindi`, `Spanish`, `German`, `Japanese`, etc.
4. **Enter Text**:
   - Click one of the quick sample chips (e.g., *"Hello, how are you today?"*) or type custom text.
5. **Translate**:
   - Click **Translate Now** or press <kbd>Ctrl</kbd> + <kbd>Enter</kbd>.
   - View the translated text rendered in the target panel.
6. **Test Text-to-Speech (TTS)**:
   - Click the **Listen** speaker button on the target card to hear the audio playback.
7. **Test Copy & Swap**:
   - Click **Copy** to verify clipboard copy and toast confirmation.
   - Click **Swap** to switch source and target languages.
8. **Check History**:
   - Click the **History** button in the top navigation bar to open your past translations drawer.

---

## 📸 Screenshots

*(Add project screenshots here before submission)*

| Desktop Translation Workspace | Mobile Responsive View |
|:---:|:---:|
| ![Desktop View](https://via.placeholder.com/600x350?text=Desktop+Translation+Workspace) | ![Mobile View](https://via.placeholder.com/300x500?text=Mobile+View) |

---

## 🔮 Future Enhancements

- [ ] Voice Speech-to-Text input (Microphone input using Web Speech Recognition API).
- [ ] Document file translation (.txt, .docx, .pdf file uploads).
- [ ] Image OCR translation using Tesseract.js / Google Cloud Vision.
- [ ] Download translation result as PDF or formatted text file.

---

## 📄 License

This project is created as part of the **CodeAlpha Artificial Intelligence Internship**. Distributed under the MIT License.
