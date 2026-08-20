import { endOfMonth } from "date-fns";
import type { Transaction } from "../types/auth";

export function isTransactionOnDate(
  transaction: Transaction,
  date: Date,
): boolean {
  const transactionDate = new Date(transaction.transaction_date);

  if (!transaction.recurrent) {
    return (
      transactionDate.getDate() === date.getDate() &&
      transactionDate.getMonth() === date.getMonth() &&
      transactionDate.getFullYear() === date.getFullYear()
    );
  }

  if (transactionDate > date) {
    return false;
  }

  const transactionDay = transactionDate.getDate();
  const selectedDay = date.getDate();

  if (transactionDay > 28) {
    return selectedDay === endOfMonth(date).getDate();
  }

  return transactionDay === selectedDay;
}
