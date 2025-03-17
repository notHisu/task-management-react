import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api/axiosConfig";
import { Task, TaskWithLabelsFormData } from "../types/Task";
import { toast } from "react-toastify";

// Track in-flight requests to prevent duplicates
const pendingRequests = new Set<string>();

export function useTaskWithLabelsCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TaskWithLabelsFormData) => {
      console.log("Creating task with data:", data);

      // Create a request ID based on the data
      const requestId = JSON.stringify(data);

      // Skip if this exact request is already in progress
      if (pendingRequests.has(requestId)) {
        console.log("Skipping duplicate request:", requestId);
        return null as unknown as Task; // Type casting to satisfy TypeScript
      }

      // Mark this request as pending
      pendingRequests.add(requestId);

      // Step 1: Create the task
      const { labelIds, ...taskData } = data;

      try {
        taskData.userId = 0;
        const taskResponse = await apiClient.post<Task>("/api/Task", taskData);
        const newTask = taskResponse.data;
        console.log("Task created successfully:", newTask);

        // Step 2: Add labels if provided
        if (labelIds && labelIds.length > 0 && newTask.id) {
          console.log("Adding labels:", labelIds);
          const labelPromises = labelIds.map(
            async (labelId) =>
              await apiClient.post("/api/TaskLabel", {
                taskId: newTask.id,
                labelId,
              })
          );

          await Promise.all(labelPromises);
        }

        return newTask;
      } catch (error) {
        console.error("API error:", error);
        throw error;
      } finally {
        // Remove from pending requests after a short delay
        // (the delay helps with StrictMode's double invocation)
        setTimeout(() => {
          pendingRequests.delete(requestId);
        }, 100);
      }
    },
    onSuccess: (data) => {
      // Only show success and invalidate queries if we got actual data
      if (data) {
        // Invalidate the tasks query to refresh the task list
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        toast.success("Task created successfully");
      }
    },
    onError: (error) => {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task. Please try again.");
    },
  });
}
