import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api/axiosConfig";
import { Label } from "../types/Label";

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
