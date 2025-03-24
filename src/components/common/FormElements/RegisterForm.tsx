import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCreateSchema } from "../../../schemas/userSchema";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../Button";
import FormField from "./FormField";
import AuthError from "../AuthError";
import FormContainer from "./FormContainer";
import { useAuth } from "../../../hooks/useAuth";
import {
  registerFormSchema,
  RegisterFormSchema,
} from "../../../schemas/registerSchema";

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  });

  // Get register mutation from useAuth hook
  const { register: registerMutation } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormSchema) => {
    setIsSubmitting(true);
    setApiError(null);

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = data;

    try {
      // Use the mutation from useAuth hook
      await registerMutation.mutateAsync(userData as UserCreateSchema, {
        onSuccess: () => {
          // Redirect to login page on successful registration
          navigate("/login");
        },
        onError: (error) => {
          // Handle registration error
          setApiError(
            error.message || "Registration failed. Please try again."
          );
        },
      });
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
          register={registerField}
          error={errors.email?.message}
        />

        <FormField
          label="Password"
          id="password"
          type="password"
          name="password"
          register={registerField}
          error={errors.password?.message}
        />

        <FormField
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          register={registerField}
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          disabled={isSubmitting || registerMutation.isPending}
          className="w-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
        >
          {isSubmitting || registerMutation.isPending
            ? "Registering..."
            : "Register"}
        </Button>
      </form>
    </FormContainer>
  );
}
