import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";

import Box from "../components/generic/Box";
import GoalObject from "../components/goals/GoalObject";
import AddGoalDropdown from "../components/goals/AddGoalDropdown";
import Loading from "../components/generic/Loading";

export default function Goals() {
  const { user } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [useable, setUseable] = useState(true);
  const [loadingGoals, setLoadingGoals] = useState(false);

  const activeGoals = user?.goals.filter((goal) => !goal.finished) ?? [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setUseable(true);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [useable]);

  return (
    <div className="min-h-screen">
      <div className="h-18" />
      <Box className="mt-5">
        <div className="w-152 lg:w-297">
          <div className="relative mb-7 flex items-end justify-between border-b-2 border-white/25 pb-4 text-[36px] font-bold">
            Metas
            {/* Botão de criar meta */}
            <button
              className={cn(
                "relative cursor-pointer rounded-xl",
                "p-3 px-6",
                "text-[24px] font-bold text-white",
                "bg-white/10",
                "transition duration-200 ease-in-out",
                openMenu
                  ? "bg-green-500 shadow-[0_0_20px_rgba(0,201,80,0.4)]"
                  : "hover:bg-white/20",
              )}
              disabled={!useable}
              onClick={() => setOpenMenu(true)}
            >
              Criar meta
            </button>
            {/* Menu de criar transação */}
            {openMenu && (
              <AddGoalDropdown
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                setUseable={setUseable}
              />
            )}
          </div>

          {loadingGoals ? (
            <Loading />
          ) : (
            <div>
              {/* Nenhuma meta */}
              {activeGoals.length === 0 && (
                <div className="mb-5 text-center text-[24px] font-bold">
                  Nenhuma meta encontrada!
                </div>
              )}

              {/* Metas */}
              <ul className="grid max-h-148 place-items-center gap-y-7 overflow-y-auto lg:grid-cols-2">
                {activeGoals.map(
                  (goal) =>
                    !goal.finished && (
                      <GoalObject
                        item={goal}
                        setLoadingGoals={setLoadingGoals}
                        key={goal.id}
                      />
                    ),
                )}
              </ul>
            </div>
          )}
        </div>
      </Box>
    </div>
  );
}
