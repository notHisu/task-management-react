import { Task } from "../../types/Task";
import { Label } from "../../types/Label";
import { Category } from "../../types/Category";
import {
  FaCalendarAlt,
  FaFolder,
  FaTags,
  FaCheckCircle,
  FaRegCircle,
} from "react-icons/fa";

interface TaskItemProps {
  task: Task;
  labels?: Label[];
  categories?: Category[]; // Add categories prop
  onToggleComplete: (taskId: number) => void;
}

export function TaskItem({
  task,
  labels,
  categories,
  onToggleComplete,
}: TaskItemProps) {
  // Find category name based on categoryId
  const getCategoryName = (): string => {
    if (!categories) return "Uncategorized";

    const category = categories.find((cat) => cat.id === task.categoryId);
    return category?.name || "Uncategorized";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id!);
            }}
            className="text-gray-400 hover:text-indigo-600 transition-colors"
          >
            {task.isCompleted ? (
              <FaCheckCircle className="h-5 w-5 text-indigo-600" />
            ) : (
              <FaRegCircle className="h-5 w-5" />
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
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <FaCalendarAlt className="text-gray-400" />
          {formatDate(task.createdAt)}
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-600 ml-7">{task.description}</div>

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
                {task.taskLabels?.map((tl) => {
                  const label = labels?.find((l) => l.id === tl.labelId);
                  if (!label) return null;

                  return (
                    <span
                      key={label.id}
                      className={`px-2 py-0.5 text-xs rounded ${getLabelColorClass(
                        label.id!
                      )}`}
                    >
                      {label.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
