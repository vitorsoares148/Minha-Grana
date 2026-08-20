import type { ChangeEvent } from "react";
import { cn } from "../../utils/cn";

type InputBRLProps = {
  value: number | "";
  error: boolean;
  className?: string;
  onClearError: () => void;
  onChange: (value: number | "") => void;
};

export default function InputBRL({
  value,
  error,
  className,
  onClearError,
  onChange,
}: InputBRLProps) {
  function formatBRL(value: number | "") {
    if (value === "") {
      return "";
    }

    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
      onChange("");
    } else {
      onChange(Number(raw));
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative rounded-md shadow-sm">
        <input
          type="text"
          value={formatBRL(value)}
          onFocus={onClearError}
          onChange={(e) => {
            onClearError();
            handleChange(e);
          }}
          placeholder="R$ 0,00"
          maxLength={19}
          className={cn(
            "rounded-xl border-2 bg-neutral-900 p-2 pl-4",
            "text-[20px] font-semibold placeholder:text-white",
            "transition duration-200 ease-in-out focus:outline-0 focus:brightness-140",

            !error && [
              "border-white/8",
              "focus:border-white/50",
              "focus:shadow-[0_0_20px_rgba(200,200,200,0.1)]",
            ],

            error && [
              "border-red-500",
              "shadow-[0_0_20px_rgba(251,44,54,0.1)]",
            ],
            className && [className],
          )}
        />
      </div>
    </div>
  );
}
