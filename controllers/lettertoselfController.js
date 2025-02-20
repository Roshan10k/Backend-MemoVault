const Letter = require("../Model/lettertoselfModel");

const createLetter = async (req, res) => {
    try {
        const { title, date, content } = req.body;
        const newLetter = await Letter.create({
            userId: req.user.id, // From auth middleware
            title,
            date,
            content
        });
        res.status(201).json({ message: "Letter saved successfully", letter: newLetter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save letter" });
    }
};

// Get all letters for a user
const getLettersByUser = async (req, res) => {
    try {
        const letters = await Letter.findAll({
            where: { userId: req.user.id }
        });
        res.status(200).json(letters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch letters" });
    }
};

// Get a single letter by ID
const getLetterById = async (req, res) => {
    try {
        const { id } = req.params;
        const letter = await Letter.findByPk(id);
        if (!letter) {
            return res.status(404).json({ message: "Letter not found" });
        }
        res.status(200).json(letter);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch letter" });
    }
};

// Update a letter
const updateLetter = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, content } = req.body;

        const letter = await Letter.findByPk(id);
        if (letter.userId !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await letter.update({ title, date, content });
        res.status(200).json({ message: "Letter updated successfully", letter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update letter" });
    }
};

// Delete a letter
const deleteLetter = async (req, res) => {
    try {
        const { id } = req.params;

        const letter = await Letter.findByPk(id);
        if (letter.userId !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await letter.destroy();
        res.status(200).json({ message: "Letter deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete letter" });
    }
};

module.exports = { createLetter, getLettersByUser, getLetterById, updateLetter, deleteLetter };
