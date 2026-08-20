import type { ReactNode } from "react";

import { cn } from "../../utils/cn";

type NavItemProps = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
};

export default function NavItem({ label, icon, onClick }: NavItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "mx-5 flex cursor-pointer items-center space-x-2 rounded-xl bg-white/6",
        "px-3 py-2",
        "text-white",
        "transition duration-300 ease-in-out",
        "hover:bg-green-500 hover:shadow-[0_0_20px_rgba(0,201,80,0.4)]",
      )}
    >
      {icon}
      <div className="text-[24px] font-bold">{label}</div>
    </div>
  );
}
