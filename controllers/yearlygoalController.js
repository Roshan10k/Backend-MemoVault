const YearlyGoal = require("../Model/yearlygoalModel");

// Get all goals for a logged-in user
const getYearlyGoals = async (req, res) => {
  try {
    const goals = await YearlyGoal.findAll({ where: { userId: req.user.id } });
    res.status(200).json(goals);
  } catch (error) {
    console.error("Failed to retrieve yearly goals", error);
    res.status(500).json({ message: "Failed to retrieve yearly goals" });
  }
};

// Create a new goal for a month
const addYearlyGoal = async (req, res) => {
  const { month, goal } = req.body;
  console.log("Received new goal:", { month, goal });

  try {
    if (!month || !goal) {
      console.log("Month or Goal is missing");
      return res.status(400).json({ message: "Month and Goal are required" });
    }

    const newGoal = await YearlyGoal.create({
      userId: req.user.id,
      month,
      goal,
    });

    console.log("New goal created:", newGoal);
    res.status(201).json(newGoal);
  } catch (error) {
    console.error("Error adding yearly goal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Mark a goal as completed
const completeYearlyGoal = async (req, res) => {
  const { id } = req.params;
  console.log(`Completing goal with ID: ${id}`);

  try {
    const goal = await YearlyGoal.findOne({ where: { id, userId: req.user.id } });

    if (!goal) {
      console.error("Goal not found");
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.completed = true;
    await goal.save();

    console.log("Goal marked as completed:", goal);
    res.status(200).json(goal);
  } catch (error) {
    console.error("Error completing goal:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add or update remarks for a completed goal
const addRemarksToGoal = async (req, res) => {
  const { id } = req.params;
  const { remarks } = req.body;
  console.log(`Adding remarks for goal with ID: ${id}`);

  try {
    const goal = await YearlyGoal.findOne({ where: { id, userId: req.user.id } });

    if (!goal) {
      console.error("Goal not found");
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.remarks = remarks;
    await goal.save();

    console.log("Remarks added to goal:", goal);
    res.status(200).json(goal);
  } catch (error) {
    console.error("Error adding remarks:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateYearlyGoal = async (req, res) => {
  const { id } = req.params;
  const { goal } = req.body;
  console.log(`Updating goal text for ID: ${id}`);
  try {
    const existingGoal = await YearlyGoal.findOne({ where: { id, userId: req.user.id } });
    if (!existingGoal) {
      console.error("Goal not found");
      return res.status(404).json({ message: "Goal not found" });
    }
    existingGoal.goal = goal;
    await existingGoal.save();
    console.log("Goal updated:", existingGoal);
    res.status(200).json(existingGoal);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  getYearlyGoals,
  addYearlyGoal,
  completeYearlyGoal,
  addRemarksToGoal,
  updateYearlyGoal
};
