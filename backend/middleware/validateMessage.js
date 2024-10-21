// /middleware/validateMessage.js
const validateMessage = (req, res, next) => {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message must be a non-empty string' });
    }
    next();
  };
  
  module.exports = validateMessage;
  