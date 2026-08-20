import { FaAngleDown } from "react-icons/fa";

import { cn } from "../../utils/cn";

type DateDropdownOption = {
  id: number;
  name: string;
};

type DateDropdownProps = {
  value: string;
  options: DateDropdownOption[];
  open: boolean;
  rounded: "left" | "right";
  onToggle: () => void;
  onSelect: (value: number) => void;
};

export default function DateDropdown({
  value,
  options,
  open,
  rounded,
  onToggle,
  onSelect,
}: DateDropdownProps) {
  return (
    <div className="relative">
      <div
        onClick={onToggle}
        className={cn(
          "flex items-center gap-1",
          "cursor-pointer border-2 border-white/8",
          rounded === "left"
            ? "rounded-l-xl border-r"
            : "rounded-r-xl border-l",
          "bg-neutral-900 py-2 pr-2 pl-3",
          "font-sans text-[24px] font-bold",
          "transition duration-200 ease-in-out",
          "hover:bg-neutral-800/60 hover:text-green-500",
          open && "bg-neutral-800/60 text-green-500",
          !open && "text-white",
        )}
      >
        <div>{value}</div>
        <FaAngleDown className="mt-1.5 h-4 w-4" />
      </div>

      {open && (
        <div
          className={cn(
            "absolute top-full left-0 z-50 mt-2",
            "w-32 overflow-hidden rounded-lg",
            "border-2 border-white/8 text-white",
            "bg-neutral-900/45 backdrop-blur-xl",
          )}
        >
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={cn(
                "block w-full px-3 py-2 text-left",
                "text-[18px] text-white/50",
                "hover:bg-white/8 hover:text-white",
              )}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
