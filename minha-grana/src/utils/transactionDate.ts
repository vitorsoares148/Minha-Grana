import { endOfMonth } from "date-fns";

import type { Transaction } from "../types/auth";

export function isTransactionOnDate(
  transaction: Transaction,
  date: Date,
): boolean {
  const transactionDateString = transaction.transaction_date.split("T")[0];

  const [year, month, day] = transactionDateString.split("-").map(Number);

  const transactionMonth = month - 1;

  if (!transaction.recurrent) {
    return (
      year === date.getFullYear() &&
      transactionMonth === date.getMonth() &&
      day === date.getDate()
    );
  }

  const transactionDate = new Date(year, transactionMonth, day);

  if (transactionDate > date) {
    return false;
  }

  const selectedDay = date.getDate();

  if (day > 28) {
    return selectedDay === endOfMonth(date).getDate();
  }

  return day === selectedDay;
}
