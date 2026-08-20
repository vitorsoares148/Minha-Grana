import { cn } from "../../utils/cn";

type InputInfoProps = {
  value: string;
  placeholder?: string;
  type: React.HTMLInputTypeAttribute;
  onChange: (value: string) => void;
  onErrorReset: (reset: boolean) => void;
  error?: boolean;
  className?: string;
  maxLength?: number;
  numeric?: boolean;
};

export default function InputInfo({
  value,
  placeholder,
  type,
  onChange,
  onErrorReset,
  error = false,
  className,
  maxLength = 200,
  numeric = false,
}: InputInfoProps) {
  return (
    <input
      className={cn(
        "rounded-xl border-2 bg-neutral-900 p-2 pl-4",
        "text-[20px] placeholder:font-semibold placeholder:text-neutral-500/80",
        "transition duration-200 ease-in-out focus:outline-0 focus:brightness-140",

        !error && [
          "border-white/8",
          "focus:border-white/50",
          "focus:shadow-[0_0_20px_rgba(200,200,200,0.1)]",
        ],

        error && ["border-red-500", "shadow-[0_0_20px_rgba(251,44,54,0.1)]"],

        className,
      )}
      placeholder={placeholder}
      type={type}
      value={value}
      maxLength={maxLength}
      inputMode={numeric ? "decimal" : undefined}
      onFocus={() => onErrorReset(true)}
      onBlur={() => onErrorReset(false)}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
