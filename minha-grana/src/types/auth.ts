export type TransactionInput = {
  category_id: number;
  amount: string;
  type: string;
  description: string;
  transaction_date: string;
  recurrent?: boolean;
  installment?: boolean;
  installmentsQuant?: number;
};

export type Transaction = TransactionInput & {
  id: number;
};

export type Goal = {
  id: number;
  current_value: string;
  target_value: string;
  description: string;
  finished: boolean;
};

export interface User {
  username: string;
  email: string;
  balance: number;
  transactions: Transaction[];
  goals: Goal[];
}

export type AuthResponse = {
  message: string;
  userinfo: User;
};

export type BalanceResponse = {
  message: string;
  balance: number;
};
