import { useEffect, useMemo, useState } from "react";
import { FaXmark, FaRepeat } from "react-icons/fa6";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";

import { MONTHS } from "../../constants/months";
import { CATEGORIES } from "../../constants/categories";

import { formatBRL } from "../../utils/formatBRL";
import { isTransactionOnDate } from "../../utils/transactionDate";
import { cn } from "../../utils/cn";
import { deleteTransaction } from "../../services/transactions.service";
import type { Transaction } from "../../types/auth";
import { useAuth } from "../../contexts/AuthContext";

import AddTransactionDropdown from "./AddTransactionDropdown";
import Box from "../generic/Box";

export default function TransactionManager({
  selectedDate,
}: {
  selectedDate: Date;
}) {
  const { user, getUserInfoDate, updateBalance } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [useable, setUseable] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUseable(true);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [useable]);

  const transactions = useMemo(() => {
    return (
      user?.transactions.filter((transaction) =>
        isTransactionOnDate(transaction, selectedDate),
      ) ?? []
    );
  }, [user?.transactions, selectedDate]);

  async function handleDeleteTransaction(id: number) {
    try {
      const result = await deleteTransaction(id);

      if (result.message !== "SUCCESS") {
        return;
      }

      await updateBalance();
      await getUserInfoDate(
        selectedDate.getMonth(),
        selectedDate.getFullYear(),
      );
    } catch (error) {
      console.error("Delete transaction error:", error);
    }
  }

  const getCategory = (id: number) => {
    const category = CATEGORIES.find((item) => item.id === id);

    return category
      ? `${category.emoji} ${category.name}`
      : "Categoria desconhecida";
  };

  return (
    <Box>
      <div className="flex h-181 w-140 flex-col items-center">
        {/* Data */}
        <div
          className={cn(
            "mb-7 flex w-full justify-center border-b-2 border-white/25 pb-3",
            "text-center font-sans text-[36px] font-bold",
          )}
        >
          {selectedDate.getDate()} de {MONTHS[selectedDate.getMonth()].name} ,{" "}
          {selectedDate.getFullYear()}
        </div>

        {/* Transações */}
        {transactions.length > 0 ? (
          <ul className="flex h-full w-full flex-col gap-3.5 overflow-y-auto">
            {transactions.map((transaction: Transaction) => (
              <li key={transaction.id}>
                <div
                  className={cn(
                    "relative flex flex-col bg-neutral-900/20 p-4",
                    "rounded-xl border-2 border-white/8",
                  )}
                >
                  {/* Descrição */}
                  <div className="truncate text-[24px] font-bold">
                    {transaction.description}
                  </div>

                  {/* Valor */}
                  <div
                    className={cn(
                      "truncate",
                      "text-[18px] font-semibold",
                      transaction.type === "income"
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    {formatBRL(Number(transaction.amount))}
                  </div>

                  {/* Categoria */}
                  <div className="truncate text-[18px] font-semibold">
                    {getCategory(transaction.category_id)}
                  </div>

                  {/* Botão de deletar transação */}
                  <button
                    className={cn(
                      "absolute top-9.5 right-4 flex cursor-pointer items-center justify-center rounded-xl",
                      "h-12.5 w-12.5 p-3",
                      "text-[24px] font-bold text-white",
                      "bg-red-500",
                      "transition duration-200 ease-in-out",
                      "hover:shadow-[0_0_20px_rgba(201,0,0,0.4)]",
                    )}
                    onClick={() =>
                      transaction.id && handleDeleteTransaction(transaction.id)
                    }
                  >
                    <FaXmark className="h-9 w-12" />
                  </button>

                  {/* Background Recorrente */}
                  {!!transaction.recurrent && (
                    <FaRepeat
                      className={cn(
                        "absolute top-3 left-57 h-25 w-25",
                        transaction.type === "income"
                          ? "text-green-500/8"
                          : "text-red-500/8",
                      )}
                    />
                  )}

                  {/* Background Parcelado */}
                  {!!transaction.installment && (
                    <RiCheckboxMultipleBlankLine
                      className={cn(
                        "absolute top-0 left-55 h-30 w-30 text-red-500/8",
                      )}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full text-center font-sans text-[24px] font-semibold text-white/20">
            Nenhuma transação encontrada...
          </div>
        )}

        {/* Botão de criar transação */}
        <button
          className={cn(
            "relative mt-5 cursor-pointer rounded-xl",
            "p-3 px-6",
            "text-[24px] font-bold text-white",
            "bg-white/10",
            "transition duration-200 ease-in-out",
            openMenu
              ? "bg-green-500 shadow-[0_0_20px_rgba(0,201,80,0.4)]"
              : "hover:bg-white/20",
          )}
          disabled={!useable}
          onClick={() => {
            !openMenu && setOpenMenu(true);
          }}
        >
          Criar transação
        </button>

        {/* Menu de criar transação */}
        {openMenu && (
          <AddTransactionDropdown
            openMenu={openMenu}
            selectedDate={selectedDate}
            setOpenMenu={setOpenMenu}
            setUseable={setUseable}
          />
        )}
      </div>
    </Box>
  );
}
