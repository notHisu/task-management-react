import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api/axiosConfig";
import { TaskLabel } from "../types/Task";

export const useTaskLabels = () => {
  return useQuery({
    queryKey: ["taskLabels"],
    queryFn: async () => {
      const url = "/api/TaskLabel";

      const response = await apiClient.get<TaskLabel[]>(url);
      return response.data;
    },
  });
};
