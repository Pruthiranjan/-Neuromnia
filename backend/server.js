// /server.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const chatbotRoutes = require('./routes/chatbotRoutes');
const { loadMilestones } = require('./controllers/chatbotController');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Routes
app.use('/api', chatbotRoutes);

// Start the server
const startNodeServer = async () => {
  try {
    await loadMilestones();
    app.listen(PORT, () => {
      console.log(`Backend is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to load milestones:', error);
  }
};

startNodeServer();
