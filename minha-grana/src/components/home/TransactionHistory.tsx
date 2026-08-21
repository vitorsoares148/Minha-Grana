import type { User } from "../../types/auth";
import { CATEGORIES } from "../../constants/categories";
import { formatBRL } from "../../utils/formatBRL";
import { formatDate } from "../../utils/formatDate";
import { cn } from "../../utils/cn";

import Box from "../generic/Box";
import { useMemo } from "react";

type TransactionHistoryProps = {
  user: User;
};

const categoryMap = new Map(
  CATEGORIES.map((category) => [category.id, category]),
);

export default function TransactionHistory({ user }: TransactionHistoryProps) {
  const transactions = useMemo(() => {
    return (
      user?.transactions.sort((a, b) => {
        const dateA = a.transaction_date.split("T")[0];
        const dateB = b.transaction_date.split("T")[0];

        if (dateA !== dateB) {
          return dateB.localeCompare(dateA);
        }

        return b.id - a.id;
      }) ?? []
    );
  }, [user?.transactions]);

  return (
    <Box>
      <div className="mb-5 font-sans text-[24px] font-bold">
        HISTÓRICO DE TRANSAÇÕES
      </div>

      <div className="w-auto overflow-hidden">
        {/* Header */}
        <div
          className={cn(
            "flex h-11 justify-around border-b-2 border-b-white/15 pl-2",
            "font-sans text-[24px] font-semibold lg:justify-center",
          )}
        >
          <div className="w-[11%] lg:w-[10%]">Data</div>
          <div className="w-[25%] lg:w-[50%]">Descrição</div>
          <div className="w-[25%] lg:w-[30%]">Categoria</div>
          <div className="w-[20%] lg:w-[10%]">Valor</div>
        </div>

        {/* Transações */}
        <ul className="max-h-50 overflow-y-auto">
          {transactions.map((transaction) => {
            const category = categoryMap.get(transaction.category_id);

            return (
              <li
                key={transaction.id}
                className={cn(
                  "flex h-8 items-center justify-around",
                  "cursor-pointer border-b-2 border-b-white/15 pl-2.5",
                  "transition duration-200 ease-in-out hover:bg-white/10",
                  "lg:justify-center",
                )}
              >
                {/* Data */}
                <div className="w-[10%] font-sans text-[18px]">
                  {formatDate(transaction.transaction_date)}
                </div>

                {/* Descrição */}
                <div className="w-[25%] truncate font-sans text-[18px] lg:w-[50%]">
                  {transaction.description}
                </div>

                {/* Categoria */}
                <div className="w-[25%] truncate font-sans text-[18px] lg:w-[30%]">
                  {category?.emoji} {category?.name}
                </div>

                {/* Valor */}
                <div
                  className={cn(
                    "w-[20%] truncate",
                    "font-sans text-[18px] font-semibold",
                    "lg:w-[10%]",
                    transaction.type === "income"
                      ? "text-green-500"
                      : "text-red-500",
                  )}
                >
                  {formatBRL(Number(transaction.amount))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Box>
  );
}
