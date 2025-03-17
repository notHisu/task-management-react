import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api/axiosConfig";
import { Task } from "../types/Task";

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const url = "/api/Task";

      const response = await apiClient.get<Task[]>(url);
      return response.data;
    },
  });
};

export const useTaskToggleCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number) => {
      const taskResponse = await apiClient.get<Task>(`/api/Task/${taskId}`);
      const currentTask = taskResponse.data;

      const updatedData = {
        isCompleted: !currentTask.isCompleted,
      };

      const url = `/api/Task/${taskId}`;
      const response = await apiClient.put<Task>(url, updatedData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch tasks after successful update
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Failed to toggle task completion:", error);
    },
  });
};
