import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="min-h-screen bg-[url('/asfalt-dark.png')] bg-repeat py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 pt-5 border-t border-gray-200">
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="font-medium text-sm text-gray-600 hover:text-indigo-500 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            Protected by our{" "}
            <Link
              to="/privacy"
              className="text-gray-600 hover:text-indigo-500 transition-colors"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              to="/terms"
              className="text-gray-600 hover:text-indigo-500 transition-colors"
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
