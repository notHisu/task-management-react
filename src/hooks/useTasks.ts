import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api/axiosConfig";
import { Task } from "../types/Task";

/**
 * Hook for fetching all tasks with optional filtering
 */
export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"], // Add a query key (required)
    queryFn: async () => {
      const url = "/api/Task";

      const response = await apiClient.get<Task[]>(url);
      return response.data;
    },
  });
};
