// /routes/chatbotRoutes.js
const express = require('express');
const { ChatBot,DomainAndLevels } = require('../controllers/chatbotController');
const validateMessage = require('../middleware/validateMessage');

const router = express.Router();

router.post('/chatbot', validateMessage, ChatBot);
router.get('/domainsAndLevels', DomainAndLevels);


module.exports = router;
