// /controllers/chatbotController.js
const asyncHandler = require('express-async-handler');

let milestones = [];

const loadMilestones = () => {
  const fs = require('fs');
  const csv = require('csv-parser');
  const path = require('path');

  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../vb_mapp_milestones.csv'))
      .pipe(csv())
      .on('data', (data) => milestones.push(data))
      .on('end', () => {
        console.log('CSV file loaded:', milestones.length, 'milestones');
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};
const getUniqueDomains = () => {
  const domains = new Set(milestones.map(m => m.Domain).filter(Boolean));
  return Array.from(domains);
};
const getUniqueLevels = () => {
  const levels = new Set(milestones.map(m => m.Level).filter(Boolean));
  return Array.from(levels);
};
// ChatBot Logic
const ChatBot = asyncHandler(async (req, res) => {
  const { message, code, domain, level } = req.body;
  if (message === 'Lookup Milestone') {
    const milestone = milestones.filter(m => m.Skill_Code.toLowerCase() === code.toLowerCase());
    if (milestone) {
      return res.json(milestone);
    } else {
      res.status(404).json({ status: 204, message: "FAILURE", error: 'Milestone not found' });
    }
  } else if (message === 'List Domain') {
    const filteredMilestones = milestones.filter(m => m.Domain.toLowerCase() === domain.toLowerCase() && m.Level.toLowerCase() === level.toLowerCase());
    if (filteredMilestones.length > 0) {
      return res.json(filteredMilestones);
    } else {
      res.status(404).json({ success: false, error: 'No milestones found for selected domain and level' });
    }
  } else {
    return res.status(400).json({ success: false, error: 'Invalid Message' });
  }
});
const DomainAndLevels = asyncHandler(async (req, res) => {
  try {
    const domains = getUniqueDomains();
    const levels = getUniqueLevels();
    return res.status(200).json({ domains, levels });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load domains' });
  }
});

module.exports = { ChatBot, DomainAndLevels,loadMilestones };
