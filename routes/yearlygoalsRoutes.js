const express = require("express");
const router = express.Router();
const goalController = require("../controllers/yearlygoalController")
const authMiddleware = require("../middleware/authMiddleware"); 

// Get all goals for a user
router.get("/goals", authMiddleware,goalController.getYearlyGoals);

// Add a new goal for a user
router.post("/goals", authMiddleware,goalController.addYearlyGoal);

// Mark a goal as completed
router.put("/goals/:id/complete", authMiddleware,goalController.completeYearlyGoal);

// Add remarks to a completed goal
router.put("/goals/:id/remarks", authMiddleware,goalController.addRemarksToGoal);

// Update an existing goal's text
router.put("/goals/:id", authMiddleware, goalController.updateYearlyGoal);


module.exports = router;
