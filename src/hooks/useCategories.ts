import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api/axiosConfig";
import { Category } from "../types/Category";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const url = "/api/Category";

      const response = await apiClient.get<Category[]>(url);
      return response.data;
    },
  });
};
