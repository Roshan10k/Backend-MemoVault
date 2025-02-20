const express = require("express");
const router = express.Router();
const letterController = require("../controllers/lettertoselfController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, letterController.createLetter);
router.get("/me", authMiddleware, letterController.getLettersByUser);
router.get("/:id", authMiddleware, letterController.getLetterById);
router.put("/:id", authMiddleware, letterController.updateLetter);
router.delete("/:id", authMiddleware, letterController.deleteLetter);

module.exports = router;
