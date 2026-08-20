const db = require("../../db");
const transactionsService = require("./transactions.service");
const goalsService = require("./goals.service");

// ======================================================
// INFORMAÇÕES DO USUÁRIO
// ======================================================
async function getUserInfo(userId, month, year) {
  // BUSCAR USUÁRIO
  const [users] = await db.query(
    `SELECT id, username, email, balance
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [userId],
  );

  if (users.length === 0) {
    return null;
  }

  // BUSCAR TRANSAÇÕES
  const transactions = await transactionsService.getTransactions(
    userId,
    month,
    year,
  );

  // BUSCAR METAS
  const goals = await goalsService.getGoals(userId);

  return {
    ...users[0],
    transactions,
    goals,
  };
}

// ======================================================
// ATUALIZAR BALANÇA
// ======================================================
async function updateBalance(userId) {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const startDateString = startDate.toISOString().slice(0, 10);

  const [rows] = await db.query(
    `
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN type = 'expense' THEN
                amount *
                CASE
                  WHEN recurrent = true THEN
                    (
                      (YEAR(CURRENT_DATE) - YEAR(transaction_date)) * 12
                      + (MONTH(CURRENT_DATE) - MONTH(transaction_date))
                    )
                  ELSE 1
                END
              ELSE 0
            END
          ),
          0
        ) AS totalExpense,

        COALESCE(
          SUM(
            CASE
              WHEN type = 'income' THEN
                amount *
                CASE
                  WHEN recurrent = true THEN
                    (
                      (YEAR(CURRENT_DATE) - YEAR(transaction_date)) * 12
                      + (MONTH(CURRENT_DATE) - MONTH(transaction_date))
                    )
                  ELSE 1
                END
              ELSE 0
            END
          ),
          0
        ) AS totalIncome

      FROM transactions

      WHERE user_id = ?
      AND transaction_date < ?;
    `,
    [userId, startDateString],
  );

  const [rowsGoals] = await db.query(
    `
      SELECT COALESCE(SUM(current_value), 0) AS totalCurrent
      FROM goals
      WHERE user_id = ?
    `,
    [userId],
  );

  const completedMonthExpenses = Number(rows[0].totalExpense);
  const completedMonthIncome = Number(rows[0].totalIncome);
  const totalGoalValue = Number(rowsGoals[0].totalCurrent);

  const totalSaved = completedMonthIncome - completedMonthExpenses;
  const availableBalance = totalSaved - totalGoalValue;

  await db.query(
    `
      UPDATE users
      SET balance = ?
      WHERE id = ?
    `,
    [availableBalance, userId],
  );

  return {
    availableBalance,
  };
}

// ======================================================

module.exports = {
  getUserInfo,
  updateBalance,
};
