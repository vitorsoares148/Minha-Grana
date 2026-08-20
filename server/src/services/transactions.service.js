const db = require("../../db");
const { addMonths } = require("../utils/addMonths");

// ======================================================
// BUSCAR TRANSAÇÕES
// ======================================================
async function getTransactions(userId, month, year) {
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  const startDateString = startDate.toISOString().slice(0, 10);
  const endDateString = endDate.toISOString().slice(0, 10);

  // BUSCAR TRANSAÇÕES NO BANCO DE DADOS
  const [transactions] = await db.query(
    `SELECT
         id,
         category_id,
         amount,
         type,
         description,
         transaction_date,
         recurrent,
         installment
       FROM transactions
       WHERE transaction_date >= ?
         AND transaction_date < ?
         AND recurrent = 0
         AND user_id = ?
       ORDER BY transaction_date DESC`,
    [startDateString, endDateString, userId],
  );

  const [transactionsRecurrent] = await db.query(
    `SELECT
         id,
         category_id,
         amount,
         type,
         description,
         transaction_date,
         recurrent
       FROM transactions
       WHERE recurrent = 1
         AND transaction_date < ?
         AND user_id = ?
       ORDER BY transaction_date DESC`,
    [endDateString, userId],
  );

  return [...transactions, ...transactionsRecurrent];
}

// ======================================================
// CRIAR TRANSAÇÃO
// ======================================================
async function createTransaction({
  userId,
  categoryId,
  amount,
  type,
  description,
  transactionDate,
  recurrent,
  installment,
  installmentsQuant,
}) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const quantity = installment ? installmentsQuant : 1;
    const totalCents = Math.round(amount * 100);
    const baseInstallmentCents = Math.floor(totalCents / quantity);
    const remainderCents = totalCents - baseInstallmentCents * quantity;

    for (let i = 1; i <= quantity; i++) {
      /*
       * Dá o restante para a última parcela.
       *
       * Exemplo:
       * R$100 / 3
       *
       * Parcela 1 = R$33.33
       * Parcela 2 = R$33.33
       * Parcela 3 = R$33.34
       */

      const currentInstallmentCents =
        i === quantity
          ? baseInstallmentCents + remainderCents
          : baseInstallmentCents;

      const currentAmount = (currentInstallmentCents / 100).toFixed(2);

      const currentDescription = installment
        ? `${description} ${i}/${quantity}`
        : description;

      const currentDate = installment
        ? addMonths(transactionDate, i - 1)
        : transactionDate;

      await connection.query(
        `INSERT INTO transactions
       (
         user_id,
         category_id,
         amount,
         type,
         description,
         transaction_date,
         recurrent,
         installment
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          categoryId,
          currentAmount,
          type,
          currentDescription,
          currentDate,
          recurrent,
          installment,
        ],
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ======================================================
// DELETAR TRANSAÇÃO
// ======================================================
async function deleteTransaction(userId, transactionId) {
  const [rows] = await db.query(
    `SELECT recurrent
     FROM transactions
     WHERE id = ?
     AND user_id = ?
     LIMIT 1`,
    [transactionId, userId],
  );

  // Transação não existe
  if (rows.length === 0) {
    return false;
  }

  const transaction = rows[0];

  if (transaction.recurrent === 1) {
    return deleteRecurrentTransaction(userId, transactionId);
  }

  const [result] = await db.query(
    `DELETE FROM transactions
     WHERE id = ?
     AND user_id = ?`,
    [transactionId, userId],
  );

  return result.affectedRows > 0;
}

// ======================================================
// DELETAR TRANSAÇÃO RECORRENTE
// ======================================================
async function deleteRecurrentTransaction(userId, transactionId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT
         category_id,
         amount,
         type,
         description,
         transaction_date
       FROM transactions
       WHERE id = ?
         AND user_id = ?
         AND recurrent = 1
       LIMIT 1`,
      [transactionId, userId],
    );

    if (rows.length === 0) {
      await connection.rollback();
      return false;
    }

    const transaction = rows[0];

    // MySQL DATE -> YYYY-MM-DD
    const startDate = new Date(transaction.transaction_date);

    const today = new Date();

    const startYear = startDate.getUTCFullYear();
    const startMonth = startDate.getUTCMonth();
    const startDay = startDate.getUTCDate();

    const currentYear = today.getUTCFullYear();
    const currentMonth = today.getUTCMonth();

    let year = startYear;
    let month = startMonth;

    while (
      year < currentYear ||
      (year === currentYear && month <= currentMonth)
    ) {
      /*
       * Ache o último dia válido desse mês.
       *
       * Examplo:
       * startDay = 31
       *
       * Fevereiro -> 28/29
       * Abril    -> 30
       * Maio      -> 31
       */
      const lastDayOfMonth = new Date(
        Date.UTC(year, month + 1, 0),
      ).getUTCDate();

      const day = Math.min(startDay, lastDayOfMonth);

      const transactionDate = `${year}-${String(month + 1).padStart(
        2,
        "0",
      )}-${String(day).padStart(2, "0")}`;
      /*
       * Não crie a transação do mês atual
       * se a sua data ainda não ocorreu
       *
       * Exemplo:
       * Data de recorrência = 25 de Agosto
       * Hoje = 19 de Agosto
       *
       * Transação em agosto NÃO deve ser criada ainda.
       */
      if (
        year < currentYear ||
        month < currentMonth ||
        day <= today.getUTCDate()
      ) {
        await connection.query(
          `INSERT INTO transactions
           (
             user_id,
             category_id,
             amount,
             type,
             description,
             transaction_date,
             recurrent,
             installment
           )
           VALUES (?, ?, ?, ?, ?, ?, 0, 0)`,
          [
            userId,
            transaction.category_id,
            transaction.amount,
            transaction.type,
            transaction.description,
            transactionDate,
          ],
        );
      }

      // Mover para o próximo mês
      month++;

      if (month > 11) {
        month = 0;
        year++;
      }
    }

    // Deletar a transação recorrente
    await connection.query(
      `DELETE FROM transactions
       WHERE id = ?
         AND user_id = ?`,
      [transactionId, userId],
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
  getTransactions,
  createTransaction,
  deleteTransaction,
};
