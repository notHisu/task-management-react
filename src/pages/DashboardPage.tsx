import { useState, useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import { useCategories } from "../hooks/useCategories";
import { useLabels } from "../hooks/useLabels";
import { useTaskToggleCompletion } from "../hooks/useTasks";
import { TaskForm } from "../components/tasks/TaskForm";
import { Modal } from "../components/common/Modal";
import { useTaskWithLabelsCreate } from "../hooks/useTaskWithLabelsCreate";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaTasks,
  FaCalendarAlt,
  FaInbox,
  FaChartBar,
  FaSearch,
  FaCheck,
  FaFilter,
  FaRegLightbulb,
  FaEllipsisH,
  FaBell,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { TaskFormData } from "../schemas/taskSchema";
import { useAuthStore } from "../store/store";
import { LoadingState } from "../components/ui/LoadingState";
import { getTimeSince, processLabelColor } from "../utils/utils";

// Skeleton component for loading state
const DashboardSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
        </div>
      ))}
    </div>
  </div>
);

function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "all" | "today" | "week"
  >("all");
  const [showTaskMenu, setShowTaskMenu] = useState<number | null>(null);

  const navigate = useNavigate();

  // Get authenticated user
  const { user } = useAuthStore();

  // Fetch data using React Query hooks
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: categories } = useCategories();
  const { data: labels } = useLabels();
  const taskWithLabelsCreateMutation = useTaskWithLabelsCreate();
  const toggleCompletion = useTaskToggleCompletion();

  // Calculate task statistics
  const completedTasks = tasks?.filter((task) => task.isCompleted)?.length || 0;
  const pendingTasks = (tasks?.length || 0) - completedTasks;

  // Get tasks by category
  const tasksByCategory = categories
    ?.map((category) => ({
      category,
      count:
        tasks?.filter((task) => task.categoryId === category.id)?.length || 0,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count, highest first

  // Filter tasks by timeframe
  const getFilteredTasks = () => {
    if (!tasks) return [];

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);

    let filteredTasks = [...tasks];

    if (selectedTimeframe === "today") {
      filteredTasks = tasks.filter((task) => {
        const taskDate = new Date(task.createdAt || "");
        return taskDate >= todayStart;
      });
    } else if (selectedTimeframe === "week") {
      filteredTasks = tasks.filter((task) => {
        const taskDate = new Date(task.createdAt || "");
        return taskDate >= weekStart;
      });
    }

    return filteredTasks
      .sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      )
      .slice(0, 5); // Get most recent 5
  };

  // Get recent tasks based on selected timeframe
  const recentTasks = getFilteredTasks();

  // Create new task handler
  const handleCreateTask = (data: TaskFormData) => {
    taskWithLabelsCreateMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  // Handle toggle task completion
  const handleToggleComplete = async (taskId: number) => {
    await toggleCompletion.mutateAsync(taskId);
    setShowTaskMenu(null);
  };

  // Handle view task details
  const handleViewTask = (taskId: number) => {
    navigate(`/tasks/${taskId}`);
    setShowTaskMenu(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowTaskMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Show full skeleton while loading
  if (tasksLoading && !tasks) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      {/* Welcome header with user info */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center mb-2">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <FaChartBar className="text-indigo-600 text-xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <p className="text-gray-600">
              Welcome back, {user?.email?.split("@")[0] || "User"}
              <span className="hidden sm:inline">
                ! Here's your task overview.
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="flex items-center rounded-lg bg-gray-100 p-1 text-sm">
              <button
                className={`px-3 py-1.5 rounded-md ${
                  selectedTimeframe === "all"
                    ? "bg-white shadow-sm text-indigo-700"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedTimeframe("all")}
              >
                All time
              </button>
              <button
                className={`px-3 py-1.5 rounded-md ${
                  selectedTimeframe === "today"
                    ? "bg-white shadow-sm text-indigo-700"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedTimeframe("today")}
              >
                Today
              </button>
              <button
                className={`px-3 py-1.5 rounded-md ${
                  selectedTimeframe === "week"
                    ? "bg-white shadow-sm text-indigo-700"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedTimeframe("week")}
              >
                This week
              </button>
            </div>

            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus /> Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Stats summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-500"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
            <div className="p-1.5 bg-indigo-100 rounded-lg">
              <FaTasks className="text-indigo-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2 mb-4">
            {tasks?.length || 0}
          </p>
          <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-1.5 bg-indigo-500 rounded-full transition-all duration-500"
              style={{
                width: tasks?.length
                  ? `${Math.max(1, (completedTasks / tasks.length) * 100)}%`
                  : "0%",
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{completedTasks} completed</span>
            <span>{pendingTasks} pending</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between">
            <h3 className="text-gray-500 text-sm font-medium">
              Completion Rate
            </h3>
            <div className="p-1.5 bg-green-100 rounded-lg">
              <FaCheck className="text-green-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {tasks?.length
                ? Math.round((completedTasks / tasks.length) * 100)
                : 0}
              %
            </p>
            <p className="text-sm text-gray-500 mb-1.5">of tasks complete</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm text-gray-600">Completed</span>
              <span className="ml-auto font-medium">{completedTasks}</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
              <span className="text-sm text-gray-600">Pending</span>
              <span className="ml-auto font-medium">{pendingTasks}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between">
            <h3 className="text-gray-500 text-sm font-medium">
              Top Categories
            </h3>
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <FaFilter className="text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {categories?.length || 0}
          </p>

          <div className="mt-4 space-y-2 max-h-[100px] overflow-y-auto pr-1">
            {tasksByCategory?.slice(0, 4).map(({ category, count }) => (
              <div key={category.id} className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-blue-500 opacity-80 mr-2"></span>
                <span className="text-sm text-gray-600 truncate flex-1">
                  {category.name}
                </span>
                <span className="ml-auto font-medium text-sm bg-blue-50 text-blue-700 py-0.5 px-2 rounded-full">
                  {count}
                </span>
              </div>
            ))}
            {!tasksByCategory?.length && (
              <p className="text-sm text-gray-500">No categories found</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent activity and quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Activity
              </h3>
              <div className="text-sm text-gray-500">
                {selectedTimeframe === "all"
                  ? "All time"
                  : selectedTimeframe === "today"
                  ? "Today"
                  : "This week"}
              </div>
            </div>

            {recentTasks?.length ? (
              <div>
                <ul className="divide-y divide-gray-100">
                  {recentTasks.map((task) => (
                    <motion.li
                      key={task.id}
                      className="flex items-start p-4 hover:bg-gray-50 group relative"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        onClick={() => handleToggleComplete(task.id!)}
                        className={`flex-shrink-0 h-6 w-6 mt-0.5 rounded-full ${
                          task.isCompleted
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        } flex items-center justify-center hover:bg-green-200 hover:text-green-700 transition-colors`}
                      >
                        {task.isCompleted && <FaCheck className="text-xs" />}
                      </button>

                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium ${
                              task.isCompleted
                                ? "text-gray-500 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </p>
                          <div
                            className="relative"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowTaskMenu(
                                showTaskMenu === task.id ? null : task.id!
                              );
                            }}
                          >
                            <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              <FaEllipsisH className="w-4 h-4" />
                            </button>

                            {/* Task action menu */}
                            {showTaskMenu === task.id && (
                              <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewTask(task.id!);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <div className="flex items-center">
                                      <FaSearch className="mr-2 text-gray-400" />
                                      View details
                                    </div>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleComplete(task.id!);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <div className="flex items-center">
                                      <FaCheck className="mr-2 text-gray-400" />
                                      Mark as{" "}
                                      {task.isCompleted
                                        ? "incomplete"
                                        : "complete"}
                                    </div>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>{getTimeSince(task.createdAt || "")}</span>
                          {task.priority === "HIGH" && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              High
                            </span>
                          )}
                          {task.isCompleted && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                <div className="border-t border-gray-100 p-4 text-center">
                  <Link
                    to="/tasks"
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center"
                  >
                    View all tasks <FaChevronRight className="ml-1" size={12} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                  <FaInbox className="text-indigo-400 text-xl" />
                </div>
                <p className="text-gray-500 mb-4">
                  No tasks found for this period.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <FaPlus className="mr-2 -ml-1" /> Create a task
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions column */}
        <div>
          {/* Quick actions card */}
          <motion.div
            className="bg-white rounded-lg shadow-sm mb-6"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-b border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FaPlus /> Create New Task
                </button>
                <Link
                  to="/tasks"
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <FaTasks /> Manage Tasks
                </Link>
                <Link
                  to="/tasks"
                  className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FaCalendarAlt /> View Calendar
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Tips card */}
          <motion.div
            className="bg-white rounded-lg shadow-sm"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-b border-gray-100 p-6">
              <div className="flex items-center">
                <FaRegLightbulb className="text-amber-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Pro Tips</h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <FaBell className="text-indigo-500 mt-0.5 mr-2" />
                  <span>Use labels to organize related tasks</span>
                </li>
                <li className="flex items-start">
                  <FaBell className="text-indigo-500 mt-0.5 mr-2" />
                  <span>Break down large tasks into smaller ones</span>
                </li>
                <li className="flex items-start">
                  <FaBell className="text-indigo-500 mt-0.5 mr-2" />
                  <span>Set due dates to track deadlines</span>
                </li>
              </ul>

              {labels && labels.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Your Labels
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {labels.slice(0, 5).map((label) => {
                      const { colorHex, bgColor, textColor } =
                        processLabelColor(label.color);
                      return (
                        <span
                          key={label.id}
                          className="px-2.5 py-0.5 rounded-full text-xs"
                          style={{
                            backgroundColor: bgColor,
                            color: textColor,
                          }}
                        >
                          <span style={{ backgroundColor: colorHex }}></span>
                          <span className="truncate">{label.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Task Creation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <TaskForm
          onSubmit={handleCreateTask}
          isLoading={taskWithLabelsCreateMutation.isPending}
        />
      </Modal>
    </>
  );
}

export default DashboardPage;
