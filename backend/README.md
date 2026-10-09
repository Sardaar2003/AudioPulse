# ⚙️ AudioPulse Backend Service Documentation

> Node.js & Express REST API backend powering **AudioPulse Audio Analysis Suite**. Handles JWT authentication, MongoDB Atlas storage, file upload management via Multer, OpenAI Whisper API transcription (`whisper-1`), keyword proof evidence extraction, and real-time API activity logging.

---

## 🏗️ Backend Directory Overview

```text
backend/
├── config/
│   └── db.js               # Mongoose MongoDB Atlas Connection Module
├── controllers/
│   ├── adminController.js  # User Approval & Admin User Management
│   ├── audioController.js  # Upload, Transcribe, List, Analysis, & Stream Controls
│   ├── authController.js   # Login, Register, Logout, & Session Refresh
│   ├── keywordController.js# Keyword Group CRUD & Default Seeding Logic
│   └── logController.js    # API Activity Logs Query & Filtering Controller
├── middleware/
│   ├── adminMiddleware.js  # Admin Role Authorization Middleware
│   ├── authMiddleware.js   # JWT Token Protection & Single-Session Validator
│   └── loggerMiddleware.js # Real-time HTTP Request & Response Interceptor
├── models/
│   ├── AudioAnalysis.js    # Audio Metadata, Transcript, Words & Proof Schema
│   ├── KeywordGroup.js     # Keyword Groups & Tag Color Schema
│   ├── Log.js              # Real-Time API Logs Schema
│   └── User.js             # User Accounts & Role Permissions Schema
├── routes/
│   ├── adminRoutes.js      # /api/admin Endpoints
│   ├── audioRoutes.js      # /api/audio Endpoints (Upload, Transcribe, Stream)
│   ├── authRoutes.js       # /api/auth Endpoints (Login, Register, Session)
│   ├── keywordRoutes.js    # /api/keywords Endpoints
│   └── logRoutes.js        # /api/logs Endpoints
├── services/
│   ├── whisperService.js   # OpenAI Whisper API SDK Integration & Prompt Hints
│   └── proofMatcher.js     # Regex Proof Extraction & Word Timestamp Resolver
├── uploads/audio/          # Multer Audio File Upload Storage Directory
├── server.js               # Main Express Server Entrypoint
├── seedAdmin.js            # Admin Account Pre-seeding Utility Script
└── test_whisper.js         # CLI Test Script for OpenAI Whisper API
```

---

## 📡 API Endpoint Reference

### 1. Audio Management (`/api/audio`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/audio/upload` | Protected | Upload single audio file or folder batch (`audioFiles`) |
| `POST` | `/api/audio/transcribe/:id` | Protected | Trigger OpenAI Whisper API & proof matching engine |
| `GET` | `/api/audio/list` | Protected | Retrieve all audio records for current user |
| `GET` | `/api/audio/analysis/:id` | Protected | Fetch single audio analysis document & proof matrix |
| `GET` | `/api/audio/stream/:id` | Public | Stream HTML5 audio with byte-range header support |
| `DELETE` | `/api/audio/:id` | Protected | Permanently delete audio analysis record and file |

### 2. Keyword Intelligence (`/api/keywords`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/keywords` | Protected | Fetch user keyword groups (auto-seeds defaults if empty) |
| `POST` | `/api/keywords` | Protected | Create or update keyword group with color tags |
| `DELETE` | `/api/keywords/:id` | Protected | Delete keyword group |

### 3. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT token |
| `POST` | `/api/auth/register` | Public | Register new user account (defaults to pending approval) |
| `POST` | `/api/auth/logout` | Protected | Invalidate current user session token |
| `GET` | `/api/auth/me` | Protected | Get current user profile & approval status |

---

## 🧠 Core Processing Services

### 1. OpenAI Whisper Service (`services/whisperService.js`)
Invokes OpenAI's official SDK:
```javascript
const response = await openai.audio.transcriptions.create({
  file: audioStream,
  model: 'whisper-1',
  response_format: 'verbose_json',
  timestamp_granularities: ['word', 'segment'],
  prompt: promptKeywords, // Keyword hints to guide model recognition
});
```
Returns transcript text, 2,300+ word timestamps (`word`, `start`, `end`), and sentence segments.

### 2. Proof Matcher Engine (`services/proofMatcher.js`)
- Performs regex searches for keywords in transcript text.
- Resolves precise start/end timestamps (`mm:ss`) using character ratio search radius matching.
- Extracts context snippets (`...attempt on the server [password] reset required...`) with highlighted terms.
- Calculates overall Reliability Score (100% baseline).

---

## 🧪 Testing Backend Services

Run CLI test script to verify OpenAI Whisper API integration:
```bash
node test_whisper.js
```
