import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import type { User } from "../../types/auth";
import { cn } from "../../utils/cn";
import { isTransactionOnDate } from "../../utils/transactionDate";

interface DateGridProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  user: User | null;
}

export default function DateGrid({
  currentDate,
  selectedDate,
  setSelectedDate,
  user,
}: DateGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  function getDayTransactionInfo(day: Date) {
    let transactionCount = 0;
    let transactionTotal = 0;

    user?.transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.transaction_date);

      const matchesDay = transaction.recurrent
        ? isTransactionOnDate(transaction, day)
        : isSameDay(transactionDate, day);

      if (!matchesDay) {
        return;
      }

      const amount = Number(transaction.amount);

      transactionTotal += transaction.type === "income" ? amount : -amount;

      transactionCount++;
    });

    return {
      transactionCount,
      hasTransaction: transactionCount > 0,
      isIncome: transactionTotal >= 0,
    };
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day) => {
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());

        const { transactionCount, hasTransaction, isIncome } =
          getDayTransactionInfo(day);

        const isExpense = !isIncome && hasTransaction;

        const themeText = isExpense ? "text-red-500" : "text-green-500";

        const themeBorder = isExpense ? "border-red-500" : "border-green-500";

        const themeBg = isExpense ? "bg-red-500" : "bg-green-500";

        const themeHoverText = isExpense
          ? "hover:text-red-500"
          : "hover:text-green-500";

        return (
          <button
            key={day.toISOString()}
            onClick={() => setSelectedDate(day)}
            disabled={!isCurrentMonth}
            className={cn(
              "group relative mx-auto flex h-20 w-20 items-center justify-center rounded-lg",
              "text-[36px] font-bold",

              //Não faz parte do mês atual
              !isCurrentMonth && "cursor-not-allowed text-neutral-700",

              //Dia não selecionado
              isCurrentMonth &&
                !isSelected && ["text-white", "hover:bg-white", themeHoverText],

              //Dia de hoje
              isToday && !isSelected && ["border-2", themeBorder, themeText],

              //Dia selecionado
              isSelected && isCurrentMonth && ["text-white shadow-sm", themeBg],
            )}
          >
            <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>

            {hasTransaction && isCurrentMonth && (
              <div
                className={cn(
                  "absolute top-3 h-2 rounded-full",

                  transactionCount > 3 && "w-8",
                  transactionCount > 1 && transactionCount <= 3 && "w-4",
                  transactionCount <= 1 && "w-2",

                  isIncome
                    ? isSelected
                      ? "bg-white"
                      : "bg-green-500"
                    : isSelected
                      ? "bg-white"
                      : "bg-red-500",
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
