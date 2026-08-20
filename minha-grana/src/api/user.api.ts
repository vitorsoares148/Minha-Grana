import api from "./axios";

export async function updateBalance() {
  const response = await api.put("/api/user/balance", {});

  return response.data;
}
