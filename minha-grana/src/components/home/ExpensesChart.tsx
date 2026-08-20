import { Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartEvent,
  type ChartOptions,
} from "chart.js";

import { type Transaction } from "../../types/auth";
import { CATEGORIES } from "../../constants/categories";
import { formatBRL } from "../../utils/formatBRL";

import Box from "../generic/Box";

ChartJS.register(ArcElement, Tooltip, Legend);

type CategoryExpense = {
  name: string;
  amount: number;
  color: string;
};

const chartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      onHover: (event: ChartEvent) => {
        const target = event.native?.target as HTMLElement | null;

        if (target) {
          target.style.cursor = "pointer";
        }
      },
      onLeave: (event: ChartEvent) => {
        const target = event.native?.target as HTMLElement | null;

        if (target) {
          target.style.cursor = "default";
        }
      },
      labels: {
        color: "#FFFFFF",
        font: {
          size: 16,
          family: "sans-serif",
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => formatBRL(context.raw as number),
      },
    },
  },
};

export default function ExpensesChart({
  transactions,
}: {
  transactions: Array<Transaction> | undefined;
}) {
  const expensesByCategory = (transactions ?? [])
    .filter((transaction) => transaction.type === "expense")
    .reduce<CategoryExpense[]>((acc, transaction) => {
      const category = CATEGORIES.find(
        (category) => category.id === transaction.category_id,
      );

      if (!category) return acc;

      const existingCategory = acc.find((item) => item.name === category.name);

      const amount = Number(transaction.amount);

      if (existingCategory) {
        existingCategory.amount += amount;
      } else {
        acc.push({
          name: category.name,
          amount,
          color: category.color,
        });
      }

      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount);

  const data = {
    labels: expensesByCategory.map((item) => item.name),
    datasets: [
      {
        data: expensesByCategory.map((item) => item.amount),
        backgroundColor: expensesByCategory.map((item) => item.color),
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  return (
    <Box>
      <div className="mb-6 text-[24px] font-bold">VISÃO GERAL DE DESPESAS</div>

      <div className="mb-3 flex h-70 w-126 flex-col">
        <Doughnut data={data} options={chartOptions} />
      </div>
    </Box>
  );
}
