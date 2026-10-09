const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  uploadAudio,
  transcribeAudio,
  getAnalyses,
  getAnalysisById,
  streamAudio,
  deleteAudio,
} = require('../controllers/audioController');
const { protect } = require('../middleware/authMiddleware');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/audio');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.aac', '.wma'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext) || file.mimetype.startsWith('audio/') || file.mimetype === 'application/octet-stream') {
    cb(null, true);
  } else {
    cb(new Error('Invalid audio file format. Only audio files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max per file
});

router.post('/upload', protect, upload.array('audioFiles', 50), uploadAudio);
router.post('/transcribe/:id', protect, transcribeAudio);
router.get('/list', protect, getAnalyses);
router.get('/analysis/:id', protect, getAnalysisById);
router.get('/stream/:id', streamAudio);
router.delete('/:id', protect, deleteAudio);

module.exports = router;
