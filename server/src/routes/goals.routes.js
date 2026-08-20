const express = require("express");

const {
  getGoals,
  createGoal,
  deleteGoal,
  updateGoal,
} = require("../controllers/goals.controller");

const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

router.get("/", authenticateToken, getGoals);

router.post("/", authenticateToken, createGoal);

router.delete("/:id", authenticateToken, deleteGoal);

router.patch("/:id", authenticateToken, updateGoal);

module.exports = router;
