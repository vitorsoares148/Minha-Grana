import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type BoxProps = {
  children: ReactNode;
  className?: string;
};

export default function Box({ children, className }: BoxProps) {
  return (
    <div
      className={cn(
        "relative z-1 flex flex-col",
        "rounded-2xl border-2 border-white/8 p-7",
        "font-sans text-white",
        "bg-linear-to-b from-neutral-900/60 to-neutral-900/80",
        "backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
