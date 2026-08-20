const db = require("../../db");

// ======================================================
// BUSCAR METAS
// ======================================================
async function getGoals(userId) {
  const [goals] = await db.query(
    `SELECT
       id,
       description,
       current_value,
       target_value,
       finished
     FROM goals
     WHERE user_id = ?
     ORDER BY id DESC;`,
    [userId],
  );

  return goals;
}

// ======================================================
// CRIAR META
// ======================================================
async function createGoal(userId, description, targetValue) {
  const [result] = await db.query(
    `INSERT INTO goals
      (
        user_id,
        description,
        target_value,
        finished
      )
     VALUES (?, ?, ?, ?)`,
    [userId, description, targetValue, false],
  );

  return result.insertId;
}

// ======================================================
// DELETAR META
// ======================================================
async function deleteGoal(userId, goalId) {
  const [result] = await db.query(
    `DELETE FROM goals
     WHERE id = ?
       AND user_id = ?`,
    [goalId, userId],
  );

  return result.affectedRows > 0;
}

// ======================================================
// ATUALIZAR META
// ======================================================
async function updateGoal(userId, goalId, currentValue, finished) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [goals] = await connection.query(
      `SELECT current_value, target_value, finished
       FROM goals
       WHERE id = ?
         AND user_id = ?
       LIMIT 1`,
      [goalId, userId],
    );

    if (goals.length === 0) {
      await connection.rollback();
      return false;
    }

    const goal = goals[0];

    const oldValue = Number(goal.current_value);
    const targetValue = Number(goal.target_value);

    const currentCents = Math.round(currentValue * 100);
    const targetCents = Math.round(targetValue * 100);

    if (currentCents > targetCents) {
      await connection.rollback();
      return { success: false, reason: "VALUE_EXCEEDS_TARGET" };
    }

    if (finished && currentCents !== targetCents) {
      await connection.rollback();
      return { success: false, reason: "GOAL_NOT_REACHED" };
    }

    const difference = currentValue - oldValue;

    await connection.query(
      `UPDATE goals
       SET current_value = ?,
           finished = ?
       WHERE id = ?
         AND user_id = ?`,
      [currentValue, finished, goalId, userId],
    );

    // Atualizar saldo
    await connection.query(
      `UPDATE users
       SET balance = balance - ?
       WHERE id = ?`,
      [difference, userId],
    );

    await connection.commit();

    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ======================================================

module.exports = {
  getGoals,
  createGoal,
  deleteGoal,
  updateGoal,
};
