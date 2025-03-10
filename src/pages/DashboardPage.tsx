import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store";

function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    if (!user) return;
    await logout();

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="md:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } md:block md:w-64 bg-white shadow-md h-screen fixed`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Task Management
            </h2>
          </div>
          <nav className="mt-6">
            <div className="px-4 py-2 text-gray-500 text-sm">Main</div>
            <a
              href="#"
              className="block py-2.5 px-4 rounded transition bg-indigo-50 text-indigo-700"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block py-2.5 px-4 rounded transition hover:bg-gray-50 text-gray-600"
            >
              Projects
            </a>
            <a
              href="#"
              className="block py-2.5 px-4 rounded transition hover:bg-gray-50 text-gray-600"
            >
              Tasks
            </a>
            <div className="px-4 py-2 mt-6 text-gray-500 text-sm">Settings</div>
            <a
              href="#"
              className="block py-2.5 px-4 rounded transition hover:bg-gray-50 text-gray-600"
            >
              Profile
            </a>
            <a
              href="#"
              onClick={handleLogout}
              className="block py-2.5 px-4 rounded transition hover:bg-gray-50 text-gray-600"
            >
              Logout
            </a>
          </nav>
        </div>

        <div className="flex-1 md:ml-64 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <span className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white">
                U
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Users
                </h3>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  14% ↑
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">2,453</p>
              <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm font-medium">
                  New Projects
                </h3>
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  3% ↓
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">176</p>
              <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm font-medium">
                  Completed Tasks
                </h3>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  8% ↑
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">856</p>
              <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm">JD</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      John Doe completed Task #45
                    </p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-sm">AS</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Anna Smith created a new project
                    </p>
                    <p className="text-sm text-gray-500">5 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
