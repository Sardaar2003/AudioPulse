# 🎨 AudioPulse Frontend Client Documentation

> Modern React (Vite) client application for **AudioPulse**. Features a premium **Glassmorphism UI**, synchronized word-level audio playback seeking, drag-and-drop folder ingestion, interactive proof tables, custom dual-mode theme engine (`[ ☀️ LIGHT | 🌙 DARK ]`), and client-side **Vector PDF Audit Exporter**.

---

## 🏗️ Frontend Component Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── AudioPlayer.jsx           # HTML5 Audio Player & Imperative seekTo() Hook
│   │   ├── CustomModal.jsx           # Theme-matched Notification & Confirmation Modal
│   │   ├── KeywordManager.jsx        # Keyword Group & Color Palette Tagging UI
│   │   ├── Navbar.jsx                # Responsive Brand & Profile Navigation Bar
│   │   ├── ProofEvidenceTable.jsx    # Timestamp Evidence Matrix & Jump-to-Audio Buttons
│   │   ├── ProtectedRoute.jsx        # JWT Auth & Role Authorization Route Guard
│   │   ├── ReliabilityReportModal.jsx# Audit Modal & Vector PDF Exporter (jsPDF)
│   │   ├── SessionInvalidatedModal.jsx# Single-Session Invalidation Modal
│   │   ├── Sidebar.jsx               # Main Sidebar Navigation & Theme Toggle Widget
│   │   ├── ThemeToggle.jsx           # Dual-Option Segmented Theme Switcher
│   │   └── TranscriptViewer.jsx      # Interactive Synchronized Transcript Reader
│   ├── context/
│   │   ├── AuthContext.jsx           # User Session, JWT State, & Login/Logout Logic
│   │   └── ThemeContext.jsx          # Dark / Light Theme State Provider
│   ├── pages/
│   │   ├── AdminPanel.jsx            # User Approval Management & Role Promotion
│   │   ├── AnalysisDetails.jsx       # Full Acoustic Inspection Workspace
│   │   ├── ApiLogs.jsx               # Real-time API Logs Table with Search & Pagination
│   │   ├── AudioWorkspace.jsx        # Folder Drag-and-Drop Ingestion & Audio Batch Library
│   │   ├── Dashboard.jsx             # System Overview Dashboard
│   │   ├── Login.jsx                 # Glassmorphism Auth Login Page
│   │   ├── PendingApproval.jsx       # Pending User Account State View
│   │   └── Register.jsx              # User Registration Page
│   ├── styles/
│   │   └── index.css                 # Glassmorphism CSS Design Tokens & Media Queries
│   ├── utils/                        # Formatting & Helper Utilities
│   └── App.jsx                       # Main Router Layout Assembly
└── package.json
```

---

## 🎨 Design System & Theme Engine

- **Glassmorphism UI**: Backdrop blur (`backdrop-filter: blur(20px)`), frosted glass panels (`var(--glass-bg)`), subtle borders (`var(--glass-border)`), and ambient background glowing orbs (`.orb-1`, `.orb-2`, `.orb-3`).
- **Theme Variables**:
  - **Dark Mode**: Deep obsidian background (`#070913`), frosted dark glass (`rgba(15, 23, 42, 0.65)`), crisp white text (`#f8fafc`).
  - **Light Mode**: Clean slate background (`#f8fafc`), pure white glass (`rgba(255, 255, 255, 0.85)`), high-contrast dark text (`#0f172a`, `#334155`).
- **Segmented Control**: `ThemeToggle.jsx` renders a dual-segment button `[ ☀️ LIGHT | 🌙 DARK ]` with smooth CSS transitions.

---

## 🎵 Interactive Playback & PDF Export Highlights

### 1. Synchronized Word-Level Seeking
- `AudioPlayer.jsx` exposes `ref.current.seekTo(seconds)` via React `useImperativeHandle`.
- Clicking any row in `ProofEvidenceTable.jsx` or **clicking any word** in `TranscriptViewer.jsx` calls `seekTo(seconds)`, starting audio playback instantly at that exact second.

### 2. Client-Side PDF Audit Exporter
- Implemented in `ReliabilityReportModal.jsx` using `jsPDF` and `jspdf-autotable`.
- Exports a formatted compliance report (`.pdf`) featuring executive metadata, styled evidence tables, multi-page transcript text, and authenticity page numbers.

---

## 🛠️ Development Scripts

Run local development server:
```bash
npm run dev
```

Build production bundle:
```bash
npm run build
```
