import { endOfMonth } from "date-fns";

import type { Transaction } from "../types/auth";

export function isTransactionOnDate(
  transaction: Transaction,
  date: Date,
): boolean {
  const [year, month, day] = transaction.transaction_date
    .split("-")
    .map(Number);

  const transactionYear = year;
  const transactionMonth = month - 1;
  const transactionDay = day;

  const transactionDate = new Date(
    transactionYear,
    transactionMonth,
    transactionDay,
  );

  if (!transaction.recurrent) {
    return (
      transactionYear === date.getFullYear() &&
      transactionMonth === date.getMonth() &&
      transactionDay === date.getDate()
    );
  }

  if (transactionDate > date) {
    return false;
  }

  const selectedDay = date.getDate();

  if (transactionDay > 28) {
    return selectedDay === endOfMonth(date).getDate();
  }

  return transactionDay === selectedDay;
}
