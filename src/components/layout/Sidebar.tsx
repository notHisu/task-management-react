import { useAuthStore } from "../../store/store";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaTasks,
  FaChartBar,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const currentPath = location.pathname;

  const handleLogout = async () => {
    if (!user) return;
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const getLinkClass = (path: string) => {
    return `flex items-center py-2.5 px-4 rounded transition ${
      isActive(path)
        ? "bg-indigo-50 text-indigo-700"
        : "hover:bg-gray-50 text-gray-600"
    }`;
  };

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } md:block md:w-64 bg-white shadow-md h-screen fixed`}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
      </div>

      {/* User profile section */}
      {user && (
        <div className="px-6 py-4 border-t border-b border-gray-100">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-full h-10 w-10 flex items-center justify-center text-indigo-700 font-bold">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.email}</p>
              <p className="text-xs text-gray-500">Logged in</p>
            </div>
          </div>
        </div>
      )}

      <nav className="mt-6">
        <div className="px-4 py-2 text-gray-500 text-sm">Main</div>
        <Link to="/dashboard" className={getLinkClass("/dashboard")}>
          <FaChartBar className="mr-3 text-gray-400" />
          Dashboard
        </Link>
        <Link to="/tasks" className={getLinkClass("/tasks")}>
          <FaTasks className="mr-3 text-gray-400" />
          Tasks
        </Link>
        <div className="px-4 py-2 mt-6 text-gray-500 text-sm">Settings</div>
        <Link to="/profile" className={getLinkClass("/profile")}>
          <FaUserCircle className="mr-3 text-gray-400" />
          Profile
        </Link>
        <a
          href="#"
          onClick={handleLogout}
          className="flex items-center py-2.5 px-4 rounded transition hover:bg-gray-50 text-gray-600"
        >
          <FaSignOutAlt className="mr-3 text-gray-400" />
          Logout
        </a>
      </nav>

      {/* App version at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="text-xs text-gray-400 flex items-center">
          <FaCog className="mr-1" />
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
