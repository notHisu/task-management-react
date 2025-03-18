import { Task } from "../../types/Task";
import { Label } from "../../types/Label";
import { Category } from "../../types/Category";
import {
  FaCalendarAlt,
  FaFolder,
  FaTags,
  FaCheckCircle,
  FaRegCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/utils";

interface TaskItemProps {
  task: Task;
  labels?: Label[];
  categories?: Category[];
  onToggleComplete: (taskId: number) => void;
  onEditClick: (task: Task) => void;
  onDeleteClick: (task: Task) => void;
}

export function TaskItem({
  task,
  labels,
  categories,
  onToggleComplete,
  onEditClick,
  onDeleteClick,
}: TaskItemProps) {
  const navigate = useNavigate();

  // Add this handler
  const handleTaskClick = () => {
    navigate(`/tasks/${task.id}`);
  };

  // Find category name based on categoryId
  const getCategoryName = (): string => {
    if (!categories) return "Uncategorized";

    const category = categories.find((cat) => cat.id === task.categoryId);
    return category?.name || "Uncategorized";
  };

  // Map labels to color classes based on label id
  const getLabelColorClass = (labelId: number) => {
    const colorClasses: Record<number, string> = {
      1: "bg-red-100 text-red-800", // Urgent
      2: "bg-blue-100 text-blue-800", // Important
      3: "bg-green-100 text-green-800", // Home
      4: "bg-yellow-100 text-yellow-800", // Office
    };

    return colorClasses[labelId] || "bg-gray-100 text-gray-800";
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200 border-l-4 border-transparent hover:border-l-indigo-500 cursor-pointer group"
      onClick={handleTaskClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id!);
            }}
            className="relative text-gray-400 hover:text-indigo-600 transition-all duration-200 w-6 h-6 flex items-center justify-center"
          >
            {task.isCompleted ? (
              <FaCheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <>
                <FaRegCircle className="h-5 w-5" />
                <span className="absolute inset-0 bg-indigo-100 scale-0 rounded-full group-hover:scale-75 transition-transform duration-200 opacity-0 group-hover:opacity-30"></span>
              </>
            )}
          </button>
          <h3
            className={`font-medium ${
              task.isCompleted ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <FaCalendarAlt className="text-gray-400" />
            {formatDate(task.createdAt)}
          </div>

          {/* Action buttons with opacity transition */}
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(task);
              }}
              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="Edit task"
            >
              <FaEdit />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick(task);
              }}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete task"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>

      {/* Show description preview only if it exists */}
      {task.description && (
        <div className="mt-2 text-sm text-gray-600 ml-7 line-clamp-2">
          {task.description}
        </div>
      )}

      <div className="mt-3 ml-7 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category - Updated to use getCategoryName() */}
          <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-800 flex items-center gap-1">
            <FaFolder className="text-gray-400" />
            {getCategoryName()}
          </span>

          {/* Labels */}
          {task.taskLabels && task.taskLabels.length > 0 && (
            <div className="flex items-center gap-1">
              <FaTags className="text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {task.taskLabels?.slice(0, 2).map((tl) => {
                  const label = labels?.find((l) => l.id === tl.labelId);
                  if (!label) return null;

                  return (
                    <span
                      key={label.id}
                      className={`px-2 py-0.5 text-xs rounded-full flex items-center ${getLabelColorClass(
                        label.id!
                      )}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full mr-1 ${
                          label.id === 1
                            ? "bg-red-500"
                            : label.id === 2
                            ? "bg-blue-500"
                            : label.id === 3
                            ? "bg-green-500"
                            : label.id === 4
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      ></span>
                      {label.name}
                    </span>
                  );
                })}
                {task.taskLabels.length > 2 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                    +{task.taskLabels.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress indicator for completed tasks */}
        {task.isCompleted && (
          <span className="text-xs text-green-600 font-medium flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Completed
          </span>
        )}
      </div>
    </div>
  );
}
