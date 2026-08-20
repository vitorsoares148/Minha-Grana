import { FaXmark } from "react-icons/fa6";
import { cn } from "../../utils/cn";

type TransactionToggleProps = {
  checked: boolean;
  label: string;
  onClick: () => void;
};

export default function TransactionToggle({
  checked,
  label,
  onClick,
}: TransactionToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className="flex cursor-pointer items-center gap-2"
    >
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center",
          "overflow-hidden rounded-sm border-2 bg-neutral-900",
          "transition duration-200 ease-in-out",
          checked
            ? "border-white shadow-[0_0_10px_rgba(200,200,200,0.1)]"
            : "border-white/8",
        )}
      >
        {checked && <FaXmark className="h-6 w-6" />}
      </span>

      <span className="text-center font-sans text-[18px] font-semibold">
        {label}
      </span>
    </button>
  );
}
