import {
  createGoal as apiCreateGoal,
  deleteGoal as apiDeleteGoal,
  updateGoal as apiUpdateGoal,
} from "../api/goals.api";

export async function createGoal(description: string, targetValue: number) {
  return await apiCreateGoal(description, targetValue);
}

export async function deleteGoal(id: number) {
  return await apiDeleteGoal(id);
}

export async function updateGoal(
  id: number,
  currentValue: number,
  finished: boolean,
) {
  return await apiUpdateGoal(id, currentValue, finished);
}
