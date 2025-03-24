import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isCompleted: z.boolean().default(false),
  categoryId: z.number().nullable().optional(),
  userId: z.number().optional(),
  labelIds: z.array(z.number()).optional(),
  dueDate: z.string().nullable().optional(),
  priority: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
