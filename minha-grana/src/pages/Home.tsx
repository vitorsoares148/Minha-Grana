import Balance from "../components/home/Balance";
import ExpensesChart from "../components/home/ExpensesChart";
import Loading from "../components/generic/Loading";

import MonthYearDropdown from "../components/home/MonthYearDropdown";
import NoTransactionFound from "../components/home/NoTransactionFound";
import TransactionHistory from "../components/home/TransactionHistory";

import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [loadingInfo, setLoadingInfo] = useState(true);

  const totalExpenses =
    user?.transactions.reduce(
      (total, transaction) =>
        transaction.type === "expense"
          ? total + Number(transaction.amount)
          : total,
      0,
    ) ?? 0;

  const hasTransactions = user?.transactions.length !== 0;

  return (
    <div className="z-1 flex min-h-screen flex-col">
      <div className="h-18" />

      <div className="mt-5 mb-7 flex w-148 flex-col justify-between gap-y-4 lg:w-297 lg:flex-row lg:items-end">
        <div className="z-1 text-start font-sans text-[36px] font-bold text-white">
          Bem-vindo, {user?.username}!
        </div>

        <MonthYearDropdown setLoadingInfo={setLoadingInfo} />
      </div>

      {loadingInfo ? (
        <div className="w-152 lg:w-297">
          <Loading />
        </div>
      ) : user && hasTransactions ? (
        <>
          <div
            className={cn(
              "mb-8 flex flex-col justify-between gap-y-8 lg:items-center",
              totalExpenses !== 0 && "lg:flex-row lg:space-x-8",
            )}
          >
            {totalExpenses !== 0 && (
              <ExpensesChart transactions={user?.transactions} />
            )}

            <Balance user={user} />
          </div>

          <TransactionHistory user={user} />
        </>
      ) : (
        <NoTransactionFound />
      )}
    </div>
  );
}
