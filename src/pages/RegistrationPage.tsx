import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

function RegistrationPage() {
  return (
    <div className="min-h-screen bg-[url('/arches.png')] bg-repeat py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us to get started with your journey
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 pt-5 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            By signing up, you agree to our{" "}
            <Link
              to="/terms"
              className="text-gray-600 hover:text-indigo-500 transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-gray-600 hover:text-indigo-500 transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
