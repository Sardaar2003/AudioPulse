const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const logRoutes = require('./routes/logRoutes');
const audioRoutes = require('./routes/audioRoutes');
const keywordRoutes = require('./routes/keywordRoutes');

const requestLogger = require('./middleware/loggerMiddleware');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(requestLogger);
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/keywords', keywordRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Audio Analysis Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// Serve Frontend Static Assets in Production
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    } else {
      res.status(404).json({ message: `API Route ${req.originalUrl} not found` });
    }
  });
} else {
  // 404 Route Handler
  app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`⚡ Audio Analysis Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
