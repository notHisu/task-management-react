import React from "react";
import { FaHardHat, FaTools, FaUser, FaUserCog } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4">
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <FaUser />
            User Profile
          </h1>
        </div>

        {/* Construction notice */}
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <FaHardHat className="text-amber-500 text-4xl" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Under Construction
          </h2>

          <p className="text-gray-600 mb-6 max-w-lg">
            We're currently building this page to help you manage your profile
            settings, preferences, and account information. Check back soon for
            these exciting features!
          </p>

          {/* Animated construction indicator */}
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatDelay: 1,
            }}
            className="text-amber-500 mb-8"
          >
            <FaTools className="text-5xl" />
          </motion.div>

          {/* Coming soon features */}
          <div className="border-t border-gray-200 pt-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Coming Soon:
            </h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-center text-gray-600">
                <span className="bg-indigo-100 p-1 rounded mr-3">
                  <FaUserCog className="text-indigo-600" />
                </span>
                Profile settings and preferences
              </li>
              <li className="flex items-center text-gray-600">
                <span className="bg-indigo-100 p-1 rounded mr-3">
                  <FaUser className="text-indigo-600" />
                </span>
                Custom avatars and themes
              </li>
              <li className="flex items-center text-gray-600">
                <span className="bg-indigo-100 p-1 rounded mr-3">
                  <FaTools className="text-indigo-600" />
                </span>
                Notification preferences
              </li>
            </ul>
          </div>

          {/* Return button */}
          <div className="mt-8">
            <Link
              to="/tasks"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Return to Tasks
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
