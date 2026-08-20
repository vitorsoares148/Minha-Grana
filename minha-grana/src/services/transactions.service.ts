import {
  createTransaction as apiCreateTransaction,
  deleteTransaction as apiDeleteTransaction,
} from "../api/transactions.api";
import type { TransactionInput } from "../types/auth";

export async function createTransaction(transactionInput: TransactionInput) {
  return await apiCreateTransaction(transactionInput);
}

export async function deleteTransaction(id: number) {
  return await apiDeleteTransaction(id);
}
