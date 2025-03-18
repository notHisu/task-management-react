import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useCategories } from "../hooks/useCategories";
import { useLabels } from "../hooks/useLabels";
import { TaskForm } from "../components/tasks/TaskForm";
import { Modal } from "../components/common/Modal";
import { useTaskWithLabelsCreate } from "../hooks/useTaskWithLabelsCreate";
import {
  FaPlus,
  FaTasks,
  FaCalendarAlt,
  FaInbox,
  FaChartBar,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { TaskFormData } from "../schemas/taskSchema";
import { useAuthStore } from "../store/store";
import { LoadingState } from "../components/ui/LoadingState";
import { getTimeSince } from "../utils/utils";

function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get authenticated user
  const { user } = useAuthStore();

  // Fetch data using React Query hooks
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: categories } = useCategories();
  const { data: labels } = useLabels();
  const taskWithLabelsCreateMutation = useTaskWithLabelsCreate();

  // Calculate task statistics
  const completedTasks = tasks?.filter((task) => task.isCompleted)?.length || 0;
  const pendingTasks = (tasks?.length || 0) - completedTasks;

  // Get tasks by category
  const tasksByCategory = categories?.map((category) => ({
    category,
    count:
      tasks?.filter((task) => task.categoryId === category.id)?.length || 0,
  }));

  // Get recent tasks (last 5)
  const recentTasks = tasks
    ?.sort(
      (a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime()
    )
    ?.slice(0, 5);

  // Create new task handler
  const handleCreateTask = (data: TaskFormData) => {
    taskWithLabelsCreateMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  if (tasksLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <FaChartBar className="text-indigo-600 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus /> Quick Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              <FaTasks className="inline mr-1" /> {tasks?.length || 0}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {tasks?.length || 0}
          </p>
          <div className="mt-4 h-2 w-full bg-gray-200 rounded">
            <div
              className="h-2 bg-indigo-500 rounded"
              style={{
                width: tasks?.length
                  ? `${(completedTasks / tasks.length) * 100}%`
                  : "0%",
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Completed: {completedTasks}</span>
            <span>Pending: {pendingTasks}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">
              Tasks by Status
            </h3>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              Completion Rate:{" "}
              {tasks?.length
                ? Math.round((completedTasks / tasks.length) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-indigo-500 mr-2"></span>
              <span className="text-sm text-gray-600">Completed</span>
              <span className="ml-auto font-medium">{completedTasks}</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
              <span className="text-sm text-gray-600">Pending</span>
              <span className="ml-auto font-medium">{pendingTasks}</span>
            </div>
          </div>
          <Link
            to="/tasks"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-4 inline-block"
          >
            View all tasks →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">
              Tasks by Category
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {categories?.length || 0} Categories
            </span>
          </div>
          <div className="mt-4 space-y-2">
            {tasksByCategory?.map(({ category, count }) => (
              <div key={category.id} className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-gray-300 mr-2"></span>
                <span className="text-sm text-gray-600">{category.name}</span>
                <span className="ml-auto font-medium">{count}</span>
              </div>
            ))}
            {!tasksByCategory?.length && (
              <p className="text-sm text-gray-500">No categories found</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          {recentTasks?.length ? (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-start">
                  <div
                    className={`h-8 w-8 rounded-full ${
                      task.isCompleted ? "bg-green-100" : "bg-amber-100"
                    } flex items-center justify-center mr-3`}
                  >
                    <span
                      className={
                        task.isCompleted ? "text-green-600" : "text-amber-600"
                      }
                      style={{ fontSize: "0.7rem" }}
                    >
                      {task.isCompleted ? "✓" : "⟳"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 flex items-center">
                      {task.title}
                      {task.isCompleted && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                          Completed
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getTimeSince(task.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent activity.</p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Link
              to="/tasks"
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center"
            >
              <FaInbox className="mr-2" />
              View all tasks
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <FaPlus /> Create New Task
            </button>
            <Link
              to="/tasks"
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <FaTasks /> Manage Tasks
            </Link>
            <button className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-md transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <FaCalendarAlt /> View Calendar
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Labels</h4>
            <div className="flex flex-wrap gap-2">
              {labels?.slice(0, 5).map((label) => (
                <span
                  key={label.id}
                  className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs"
                >
                  {label.name}
                </span>
              ))}
              {!labels?.length && (
                <p className="text-sm text-gray-500">No labels found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Quick Add Task</h2>
        <TaskForm
          onSubmit={handleCreateTask}
          isLoading={taskWithLabelsCreateMutation.isPending}
        />
      </Modal>
    </>
  );
}

export default DashboardPage;
