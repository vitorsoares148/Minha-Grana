const goalsService = require("../services/goals.service");

// ======================================================
// BUSCAR METAS
// ======================================================
async function getGoals(req, res) {
  try {
    const goals = await goalsService.getGoals(req.userId);

    return res.json(goals);
  } catch (error) {
    console.error("Get goals error:", error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
    });
  }
}

// ======================================================
// CRIAR META
// ======================================================
async function createGoal(req, res) {
  const { description, target_value } = req.body;

  if (
    (typeof target_value !== "string" && typeof target_value !== "number") ||
    !/^\d+(\.\d{1,2})?$/.test(String(target_value))
  ) {
    return res.status(400).json({
      error: "INVALID_TARGET_INPUT",
    });
  }

  const targetValue = Number(target_value);

  if (
    !Number.isFinite(targetValue) ||
    targetValue <= 0 ||
    targetValue > 999999999.99
  ) {
    return res.status(400).json({
      error: "INVALID_TARGET_INPUT",
    });
  }

  if (
    typeof description !== "string" ||
    description.trim().length === 0 ||
    description.length > 100
  ) {
    return res.status(400).json({
      error: "INVALID_DESCRIPTION",
    });
  }

  try {
    const goalId = await goalsService.createGoal(
      req.userId,
      description,
      targetValue,
    );

    return res.status(201).json({
      message: "SUCCESS",
      goalId,
    });
  } catch (error) {
    console.error("Create goal error:", error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
    });
  }
}

// ======================================================
// DELETAR META
// ======================================================
async function deleteGoal(req, res) {
  const goalId = Number(req.params.id);

  if (!Number.isInteger(goalId)) {
    return res.status(400).json({
      error: "INVALID_GOAL_ID",
    });
  }

  try {
    const deleted = await goalsService.deleteGoal(req.userId, goalId);

    if (!deleted) {
      return res.status(404).json({
        error: "GOAL_NOT_FOUND",
      });
    }

    return res.json({
      message: "SUCCESS",
    });
  } catch (error) {
    console.error("Delete goal error:", error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
    });
  }
}

async function updateGoal(req, res) {
  const goalId = Number(req.params.id);
  const currentValue = Number(req.body.current_value);
  const finished = req.body.finished;

  if (!Number.isInteger(goalId) || goalId <= 0) {
    return res.status(400).json({
      error: "INVALID_GOAL_ID",
    });
  }

  if (!Number.isFinite(currentValue) || currentValue < 0) {
    return res.status(400).json({
      error: "INVALID_CURRENT_VALUE",
    });
  }

  if (typeof finished !== "boolean") {
    return res.status(400).json({
      error: "INVALID_FINISHED",
    });
  }

  try {
    const updated = await goalsService.updateGoal(
      req.userId,
      goalId,
      currentValue,
      finished,
    );

    if (!updated) {
      return res.status(404).json({
        error: "GOAL_NOT_FOUND",
      });
    }

    return res.json({
      message: "SUCCESS",
    });
  } catch (error) {
    console.error("Update goal error:", error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
    });
  }
}

module.exports = {
  getGoals,
  createGoal,
  deleteGoal,
  updateGoal,
};
