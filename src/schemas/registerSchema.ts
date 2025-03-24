import { z } from "zod";
import { userCreateSchema } from "./userSchema";

// Extended schema with password confirmation
export const registerFormSchema = userCreateSchema
  .extend({
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
// Type for the extended schema
export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
