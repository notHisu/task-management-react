import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api/axiosConfig";
import { Comment } from "../types/Comment";
import { CommentFormData } from "../schemas/commentSchema";
import { toast } from "react-toastify";

// Get comments for a specific task
export const useTaskComments = (taskId: number) => {
  return useQuery({
    queryKey: ["taskComments", taskId],
    queryFn: async () => {
      const response = await apiClient.get<Comment[]>(
        `/api/TaskComment?taskId=${taskId}`
      );
      return response.data;
    },
    enabled: !!taskId, // Only run query if taskId is provided
  });
};

// Add a new comment
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, content }: CommentFormData) => {
      const response = await apiClient.post<Comment>("/api/TaskComment", {
        taskId,
        content,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["taskComments", data.taskId],
      });
      toast.success("Comment added successfully");
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });
};

// Delete a comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      taskId,
    }: {
      commentId: number;
      taskId: number;
    }) => {
      await apiClient.delete(`/api/TaskComment/${commentId}`);
      return { commentId, taskId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["taskComments", data.taskId],
      });
      toast.success("Comment deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });
};
