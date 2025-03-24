import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api/axiosConfig";
import { Task, TaskLabel, TaskWithLabelsFormData } from "../types/Task";
import { toast } from "react-toastify";

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

export const useTaskById = (taskId: number) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async ({ queryKey }) => {
      const [_key, taskId] = queryKey as [string, number];
      const url = `/api/Task/${taskId}`;

      const response = await apiClient.get<Task>(url);
      return response.data;
    },
    enabled: !!taskId,
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
        categoryId: currentTask.categoryId,
        title: currentTask.title,
        description: currentTask.description,
        dueDate: currentTask.dueDate,
        priority: currentTask.priority,
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

// New hook for editing tasks
export const useTaskEdit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      data,
    }: {
      taskId: number;
      data: TaskWithLabelsFormData;
    }) => {
      // Step 1: Update the task
      const { labelIds, ...taskData } = data;
      const taskResponse = await apiClient.put<Task>(
        `/api/Task/${taskId}`,
        taskData
      );
      const updatedTask = taskResponse.data;

      // Step 2: Handle labels if provided
      if (labelIds && updatedTask.id) {
        // First delete existing labels
        const currentLabels = await apiClient.get(`/api/TaskLabel/${taskId}`);
        if (currentLabels.data && currentLabels.data.length > 0) {
          await Promise.all(
            currentLabels.data.map(async (label: TaskLabel) =>
              // Use the correct API endpoint format for deleting task labels
              apiClient.delete(`/api/TaskLabel/${taskId}/${label.labelId}`)
            )
          );
        }

        // Add new labels
        const labelPromises = labelIds.map(
          async (labelId) =>
            await apiClient.post("/api/TaskLabel", {
              taskId: updatedTask.id,
              labelId,
            })
        );

        await Promise.all(labelPromises);
      }

      return updatedTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    },
  });
};

// New hook for deleting tasks
export const useTaskDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number) => {
      await apiClient.delete(`/api/Task/${taskId}`);
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    },
  });
};
