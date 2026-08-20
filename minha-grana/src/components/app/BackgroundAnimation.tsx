import { cn } from "../../utils/cn";

export default function BackgroundAnimation() {
  return (
    <div
      className={cn(
        "pointer-events-none fixed top-[34svh]",
        "h-80 w-80 rounded-full",
        "bg-green-500/80",
        "blur-[200px]",
        "animate-[pulse_10s_cubic-bezier(0.4,0,0.6,1)_infinite]",
      )}
    />
  );
}
