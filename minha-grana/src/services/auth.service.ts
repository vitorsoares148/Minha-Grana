import {
  login as apiLogin,
  register as apiRegister,
  getUserInfo as apiUserInfo,
  logout as apiLogout,
} from "../api/auth.api";
import { updateBalance as apiUpdateBalance } from "../api/user.api";

import type { AuthResponse, BalanceResponse } from "../types/auth";

export async function userInfo(date: Date): Promise<AuthResponse> {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return await apiUserInfo(month, year);
}

export async function login(username: string, password: string) {
  return await apiLogin(username, password);
}

export async function register(
  username: string,
  email: string,
  password: string,
) {
  return await apiRegister(username, email, password);
}

export async function updateBalance(): Promise<BalanceResponse> {
  return await apiUpdateBalance();
}

export async function logout() {
  return await apiLogout();
}
