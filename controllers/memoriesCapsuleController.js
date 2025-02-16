const Memory = require("../Model/memoriesCapsuleModel.js");
const path = require("path");
const fs = require("fs");

// Create a new memory
const createMemory = async (req, res) => {
    try {
        const { title, message, dateCreated, openDate } = req.body;
        const imageUrl = req.file ? req.file.filename : null;

        const newMemory = await Memory.create({
            userId: req.user.id,  // Ensure memory is linked to logged-in user
            title,
            message,
            dateCreated,
            openDate,
            imageUrl,
        });

        res.status(201).json({ message: "Memory saved successfully", memory: newMemory });
        console.log("New memory created:", newMemory);
    } catch (error) {
        console.error("Error creating memory:", error.message);
        res.status(500).json({ error: "Failed to save memory", details: error.message });
    }
};

// Get all memories of the logged-in user
const getMemories = async (req, res) => {
    try {
        const memories = await Memory.findAll({
            where: { userId: req.user.id },  // Fetch only logged-in user's memories
        });
        res.status(200).json(memories);
        console.log(`Retrieved ${memories.length} memories for user ID: ${req.user.id}`);
    } catch (error) {
        console.error("Error retrieving memories:", error.message);
        res.status(500).json({ error: "Failed to retrieve memories", details: error.message });
    }
};

// Get a specific memory by ID (only if it belongs to the logged-in user)
const getMemoryById = async (req, res) => {
    try {
        const memory = await Memory.findOne({
            where: { id: req.params.id, userId: req.user.id },  // Ensure memory belongs to user
        });

        if (!memory) {
            return res.status(404).json({ message: "Memory not found or unauthorized" });
        }

        res.status(200).json(memory);
    } catch (error) {
        console.error("Error retrieving memory:", error.message);
        res.status(500).json({ error: "Failed to retrieve memory", details: error.message });
    }
};

// Update memory (only if it belongs to the logged-in user)
const updateMemory = async (req, res) => {
    try {
        const memory = await Memory.findOne({
            where: { id: req.params.id, userId: req.user.id },  // Ensure memory belongs to user
        });

        if (!memory) {
            return res.status(404).json({ message: "Memory not found or unauthorized" });
        }

        // Delete old image if a new one is uploaded
        if (req.file && memory.imageUrl) {
            const oldImagePath = path.join(__dirname, "../uploads", memory.imageUrl);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const updatedMemory = await memory.update({
            title: req.body.title || memory.title,
            message: req.body.message || memory.message,
            dateCreated: req.body.dateCreated || memory.dateCreated,
            openDate: req.body.openDate || memory.openDate,
            imageUrl: req.file ? req.file.filename : memory.imageUrl,
        });

        res.status(200).json({ message: "Memory updated successfully", memory: updatedMemory });
    } catch (error) {
        console.error("Error updating memory:", error.message);
        res.status(500).json({ error: "Failed to update memory", details: error.message });
    }
};

// Delete memory (only if it belongs to the logged-in user)
const deleteMemory = async (req, res) => {
    try {
        const memory = await Memory.findOne({
            where: { id: req.params.id, userId: req.user.id },  // Ensure memory belongs to user
        });

        if (!memory) {
            return res.status(404).json({ message: "Memory not found or unauthorized" });
        }

        // Delete associated image
        if (memory.imageUrl) {
            const imagePath = path.join(__dirname, "../uploads", memory.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await memory.destroy();
        res.status(200).json({ message: "Memory deleted successfully" });
    } catch (error) {
        console.error("Error deleting memory:", error.message);
        res.status(500).json({ error: "Failed to delete memory", details: error.message });
    }
};

module.exports = { createMemory, getMemories, getMemoryById, updateMemory, deleteMemory };
