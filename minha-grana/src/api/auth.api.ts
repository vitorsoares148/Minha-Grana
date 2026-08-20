import axios from "axios";
import type { User } from "../types/auth";
import api from "./axios";

type UserInfoResponse = {
  message: string;
  userinfo: User;
};

export async function register(
  username: string,
  email: string,
  password: string,
) {
  try {
    const response = await api.post("/api/auth/register", {
      name: username,
      email,
      password,
    });

    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.error ?? "INTERNAL_SERVER_ERROR";
    }

    return "INTERNAL_SERVER_ERROR";
  }
}

export async function login(username: string, password: string) {
  try {
    const response = await api.post("/api/auth/login", {
      name: username,
      password,
    });

    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.error ?? "INTERNAL_SERVER_ERROR";
    }

    return "INTERNAL_SERVER_ERROR";
  }
}

export async function getUserInfo(
  month: number,
  year: number,
): Promise<UserInfoResponse> {
  const response = await api.get<UserInfoResponse>(`/api/auth/userinfo`, {
    params: {
      month,
      year,
    },
  });

  return response.data;
}

export async function logout() {
  try {
    const response = await api.post("/api/auth/logout");

    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.error ?? "INTERNAL_SERVER_ERROR";
    }

    return "INTERNAL_SERVER_ERROR";
  }
}
