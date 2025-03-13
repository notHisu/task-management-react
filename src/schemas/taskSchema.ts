import { z } from "zod";

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  userId: z.number().optional(),
  categoryId: z.number().optional(),
  createdAt: z.date().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
