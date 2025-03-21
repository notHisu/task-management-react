import RegisterForm from "../components/common/FormElements/RegisterForm";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserPlus, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

function RegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full flex flex-col lg:flex-row overflow-hidden rounded-xl shadow-2xl">
        {/* Left column - Benefits */}
        <motion.div
          className="lg:w-5/12 bg-indigo-600 p-8 text-white relative overflow-hidden hidden lg:block"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6">Join TaskMaster</h2>
            <p className="text-indigo-100 mb-8">
              Streamline your workflow and boost productivity with our powerful
              task management platform.
            </p>

            <ul className="space-y-4">
              {[
                "Track and organize tasks efficiently",
                "Collaborate with your team seamlessly",
                "Never miss a deadline again",
                "Visualize your progress with analytics",
              ].map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <FaCheckCircle className="text-indigo-200 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-12 pt-4 border-t border-indigo-500">
              <p className="text-sm text-indigo-200">
                "TaskMaster helped us reduce missed deadlines by 85% and
                improved team coordination."
              </p>
              <p className="text-sm font-semibold mt-2">
                — Le Trung Hoa Hieu, CEO at TechMaster
              </p>
            </div>
          </div>

          {/* Background decorative elements */}
          <div className="absolute right-0 bottom-0 opacity-10">
            <svg
              width="180"
              height="180"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="absolute left-10 top-10 opacity-10">
            <svg
              width="80"
              height="80"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z"
                fill="white"
              />
            </svg>
          </div>
        </motion.div>

        {/* Right column - Registration form */}
        <motion.div
          className="lg:w-7/12 bg-white p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FaUserPlus className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Join thousands of teams already using TaskMaster
              </p>
            </div>

            <RegisterForm />

            <div className="mt-8 pt-5 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Sign in instead
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <FaShieldAlt className="text-gray-400" size={14} />
              <p>
                By signing up, you agree to our{" "}
                <Link
                  to="/terms"
                  className="text-gray-600 hover:text-indigo-500 underline transition-colors"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-indigo-500 underline transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="mt-6 text-center text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link to="/" className="hover:text-indigo-500 transition-colors">
          ← Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

export default RegistrationPage;
