import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { userLoginSchema, UserLoginSchema } from "../../../schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import FormContainer from "./FormContainer";
import AuthError from "../AuthError";
import FormField from "./FormField";
import Button from "../Button";

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginSchema>({
    resolver: zodResolver(userLoginSchema),
  });

  const { login, user, error: authError, clearErrors } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (data: UserLoginSchema) => {
    setIsSubmitting(true);
    clearErrors();

    try {
      await login(data);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  return (
    <FormContainer>
      {authError !== null && (
        <AuthError message="Invalid email or password. Please try again." />
      )}

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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </Button>
      </form>
    </FormContainer>
  );
}
