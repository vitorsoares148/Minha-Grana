import { FaArrowDown, FaArrowUp } from "react-icons/fa";

import type { User } from "../../types/auth";
import { formatBRL } from "../../utils/formatBRL";
import { cn } from "../../utils/cn";

import Box from "../generic/Box";

export default function Balance({ user }: { user: User | null }) {
  const transactions = user?.transactions ?? [];

  const totalIncome = transactions.reduce(
    (total, transaction) =>
      transaction.type === "income"
        ? total + Number(transaction.amount)
        : total,
    0,
  );

  const totalExpenses = transactions.reduce(
    (total, transaction) =>
      transaction.type === "expense"
        ? total + Number(transaction.amount)
        : total,
    0,
  );

  const balance = totalIncome - totalExpenses;
  const isNegative = balance < 0;

  return (
    <Box className="flex h-103 min-w-137 items-center">
      <div className="w-full text-[24px] font-bold">SALDO GERAL</div>

      <div className="mt-14 flex h-34 w-full justify-center space-x-5">
        {/* Entrada */}
        <div className="flex flex-col items-center">
          <div className="h-14 w-64 truncate text-center font-sans text-[42px] font-bold text-green-500">
            {formatBRL(totalIncome)}
          </div>

          <div className="flex items-center">
            <FaArrowUp size={24} className="text-green-500" />

            <div className="ml-2 text-center font-sans text-[24px] font-semibold text-green-500">
              Entrada
            </div>
          </div>
        </div>

        {/* Saída */}
        <div className="flex flex-col items-center">
          <div className="h-14 w-64 truncate text-center font-sans text-[42px] font-bold whitespace-nowrap text-red-500">
            {formatBRL(totalExpenses)}
          </div>

          <div className="flex items-center">
            <FaArrowDown size={24} className="text-red-500" />

            <div className="ml-2 text-center font-sans text-[24px] font-semibold text-red-500">
              Saída
            </div>
          </div>
        </div>
      </div>

      {/* Saldo */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "h-14 font-sans text-[42px] font-bold",
            isNegative && "text-red-500",
          )}
        >
          {formatBRL(balance)}
        </div>

        <div className="flex items-center">
          <div
            className={cn(
              "ml-2 text-center font-sans text-[24px] font-semibold",
              isNegative ? "text-red-500" : "text-white",
            )}
          >
            Saldo
          </div>
        </div>
      </div>
    </Box>
  );
}
