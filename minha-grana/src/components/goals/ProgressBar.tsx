import { formatBRL } from "../../utils/formatBRL";
import { cn } from "../../utils/cn";

type ProgressBarProps = {
  current: number;
  goal: number;
};

export default function ProgressBar({ current, goal }: ProgressBarProps) {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <div className="w-full">
      {/* Texto */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[24px] font-semibold text-yellow-300">
          {formatBRL(current)}
        </span>

        <span
          className={cn(
            "text-[24px] font-semibold transition-all duration-300",
            percentage === 100 ? "text-yellow-300" : "text-neutral-600",
          )}
        >
          de {formatBRL(goal)}
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="h-4 w-full overflow-hidden rounded-full bg-black/40">
        <div
          className="h-full rounded-full bg-yellow-400 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
