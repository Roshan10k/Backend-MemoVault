const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

// Route to create a new achievement (authenticated)
router.post('/create', authMiddleware, achievementController.createAchievement);

// Route to get all achievements of the current authenticated user
router.get('/', authMiddleware, achievementController.getAchievements);

// Route to update an achievement (authenticated)
router.put('/:id', authMiddleware, achievementController.updateAchievement);

// Route to delete an achievement (authenticated)
router.delete('/:id', authMiddleware, achievementController.deleteAchievement);

module.exports = router;
