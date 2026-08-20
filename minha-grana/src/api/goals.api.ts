import api from "./axios";

export async function createGoal(description: string, targetValue: number) {
  const response = await api.post(`/api/goals`, {
    description,
    target_value: targetValue,
  });

  return response.data;
}

export async function deleteGoal(id: number) {
  const response = await api.delete(`/api/goals/${id}`);

  return response.data;
}

export async function updateGoal(
  id: number,
  currentValue: number,
  finished: boolean,
) {
  const response = await api.patch(`/api/goals/${id}`, {
    current_value: currentValue,
    finished,
  });

  return response.data;
}
