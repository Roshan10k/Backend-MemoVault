const Achievements = require('../Model/achievementModel.js');

// Create a new achievement
const createAchievement = async (req, res) => {
    try {
        const { date, title, category, description, reflection } = req.body;
        const userId = req.user.id; // Assuming user is authenticated and userId is stored in the token

        const newAchievement = await Achievements.create({ date, title, category, description, reflection, userId });
        res.status(201).json({ message: "Achievement added successfully", achievement: newAchievement });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create achievement' });
    }
};

// Get all achievements of the authenticated user
const getAchievements = async (req, res) => {
    try {
        const achievements = await Achievements.findAll({
            where: { userId: req.user.id }, // Get achievements of the authenticated user only
        });
        res.status(200).json(achievements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve achievements' });
    }
};

// Get a specific achievement by ID
const getAchievementById = async (req, res) => {
    try {
        const achievement = await Achievements.findOne({
            where: { id: req.params.id, userId: req.user.id }, // Ensure achievement belongs to the user
        });
        
        if (!achievement) {
            return res.status(404).json({ message: "Achievement not found" });
        }
        
        res.status(200).json(achievement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve achievement' });
    }
};

// Update an achievement
const updateAchievement = async (req, res) => {
    try {
        const achievement = await Achievements.findOne({
            where: { id: req.params.id, userId: req.user.id }, // Ensure achievement belongs to the user
        });

        if (!achievement) {
            return res.status(404).json({ message: "Achievement not found" });
        }

        await achievement.update(req.body);
        res.status(200).json({ message: "Achievement updated successfully", achievement });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update achievement' });
    }
};

// Delete an achievement
const deleteAchievement = async (req, res) => {
    try {
        const achievement = await Achievements.findOne({
            where: { id: req.params.id, userId: req.user.id }, // Ensure achievement belongs to the user
        });

        if (!achievement) {
            return res.status(404).json({ message: "Achievement not found" });
        }

        await achievement.destroy();
        res.status(200).json({ message: "Achievement deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete achievement' });
    }
};

module.exports = {
    createAchievement,
    getAchievements,
    getAchievementById,
    updateAchievement,
    deleteAchievement,
};
