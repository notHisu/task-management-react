import { useForm } from "react-hook-form";
import { register as registerApi } from "../../../api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { userCreateSchema } from "../../../schemas/userSchema";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../Button";
import FormField from "./FormField";
import AuthError from "../AuthError";
import FormContainer from "./FormContainer";
import { z } from "zod";

// Extended schema with password confirmation
const registerFormSchema = userCreateSchema
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
type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormSchema) => {
    setIsSubmitting(true);
    setApiError(null);

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = data;

    if (userData.password !== confirmPassword) {
      setApiError("Passwords don't match. Please try again.");
      return;
    }

    try {
      const response = await registerApi(userData);
      if (response.success) {
        navigate("/login");
      } else {
        setApiError(response.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      setApiError("An unexpected error occurred. Please try again.");
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      {apiError && <AuthError message={apiError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Email"
          id="email"
          type="email"
          name="email"
          register={register}
          error={errors.email?.message}
        />

        <FormField
          label="Password"
          id="password"
          type="password"
          name="password"
          register={register}
          error={errors.password?.message}
        />

        <FormField
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
    </FormContainer>
  );
}
