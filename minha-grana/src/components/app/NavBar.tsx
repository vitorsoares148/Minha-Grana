import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { IoMenuSharp } from "react-icons/io5";
import { FaTrophy } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { IoMdHome, IoMdExit } from "react-icons/io";

import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.png";
import { cn } from "../../utils/cn";
import { formatBRL } from "../../utils/formatBRL";

import NavItem from "./NavItem";

const navigationItems = [
  {
    label: "Home",
    path: "/home",
    icon: IoMdHome,
  },
  {
    label: "Transações",
    path: "/transactions",
    icon: GrTransaction,
  },
  {
    label: "Metas",
    path: "/goals",
    icon: FaTrophy,
  },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hasPositiveBalance = user?.balance !== undefined && user.balance >= 0;

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <div>
      {/* Barra de Navegação Horizontal */}
      <div
        className={cn(
          "fixed top-0 left-0 z-3",
          "flex h-18 min-w-screen items-center space-x-2",
          "px-3.5 pt-3 pb-2.5",
          "border-b-2 border-white/8 text-white",
          "bg-neutral-900/80 backdrop-blur-xl",
        )}
      >
        {/* Saldo */}
        <div className="group fixed top-3 right-16 font-sans">
          <div
            className={cn(
              "fixed top-3 right-18 rounded-xl border-2 px-4 py-1",
              "text-end text-[24px] font-semibold",
              hasPositiveBalance ? "text-yellow-300" : "text-orange-500",
            )}
          >
            {formatBRL(user?.balance)}
          </div>

          <div
            className={cn(
              "absolute top-12 right-0 mb-2 hidden w-100 rounded-lg",
              "border-2 border-white/8 bg-neutral-900",
              "p-3 text-center text-sm text-white shadow-lg group-hover:block",
            )}
          >
            <h4
              className={cn(
                "mb-2 text-[24px] font-bold",
                hasPositiveBalance ? "text-yellow-300" : "text-orange-500",
              )}
            >
              Saldo
            </h4>

            <p className="mb-2 text-[18px]">
              Esse é o seu saldo atual, ele é calculado pelo valor economizado
              em meses anteriores e pode ser utilizado para alcançar metas.
            </p>
          </div>
        </div>

        {/* Logout */}
        <IoMdExit
          onClick={logout}
          className="fixed top-4 right-4 h-10 w-10 cursor-pointer rounded-xl transition-all duration-200 hover:text-red-500"
        />
      </div>

      {/* Menu */}
      <div
        className={cn(
          "fixed top-2 left-0 z-4",
          "flex items-center space-x-2",
          "px-3.5 pb-2.5",
        )}
      >
        <div
          onClick={() => setIsOpen((current) => !current)}
          className={cn(
            "flex h-14 w-14 flex-col items-center justify-center",
            "cursor-pointer rounded-2xl text-white",
            isOpen &&
              "border-2 border-white/8 bg-neutral-900 transition-colors duration-300",
            !isOpen &&
              "border-transparent transition duration-300 hover:text-green-500",
          )}
        >
          <IoMenuSharp className="h-10 w-10" />
        </div>

        <img
          className={cn(
            "max-h-10 cursor-pointer select-none",
            isOpen && "ml-6",
          )}
          src={logo}
          alt="Logo"
          onClick={() => navigate("/home")}
        />
      </div>

      {/* Menu lateral */}
      {isOpen && (
        <div className="fixed top-0 z-3 min-h-full min-w-full">
          <div
            className={cn(
              "fixed left-0 z-3",
              "flex min-h-full w-82 flex-col space-y-4 pt-24",
              "border-r-2 border-white/8 text-white",
              "bg-neutral-900/80 backdrop-blur-xl",
            )}
          >
            {navigationItems.map(({ label, path, icon: Icon }) => (
              <NavItem
                key={path}
                label={label}
                icon={<Icon className="h-7 w-7" />}
                onClick={() => navigate(path)}
              />
            ))}
          </div>

          {/* Background */}
          <div
            className="fixed right-0 z-2 min-h-full min-w-full"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
