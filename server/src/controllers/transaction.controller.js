const transactionsService = require("../services/transactions.service");

// ======================================================
// CRIAR TRANSAÇÃO
// ======================================================

async function createTransaction(req, res) {
  const {
    category_id,
    amount,
    type,
    description,
    transaction_date,
    recurrent,
    installment,
    installmentsQuant,
  } = req.body;

  // VALIDAÇÃO BÁSICA
  if (
    !Number.isInteger(category_id) ||
    category_id <= 0 ||
    (typeof amount !== "string" && typeof amount !== "number") ||
    typeof description !== "string" ||
    typeof type !== "string" ||
    typeof transaction_date !== "string"
  ) {
    return res.status(400).json({
      error: "INVALID_INPUT",
    });
  }

  // DESCRIÇÃO
  if (description.trim().length === 0 || description.length > 100) {
    return res.status(400).json({
      error: "INVALID_DESCRIPTION",
    });
  }

  // VALOR
  const amountNumber = Number(amount);

  if (
    !Number.isFinite(amountNumber) ||
    amountNumber <= 0 ||
    amountNumber > 999999999.99
  ) {
    return res.status(400).json({
      error: "INVALID_AMOUNT",
    });
  }

  if (!/^\d+(\.\d{1,2})?$/.test(String(amount))) {
    return res.status(400).json({
      error: "INVALID_AMOUNT",
    });
  }

  // CATEGORIA
  const VALID_CATEGORY_IDS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  if (!VALID_CATEGORY_IDS.has(category_id)) {
    return res.status(400).json({
      error: "INVALID_CATEGORY",
    });
  }

  // TIPO
  if (type !== "income" && type !== "expense") {
    return res.status(400).json({
      error: "INVALID_TRANSACTION_TYPE",
    });
  }

  // DATA
  if (!isValidDate(transaction_date)) {
    return res.status(400).json({
      error: "INVALID_DATE",
    });
  }

  // RECORRENTE
  if (typeof recurrent !== "boolean") {
    return res.status(400).json({
      error: "INVALID_RECURRENT",
    });
  }

  // PARCELAMENTO
  if (typeof installment !== "boolean") {
    return res.status(400).json({
      error: "INVALID_INSTALLMENT",
    });
  }

  // AMBOS
  if (installment && recurrent) {
    return res.status(400).json({
      error: "RECURRENT_INSTALLMENT_NOT_ALLOWED",
    });
  }

  if (installment) {
    const quantity = Number(installmentsQuant);

    if (!Number.isInteger(quantity) || quantity < 2 || quantity > 120) {
      return res.status(400).json({
        error: "INVALID_INSTALLMENTS_QUANTITY",
      });
    }
  }

  try {
    await transactionsService.createTransaction({
      userId: req.userId,
      categoryId: category_id,
      amount: amountNumber,
      type,
      description,
      transactionDate: transaction_date,
      recurrent,
      installment,
      installmentsQuant: installment ? Number(installmentsQuant) : null,
    });

    return res.json({
      message: "SUCCESS",
    });
  } catch (error) {
    console.error("Error creating transaction:", error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
    });
  }
}

// ======================================================
// DELETAR TRANSAÇÃO
// ======================================================

async function deleteTransaction(req, res) {
  try {
    const transactionId = Number(req.params.id);

    if (!Number.isInteger(transactionId) || transactionId <= 0) {
      return res.status(400).json({
        error: "INVALID_TRANSACTION_ID",
      });
    }

    const deleted = await transactionsService.deleteTransaction(
      req.userId,
      transactionId,
    );

    if (!deleted) {
      return res.status(404).json({
        error: "TRANSACTION_NOT_FOUND",
      });
    }

    return res.json({
      message: "SUCCESS",
    });
  } catch (error) {
    console.error("Delete transaction error:", error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
    });
  }
}

// ======================================================

function isValidDate(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// ======================================================

module.exports = {
  createTransaction,
  deleteTransaction,
};
