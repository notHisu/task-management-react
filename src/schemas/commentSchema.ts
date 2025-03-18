import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment cannot exceed 500 characters"),
  taskId: z.number().optional(),
});

export type CommentFormData = z.infer<typeof commentSchema>;
