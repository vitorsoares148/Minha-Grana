export type Category = {
  id: number;
  emoji: string;
  name: string;
  color: string;
  expense: boolean;
};

export const CATEGORIES: Category[] = [
  {
    id: 1,
    emoji: "💵",
    name: "Salário",
    color: "rgba(255,255,255, 1)",
    expense: false,
  },
  {
    id: 2,
    emoji: "🏦",
    name: "Deposito",
    color: "rgba(255, 255, 255, 1)",
    expense: false,
  },
  {
    id: 3,
    emoji: "🏠",
    name: "Aluguel",
    color: "rgba(0,80,255, 1)",
    expense: true,
  },
  {
    id: 4,
    emoji: "🛒",
    name: "Supermercado",
    color: "rgba(255,0,80, 1)",
    expense: true,
  },
  {
    id: 5,
    emoji: "🚗",
    name: "Transporte",
    color: "rgba(80,255,0, 1)",
    expense: true,
  },
  {
    id: 6,
    emoji: "📺",
    name: "Entretenimento",
    color: "rgba(128, 80, 255, 1)",
    expense: true,
  },
  {
    id: 7,
    emoji: "🍝",
    name: "Comida",
    color: "rgba(255, 80, 0, 1)",
    expense: true,
  },
  {
    id: 8,
    emoji: "❤️",
    name: "Saúde",
    color: "rgba(0, 255, 128, 1)",
    expense: true,
  },
  {
    id: 9,
    emoji: "👜",
    name: "Shopping",
    color: "rgba(0, 255, 255, 1)",
    expense: true,
  },
  {
    id: 10,
    emoji: "✈️",
    name: "Viagens",
    color: "rgba(80, 128, 255, 1)",
    expense: true,
  },
  {
    id: 11,
    emoji: "🔨",
    name: "Utilidades",
    color: "rgba(255, 255, 0, 1)",
    expense: true,
  },
  {
    id: 12,
    emoji: "❓",
    name: "Outros",
    color: "rgba(80,80,80, 1)",
    expense: true,
  },
];
