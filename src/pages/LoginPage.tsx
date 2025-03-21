import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoginForm from "../components/common/FormElements/LoginForm";
import { FaLock, FaUserCircle } from "react-icons/fa";

function LoginPage() {
  // Track which section to highlight with animation
  const [focusedSection, setFocusedSection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Logo and branding */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <FaUserCircle className="h-10 w-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue to TaskMaster
          </p>
        </div>

        {/* Main card with form */}
        <motion.div
          className="bg-white shadow-xl rounded-xl overflow-hidden"
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Form tab */}
          <motion.div
            className="p-8"
            onFocus={() => setFocusedSection("form")}
            animate={{
              backgroundColor:
                focusedSection === "form" ? "#f9fafb" : "#ffffff",
            }}
            transition={{ duration: 0.3 }}
          >
            <LoginForm />
          </motion.div>

          {/* Alternative options */}
          <div className="bg-gray-50 px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <motion.div
                onFocus={() => setFocusedSection("forgot")}
                whileHover={{ scale: 1.02 }}
              >
                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1.5"
                >
                  <FaLock className="h-3 w-3" />
                  <span>Forgot password?</span>
                </Link>
              </motion.div>

              <motion.div
                onFocus={() => setFocusedSection("register")}
                whileHover={{ scale: 1.02 }}
              >
                <Link
                  to="/register"
                  className="font-medium text-sm bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  Create account
                </Link>
              </motion.div>
            </div>

            {/* Demo account shortcut */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <button
                className="w-full text-center text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                onClick={() => {
                  // Here you would implement demo account login logic
                  console.log("Demo account login");
                }}
              >
                Try a demo account
              </button>
            </div>
          </div>
        </motion.div>

        {/* Legal links */}
        <div className="text-center text-xs text-gray-500 flex items-center justify-center space-x-3">
          <Link
            to="/privacy"
            className="hover:text-indigo-500 transition-colors"
          >
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-indigo-500 transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link to="/help" className="hover:text-indigo-500 transition-colors">
            Help
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
