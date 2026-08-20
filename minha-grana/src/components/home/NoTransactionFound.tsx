import Box from "../generic/Box";
import { cn } from "../../utils/cn";
import { useNavigate } from "react-router-dom";

export default function NoTransactionFound() {
  const navigate = useNavigate();

  return (
    <Box>
      <div className="flex flex-col items-center">
        <div className="h-9 text-center font-sans text-[24px] font-bold text-white">
          Nenhuma transação encontrada!
        </div>

        <button
          onClick={() => {
            navigate("/transactions");
          }}
          className={cn(
            "mt-10 cursor-pointer rounded-xl",
            "p-2 px-10",
            "text-[24px] font-bold text-white",
            "bg-green-500",
            "transition duration-200 ease-in-out",
            "hover:shadow-[0_0_20px_rgba(0,201,80,0.4)]",
          )}
        >
          Criar nova transação
        </button>
      </div>
    </Box>
  );
}
