import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api/axiosConfig";
import { toast } from "react-toastify";
import { TaskAttachment } from "../types/Attachment";
import { useState } from "react";

// Hook to fetch attachments for a task
export const useTaskAttachments = (taskId: number) => {
  return useQuery({
    queryKey: ["taskAttachments", taskId],
    queryFn: async () => {
      const response = await apiClient.get<TaskAttachment[]>(
        `/api/TaskAttachment/${taskId}`
      );
      return response.data;
    },
    enabled: !!taskId,
  });
};

// Hook to upload an attachment with progress tracking
export const useUploadTaskAttachment = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async ({ taskId, file }: { taskId: number; file: File }) => {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size exceeds 10MB limit");
      }

      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("taskId", taskId.toString());

      // Upload with progress tracking
      const response = await apiClient.post<TaskAttachment>(
        `/api/TaskAttachment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["taskAttachments", variables.taskId],
      });
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
      toast.success("File uploaded successfully");
      setUploadProgress(0);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload attachment");
      setUploadProgress(0);
    },
  });

  return {
    ...mutation,
    uploadProgress,
  };
};

// Hook to delete an attachment
export const useDeleteTaskAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      attachmentId,
    }: {
      taskId: number;
      attachmentId: number;
    }) => {
      await apiClient.delete(`/api/TaskAttachment/${attachmentId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["taskAttachments", variables.taskId],
      });
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
      toast.success("Attachment deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete attachment");
    },
  });
};

// Hook to download an attachment (optional)
export const useDownloadAttachment = () => {
  return useMutation({
    mutationFn: async (attachment: TaskAttachment) => {
      const response = await apiClient.get(attachment.fileUrl, {
        responseType: "blob",
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", attachment.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    onError: () => {
      toast.error("Failed to download file");
    },
  });
};
