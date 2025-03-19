import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../services/api/axiosConfig";
import { Label } from "../types/Label";
import { toast } from "react-toastify";

export const useLabels = () => {
  return useQuery({
    queryKey: ["labels"],
    queryFn: async () => {
      const url = "/api/Label";

      const response = await apiClient.get<Label[]>(url);
      return response.data;
    },
  });
};

export const useAddLabel = () => {
  return useMutation({
    mutationFn: async (label: Label) => {
      const url = "/api/Label";

      const response = await apiClient.post<Label>(url, label);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Label added successfully");
    },
    onError: () => {
      toast.error("Failed to add label");
    },
  });
};
