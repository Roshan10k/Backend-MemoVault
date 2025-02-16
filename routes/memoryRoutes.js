const express = require("express");
const router = express.Router();
const memoryController = require("../controllers/memoriesCapsuleController.js");
const upload = require("../middleware/imageUpload.js"); // Import multer middleware for image uploads
const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/create_memory",authMiddleware, upload.single("image"), memoryController.createMemory);
router.get("/show_memories",authMiddleware, memoryController.getMemories);
router.get("/:id", authMiddleware,memoryController.getMemoryById);
router.put("/:id", authMiddleware,upload.single("image"), memoryController.updateMemory);
router.delete("/:id", authMiddleware,memoryController.deleteMemory);

module.exports = router;
