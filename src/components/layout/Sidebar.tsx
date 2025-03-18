import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/store";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaTasks,
  FaChartBar,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaRegLightbulb,
  FaCalendarAlt,
  FaPlus,
  FaBars,
  FaQuestionCircle,
  FaTag,
  FaFolder,
  FaTimes,
} from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [menuSections, setMenuSections] = useState({
    tasks: true,
    settings: false,
  });

  const currentPath = location.pathname;

  // Reset menu expansion state when route changes (mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      onToggle && !isOpen && onToggle();
    }
  }, [currentPath]);

  const handleLogout = async () => {
    if (!user) return;
    await logout();
    navigate("/login");
  };

  const toggleSection = (section: string) => {
    setMenuSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (path: string) => {
    if (path === "/tasks" && currentPath.startsWith("/tasks/")) {
      return true;
    }
    return currentPath === path;
  };

  const getLinkClass = (path: string) => {
    const baseClasses = `flex items-center py-2.5 px-4 rounded-md transition-all duration-200 ${
      collapsed ? "justify-center" : ""
    }`;

    if (isActive(path)) {
      return `${baseClasses} bg-indigo-50 text-indigo-700 font-medium`;
    }

    return `${baseClasses} text-gray-600 hover:bg-gray-50 hover:text-gray-900`;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar container */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-30 ${
          collapsed ? "md:w-20" : "md:w-64"
        } w-64 flex flex-col`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
          {!collapsed && (
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaTasks className="text-indigo-600 mr-2" />
              <span className="truncate">TaskMaster</span>
            </h2>
          )}
          {collapsed && <FaTasks className="text-indigo-600 mx-auto text-xl" />}

          {/* Mobile close button */}
          <button
            onClick={onToggle}
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-1"
          >
            <FaTimes className="h-5 w-5" />
          </button>

          {/* Collapse toggle button - desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-1"
          >
            {collapsed ? (
              <FaChevronRight size={16} />
            ) : (
              <FaChevronLeft size={16} />
            )}
          </button>
        </div>

        {/* User profile section */}
        {user && (
          <div
            className={`px-4 py-4 border-b border-gray-100 ${
              collapsed ? "flex justify-center" : ""
            }`}
          >
            {collapsed ? (
              <div className="bg-indigo-100 rounded-full h-10 w-10 flex items-center justify-center text-indigo-700 font-bold">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
            ) : (
              <div className="flex items-center">
                <div className="bg-indigo-100 rounded-full h-10 w-10 flex items-center justify-center text-indigo-700 font-bold">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">Logged in</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick actions bar */}
        <div
          className={`px-4 py-2 flex ${
            collapsed ? "flex-col items-center space-y-4" : "justify-around"
          } border-b border-gray-100`}
        >
          <button
            onClick={() => navigate("/tasks/new")}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="New Task"
          >
            <FaPlus size={16} />
          </button>

          <button
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="Search"
            onClick={() => document.getElementById("task-search")?.focus()}
          >
            <FaSearch size={16} />
          </button>

          <button
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="View Calendar"
          >
            <FaCalendarAlt size={16} />
          </button>
        </div>

        {/* Scrollable navigation area */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          {/* Main Navigation */}
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Navigation
              </div>
            )}

            <Link
              to="/dashboard"
              className={getLinkClass("/dashboard")}
              title="Dashboard"
            >
              <FaChartBar
                className={`text-gray-400 ${
                  collapsed ? "mx-auto text-lg" : "mr-3"
                }`}
              />
              {!collapsed && <span>Dashboard</span>}
            </Link>

            {/* Expandable tasks section */}
            <div className="space-y-1">
              <Link
                to="/tasks"
                className={getLinkClass("/tasks")}
                title="Tasks"
              >
                <FaTasks
                  className={`text-gray-400 ${
                    collapsed ? "mx-auto text-lg" : "mr-3"
                  }`}
                />
                {!collapsed && <span>Tasks</span>}
              </Link>

              {!collapsed && menuSections.tasks && (
                <div className="ml-8 space-y-1 mt-1">
                  <Link
                    to="/tasks?status=pending"
                    className={`flex items-center py-2 px-3 text-sm rounded-md ${
                      currentPath === "/tasks?status=pending"
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Pending
                  </Link>
                  <Link
                    to="/tasks?status=completed"
                    className={`flex items-center py-2 px-3 text-sm rounded-md ${
                      currentPath === "/tasks?status=completed"
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Completed
                  </Link>
                </div>
              )}
            </div>

            {!collapsed && (
              <>
                <Link
                  to="/categories"
                  className={`${getLinkClass("/categories")}`}
                  title="Categories"
                >
                  <FaFolder className="mr-3 text-gray-400" />
                  Categories
                </Link>
                <Link
                  to="/labels"
                  className={`${getLinkClass("/labels")}`}
                  title="Labels"
                >
                  <FaTag className="mr-3 text-gray-400" />
                  Labels
                </Link>
              </>
            )}
          </div>

          {/* Settings Navigation */}
          <div className="mt-8 space-y-1">
            {!collapsed && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Settings
              </div>
            )}
            <Link
              to="/profile"
              className={getLinkClass("/profile")}
              title="Profile"
            >
              <FaUserCircle
                className={`text-gray-400 ${
                  collapsed ? "mx-auto text-lg" : "mr-3"
                }`}
              />
              {!collapsed && <span>Profile</span>}
            </Link>

            <Link
              to="/settings"
              className={getLinkClass("/settings")}
              title="Settings"
            >
              <FaCog
                className={`text-gray-400 ${
                  collapsed ? "mx-auto text-lg" : "mr-3"
                }`}
              />
              {!collapsed && <span>Settings</span>}
            </Link>

            <Link to="/help" className={getLinkClass("/help")} title="Help">
              <FaQuestionCircle
                className={`text-gray-400 ${
                  collapsed ? "mx-auto text-lg" : "mr-3"
                }`}
              />
              {!collapsed && <span>Help</span>}
            </Link>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center py-2.5 px-4 rounded-md text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors mt-2 ${
                collapsed ? "justify-center" : ""
              }`}
              title="Logout"
            >
              <FaSignOutAlt
                className={`text-gray-400 ${
                  collapsed ? "mx-auto text-lg" : "mr-3"
                }`}
              />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* Bottom info section */}
        {!collapsed && (
          <div className="border-t border-gray-100 p-4">
            <div className="bg-gray-50 rounded-md p-3">
              <div className="flex items-center text-gray-700">
                <FaRegLightbulb className="text-amber-500 mr-2" />
                <span className="text-sm font-medium">Pro Tip</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Use keyboard shortcuts! Press{" "}
                <kbd className="px-1.5 py-0.5 border border-gray-300 rounded text-xs bg-gray-50">
                  Ctrl+/
                </kbd>{" "}
                to see all shortcuts.
              </p>
            </div>
          </div>
        )}

        {/* App version */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-center">
          <div className="text-xs text-gray-400 flex items-center">
            <FaCog className={`${collapsed ? "" : "mr-1"} animate-spin-slow`} />
            {!collapsed && <span>v1.0.0</span>}
          </div>
        </div>
      </div>
    </>
  );
}
