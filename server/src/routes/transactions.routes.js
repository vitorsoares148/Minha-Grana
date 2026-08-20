const express = require("express");

const {
  createTransaction,
  deleteTransaction,
} = require("../controllers/transaction.controller");

const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/", authenticateToken, createTransaction);

router.delete("/:id", authenticateToken, deleteTransaction);

module.exports = router;
