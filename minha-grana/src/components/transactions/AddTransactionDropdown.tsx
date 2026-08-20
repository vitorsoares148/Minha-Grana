import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { format } from "date-fns";

import { cn } from "../../utils/cn";
import { CATEGORIES } from "../../constants/categories";
import { createTransaction } from "../../services/transactions.service";
import type { TransactionInput } from "../../types/auth";
import { useAuth } from "../../contexts/AuthContext";

import CategoryDropdown from "./CategoryDropdown";
import TransactionToggle from "./TransactionToggle";
import InputInfo from "../login/InputInfo";
import InputBRL from "./InputBRL";

const ERROR_TRANSACTION = {
  NONE: 0,
  INVALID: 1,
  REQUIRED: 2,
};

export default function AddTransactionDropdown({
  openMenu,
  selectedDate,
  setOpenMenu,
  setUseable,
}: {
  openMenu: boolean;
  selectedDate: Date;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setUseable: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [description, setDesc] = useState("");
  const [value, setValue] = useState<number | "">(0);
  const [category, setCategory] = useState(1);
  const [recurrent, setRecurrent] = useState(false);
  const [installments, setInstallments] = useState(false);
  const [installmentsQuant, setInstallmentsQuant] = useState("");

  const [descError, setDescError] = useState(ERROR_TRANSACTION.NONE);
  const [valueError, setValueError] = useState(ERROR_TRANSACTION.NONE);
  const [installmentsError, setInstallmentsError] = useState(
    ERROR_TRANSACTION.NONE,
  );

  const menuRef = useRef<HTMLDivElement>(null);

  const { getUserInfoDate, updateBalance } = useAuth();

  const selectedCategory = CATEGORIES.find((item) => item.id === category);

  const isExpense = selectedCategory?.expense ?? false;

  const descErrorMessages = {
    [ERROR_TRANSACTION.INVALID]: "Descrição inválida.",
    [ERROR_TRANSACTION.REQUIRED]: "Campo obrigatório.",
  };

  const valueErrorMessages = {
    [ERROR_TRANSACTION.INVALID]: "Valor inválido.",
    [ERROR_TRANSACTION.REQUIRED]: "Campo obrigatório.",
  };

  function resetMenu() {
    setDescError(ERROR_TRANSACTION.NONE);
    setValueError(ERROR_TRANSACTION.NONE);
    setDesc("");
    setValue(0);
    setCategory(1);
    setInstallments(false);
    setRecurrent(false);
    setInstallmentsQuant("");
  }

  useEffect(() => {
    resetMenu();
  }, [openMenu]);

  const handleNumeric = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setInstallmentsQuant(numericValue);
  };

  useEffect(() => {
    const handleClickOutsideMenu = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
        setUseable(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideMenu);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);

  function validateTransaction(): boolean {
    if (description.trim().length === 0) {
      setDescError(ERROR_TRANSACTION.REQUIRED);
      return false;
    }

    if (value === 0) {
      setValueError(ERROR_TRANSACTION.INVALID);
      return false;
    }

    if (installments) {
      if (!installmentsQuant) {
        setInstallmentsError(ERROR_TRANSACTION.REQUIRED);
        return false;
      }

      const quantity = Number(installmentsQuant);

      if (!Number.isInteger(quantity) || quantity < 2) {
        setInstallmentsError(ERROR_TRANSACTION.INVALID);
        return false;
      }
    }

    return true;
  }

  function buildTransaction(): TransactionInput {
    return {
      category_id: category,
      amount: String(Number(value) / 100),
      type: isExpense ? "expense" : "income",
      description,
      transaction_date: format(selectedDate, "yyyy-MM-dd"),
      recurrent,
      installment: installments,
      installmentsQuant: installments ? Number(installmentsQuant) : undefined,
    };
  }

  async function handleCreateTransaction() {
    if (!validateTransaction()) {
      return;
    }

    const transaction = buildTransaction();

    try {
      const result = await createTransaction(transaction);

      if (result.message !== "SUCCESS") {
        setValueError(ERROR_TRANSACTION.INVALID);
        return;
      }

      await updateBalance();

      setOpenMenu(false);

      await getUserInfoDate(
        selectedDate.getMonth(),
        selectedDate.getFullYear(),
      );
    } catch (error) {
      console.error("Create transaction error:", error);
      setValueError(ERROR_TRANSACTION.INVALID);
    }
  }

  function ErrorMessage({ message }: { message?: string }) {
    if (!message) return null;

    return (
      <div className="mt-1 mr-11 text-center text-[18px] font-semibold text-red-500">
        {message}
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className={cn(
        "absolute bottom-26 left-1/2 z-8 -translate-x-1/2 transform",
        "h-auto w-120 rounded-lg p-3",
        "border-2 border-white/8 text-white",
        "bg-neutral-900/90",
      )}
    >
      <div>
        {/* Descrição Input */}
        <div className="mb-3 flex items-center">
          <div>
            <div className="flex items-center gap-2">
              <InputInfo
                value={description}
                onChange={setDesc}
                onErrorReset={() => setDescError(ERROR_TRANSACTION.NONE)}
                placeholder="Descrição"
                className="w-80"
                type="text"
                error={descError !== ERROR_TRANSACTION.NONE}
                maxLength={40}
              />
              <div className="text-[18px] font-bold text-neutral-600">
                {description.length}/40
              </div>
            </div>
            {descError !== ERROR_TRANSACTION.NONE && (
              <ErrorMessage message={descErrorMessages[descError]} />
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2.5">
            {/* Valor Input */}
            <InputBRL
              value={value}
              error={valueError !== ERROR_TRANSACTION.NONE}
              onClearError={() => setValueError(ERROR_TRANSACTION.NONE)}
              className="w-40"
              onChange={setValue}
            />

            {/* Categoria Dropdown */}
            <CategoryDropdown
              selectedCategory={selectedCategory}
              setCategory={(id) => {
                setCategory(id);
                setInstallments(false);
                setRecurrent(false);
              }}
            />
          </div>
          {valueError !== ERROR_TRANSACTION.NONE && (
            <div className="mt-1 mr-72 text-center text-[18px] font-semibold text-red-500">
              {valueErrorMessages[valueError]}
            </div>
          )}
        </div>

        {/* Checkbox Recorrente */}
        <div className="flex h-12.5 items-center gap-10">
          <TransactionToggle
            checked={recurrent}
            label="Recorrente"
            onClick={() => {
              setRecurrent((prev) => !prev);
              setInstallments(false);
            }}
          />

          {/* Checkbox Parcelado */}
          {isExpense && (
            <div className="flex items-center gap-2">
              <TransactionToggle
                checked={installments}
                label="Parcelado"
                onClick={() => {
                  setInstallments((prev) => !prev);
                  setRecurrent(false);
                }}
              />

              {installments && (
                <InputInfo
                  value={installmentsQuant}
                  onChange={handleNumeric}
                  onErrorReset={() =>
                    setInstallmentsError(ERROR_TRANSACTION.NONE)
                  }
                  placeholder="Prest"
                  className="ml-1 w-20"
                  type="text"
                  numeric={true}
                  error={installmentsError !== ERROR_TRANSACTION.NONE}
                  maxLength={2}
                />
              )}
            </div>
          )}
        </div>

        {/* Botão */}
        <button
          className={cn(
            "fixed right-3 bottom-3 flex cursor-pointer justify-center self-end rounded-xl",
            "h-12.5 w-12.5 p-3",
            "text-[24px] font-bold text-white",
            "bg-green-500",
            "transition duration-200 ease-in-out",
            "hover:shadow-[0_0_20px_rgba(0,201,80,0.4)]",
          )}
          onClick={() => handleCreateTransaction()}
        >
          <FaPlus className="h-7 w-12" />
        </button>
      </div>
    </div>
  );
}
