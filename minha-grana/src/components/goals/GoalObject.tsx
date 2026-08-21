import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

import { useAuth } from "../../contexts/AuthContext";
import type { Goal } from "../../types/auth";
import { cn } from "../../utils/cn";
import { deleteGoal, updateGoal } from "../../services/goals.service";

import Box from "../generic/Box";
import ProgressBar from "./ProgressBar";
import InputBRL from "../transactions/InputBRL";
import Loading from "../generic/Loading";

const ERROR_BALANCE = {
  NONE: 0,
  INVALID: 1,
};

export default function Goal({
  item,
  setLoadingGoals,
}: {
  item: Goal;
  setLoadingGoals: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [value, setValue] = useState<number | "">(0);
  const [loadingUpdateGoal, setLoadingUpdateGoal] = useState(false);
  const [valueError, setValueError] = useState(ERROR_BALANCE.NONE);
  const { user, getUserInfo, updateBalance } = useAuth();

  const valueErrorMessage = {
    [ERROR_BALANCE.INVALID]: "Saldo insuficiente.",
  };

  async function handleDeleteGoal(id: number) {
    setLoadingGoals(true);
    const result = await deleteGoal(id);

    if (result.message === "SUCCESS") {
      await updateBalance();

      await getUserInfo();
    }
    setLoadingGoals(false);
  }

  function calculateNewValue(goal: Goal, value: number) {
    const currentValue = Number(goal.current_value);
    const targetValue = Number(goal.target_value);

    return Math.min(Math.max(currentValue + value / 100, 0), targetValue);
  }

  async function handleUpdateGoal(value: number, goal: Goal, finished = false) {
    if (user && value / 100 > user.balance) {
      setValueError(ERROR_BALANCE.INVALID);
      return;
    }

    const newValue = calculateNewValue(goal, value);

    try {
      setLoadingUpdateGoal(true);
      const result = await updateGoal(goal.id, newValue, finished);

      if (result.message !== "SUCCESS") {
        return;
      }

      await updateBalance();

      setValue(0);

      await getUserInfo();
    } catch (error) {
      console.error("Update goal error:", error);
    } finally {
      setLoadingUpdateGoal(false);
    }
  }

  function ErrorMessage({ message }: { message?: string }) {
    if (!message) return null;

    return (
      <div className="mt-2 text-center text-[18px] font-semibold text-red-500">
        {message}
      </div>
    );
  }

  return (
    <Box className="min-h-69 w-140">
      {loadingUpdateGoal ? (
        <Loading className="mt-18" />
      ) : (
        <div>
          {/* Nome */}
          <div className="mb-5 w-md truncate text-[32px] font-bold">
            {item.description}
          </div>

          {/* Barra de progresso */}
          <ProgressBar
            current={Number(item.current_value)}
            goal={Number(item.target_value)}
          />

          <div className="mt-8 flex items-center justify-center gap-2">
            {/* Botão remover saldo */}
            <button
              className={cn(
                "relative rounded-xl enabled:cursor-pointer",
                "h-12 w-12 p-3",
                "text-[24px] font-bold text-white",
                "bg-red-500 disabled:bg-neutral-700",
                "transition duration-200 ease-in-out",
                "enabled:hover:shadow-[0_0_20px_rgba(201,0,0,0.4)]",
              )}
              disabled={
                Number(item.current_value) === 0 || value === 0 || value === ""
              }
              onClick={() => {
                handleUpdateGoal(Number(-value), item);
              }}
            >
              <FaMinus className="h-6 w-6 text-center" />
            </button>

            {/* Input Valor */}
            <InputBRL
              value={value}
              error={valueError === ERROR_BALANCE.INVALID}
              onClearError={() => setValueError(0)}
              onChange={(val) => setValue(val)}
              className={"h-14 w-40"}
            />

            {/* Botão adicionar saldo */}
            <button
              className={cn(
                "relative rounded-xl enabled:cursor-pointer",
                "h-12 w-12 p-3",
                "text-[24px] font-bold text-white",
                "bg-green-500 disabled:bg-neutral-700",
                "transition duration-200 ease-in-out",
                "enabled:hover:shadow-[0_0_20px_rgba(0,201,80,0.4)]",
              )}
              disabled={
                item.current_value === item.target_value ||
                value === 0 ||
                value === ""
              }
              onClick={() => {
                handleUpdateGoal(Number(value), item);
              }}
            >
              <FaPlus className="h-6 w-6 text-center" />
            </button>

            {/* Botão de deletar/concluir meta */}
            <button
              className={cn(
                "absolute top-7 right-7 flex cursor-pointer items-center justify-center rounded-xl",
                "h-12.5 w-12.5 p-3",
                "text-[24px] font-bold text-white",
                "bg-red-500",
                "transition-all duration-200 ease-in-out",
                "hover:shadow-[0_0_20px_rgba(201,0,0,0.4)]",
                item.current_value === item.target_value &&
                  "w-auto bg-yellow-500 hover:shadow-[0_0_20px_rgba(201,201,0,0.4)]",
              )}
              onClick={() =>
                item.current_value === item.target_value
                  ? handleUpdateGoal(Number(item.current_value), item, true)
                  : handleDeleteGoal(item.id)
              }
            >
              {item.current_value === item.target_value ? (
                "Concluir"
              ) : (
                <FaXmark className="h-9 w-12" />
              )}
            </button>
          </div>
          {valueError !== ERROR_BALANCE.NONE && (
            <ErrorMessage message={valueErrorMessage[valueError]} />
          )}
        </div>
      )}
    </Box>
  );
}
