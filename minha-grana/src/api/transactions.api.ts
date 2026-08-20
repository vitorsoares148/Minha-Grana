import api from "./axios";
import type { TransactionInput } from "../types/auth";

export async function createTransaction(transactionInput: TransactionInput) {
  const response = await api.post("/api/transactions", transactionInput);

  return response.data;
}

export async function deleteTransaction(id: number) {
  const response = await api.delete(`/api/transactions/${id}`);

  return response.data;
}
