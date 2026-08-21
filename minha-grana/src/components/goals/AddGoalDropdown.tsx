import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";

import { cn } from "../../utils/cn";
import { createGoal } from "../../services/goals.service";
import { useAuth } from "../../contexts/AuthContext";

import InputInfo from "../login/InputInfo";
import InputBRL from "../transactions/InputBRL";
import Loading from "../generic/Loading";

const ERROR_GOAL = {
  NONE: 0,
  INVALID: 1,
  REQUIRED: 2,
};

type AddGoalDropdownProps = {
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setUseable: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddGoalDropdown({
  openMenu,
  setOpenMenu,
  setUseable,
}: AddGoalDropdownProps) {
  const [description, setDesc] = useState("");
  const [value, setValue] = useState<number | "">(0);
  const [loadingCreateGoal, setLoadingCreateGoal] = useState(false);

  const [descError, setDescError] = useState(ERROR_GOAL.NONE);
  const [valueError, setValueError] = useState(ERROR_GOAL.NONE);

  const dropdownRefMenu = useRef<HTMLDivElement>(null);

  const { getUserInfo } = useAuth();

  const descErrorMessage = {
    [ERROR_GOAL.INVALID]: "Descrição inválida.",
    [ERROR_GOAL.REQUIRED]: "Campo obrigatório.",
  };

  const valueErrorMessage = {
    [ERROR_GOAL.INVALID]: "Valor inválido.",
    [ERROR_GOAL.REQUIRED]: "Campo obrigatório.",
  };

  function resetMenu() {
    setDescError(ERROR_GOAL.NONE);
    setValueError(ERROR_GOAL.NONE);
    setDesc("");
    setValue(0);
  }

  useEffect(() => {
    resetMenu();
  }, [openMenu]);

  useEffect(() => {
    const handleClickOutsideMenu = (event: MouseEvent) => {
      if (
        dropdownRefMenu.current &&
        !dropdownRefMenu.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
        setUseable(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideMenu);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);

  function validateGoal() {
    if (description.trim().length === 0) {
      setDescError(ERROR_GOAL.REQUIRED);
      return false;
    }

    if (value === 0 || value === "") {
      setValueError(ERROR_GOAL.INVALID);
      return false;
    }

    return true;
  }

  async function handleCreateGoal() {
    if (!validateGoal()) {
      return;
    }

    setLoadingCreateGoal(true);

    const convertedValue = Number(value) / 100;

    try {
      const result = await createGoal(description.trim(), convertedValue);

      if (result.message !== "SUCCESS") {
        setValueError(ERROR_GOAL.INVALID);
        return;
      }

      setOpenMenu(false);
      await getUserInfo();
    } catch (error) {
      console.error("Create goal error:", error);
    } finally {
      setLoadingCreateGoal(false);
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
      ref={dropdownRefMenu}
      className={cn(
        "absolute top-17 right-0 z-8",
        "min-h-35 w-120 rounded-lg p-3",
        "border-2 border-white/8 text-white",
        "bg-neutral-900",
      )}
    >
      {loadingCreateGoal ? (
        <Loading className="mt-8" />
      ) : (
        <div>
          <div className="mb-3 flex items-center">
            <div>
              {/* Input Descrição */}
              <div className="flex items-center gap-2">
                <InputInfo
                  value={description}
                  onChange={setDesc}
                  onErrorReset={() => setDescError(ERROR_GOAL.NONE)}
                  placeholder="Descrição"
                  className="w-80"
                  type="text"
                  error={descError !== ERROR_GOAL.NONE}
                  maxLength={40}
                />
                <div className="text-[18px] font-bold text-neutral-600">
                  {description.length}/40
                </div>
              </div>

              {descError !== ERROR_GOAL.NONE && (
                <ErrorMessage message={descErrorMessage[descError]} />
              )}
            </div>
          </div>

          <div>
            {/* Input Valor */}
            <InputBRL
              value={value}
              error={valueError !== ERROR_GOAL.NONE}
              onClearError={() => setValueError(ERROR_GOAL.NONE)}
              className="w-40"
              onChange={(val) => setValue(val)}
            />

            {valueError !== ERROR_GOAL.NONE && (
              <div className="mt-1 mr-72 text-center text-[18px] font-semibold text-red-500">
                {valueErrorMessage[valueError]}
              </div>
            )}
          </div>

          {/* Botão */}
          <button
            className={cn(
              "absolute right-3 bottom-3 flex cursor-pointer justify-center self-end rounded-xl",
              "h-12.5 w-12.5 p-3",
              "text-[24px] font-bold text-white",
              "bg-green-500",
              "transition duration-200 ease-in-out",
              "hover:shadow-[0_0_20px_rgba(0,201,80,0.4)]",
            )}
            onClick={() => handleCreateGoal()}
          >
            <FaPlus className="h-7 w-12" />
          </button>
        </div>
      )}
    </div>
  );
}
