import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api/axiosConfig";
import { TaskLabel } from "../types/Task";
import { toast } from "react-toastify";

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

export const useTaskLabelsByTaskId = (taskId: number) => {
  return useQuery({
    queryKey: ["taskLabels", taskId], // Include taskId in the queryKey
    queryFn: async ({ queryKey }) => {
      // Access via destructured context
      const [_key, taskId] = queryKey as [string, number];
      const url = `/api/TaskLabel/${taskId}`;

      const response = await apiClient.get<TaskLabel[]>(url);
      return response.data;
    },
    // Only enable the query when taskId exists
    enabled: !!taskId,
  });
};

export const useAddTaskLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      labelId,
    }: {
      taskId: number;
      labelId: number;
    }) => {
      const url = "/api/TaskLabel";

      const response = await apiClient.post<TaskLabel>(url, {
        taskId,
        labelId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLabels"] });
      toast.success("Label added to task successfully");
    },
    onError: () => {
      toast.error("Failed to add label to task");
    },
  });
};

export const useDeleteTaskLabel = () => {
  return useMutation({
    mutationFn: async ({
      taskId,
      labelId,
    }: {
      taskId: number;
      labelId: number;
    }) => {
      const url = `/api/TaskLabel/${taskId}/${labelId}`;

      await apiClient.delete(url);
    },
  });
};
