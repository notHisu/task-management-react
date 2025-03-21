import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaExclamationTriangle,
  FaFlag,
  FaRegCalendarCheck,
  FaRegClock,
  FaCalendarAlt,
  FaClock,
  FaFolder,
} from "react-icons/fa";
import { Category } from "../../../types/Category";
import { Task } from "../../../types/Task";
import { getTimeSince, formatDate } from "../../../utils/utils";

interface TaskMetadataProps {
  task: Task;
  categories?: Category[];
}

export function TaskMetadata({ task, categories }: TaskMetadataProps) {
  const [showFullDate, setShowFullDate] = useState<string | null>(null);

  // Get category name
  const getCategoryName = (): string => {
    if (!categories || !task?.categoryId) return "Uncategorized";
    const category = categories.find((cat) => cat.id === task.categoryId);
    return category?.name || "Uncategorized";
  };

  // Calculate due date status
  const getDueDateStatus = () => {
    if (!task.dueDate) return null;

    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate days until due
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (task.isCompleted) {
      return { status: "completed", label: "Completed" };
    } else if (diffDays < 0) {
      return {
        status: "overdue",
        label: `Overdue by ${Math.abs(diffDays)} day${
          Math.abs(diffDays) !== 1 ? "s" : ""
        }`,
      };
    } else if (diffDays === 0) {
      return { status: "today", label: "Due today" };
    } else if (diffDays === 1) {
      return { status: "upcoming", label: "Due tomorrow" };
    } else if (diffDays <= 7) {
      return { status: "upcoming", label: `Due in ${diffDays} days` };
    } else {
      return { status: "future", label: `Due in ${diffDays} days` };
    }
  };

  const dueDateStatus = getDueDateStatus();

  // Priority icon and color
  const getPriorityInfo = () => {
    switch (task.priority) {
      case "HIGH":
        return {
          icon: <FaExclamationTriangle />,
          color: "text-red-500",
          bg: "bg-red-50",
          label: "High Priority",
        };
      case "LOW":
        return {
          icon: <FaFlag />,
          color: "text-green-500",
          bg: "bg-green-50",
          label: "Low Priority",
        };
      default:
        return {
          icon: <FaFlag />,
          color: "text-blue-500",
          bg: "bg-blue-50",
          label: "Normal Priority",
        };
    }
  };

  const priorityInfo = getPriorityInfo();

  return (
    <div className="space-y-3 text-sm">
      {/* Due date with status */}
      {task.dueDate && dueDateStatus && (
        <motion.div
          className={`flex items-center rounded-md px-3 py-2 ${
            dueDateStatus.status === "overdue"
              ? "bg-red-50 text-red-700"
              : dueDateStatus.status === "today"
              ? "bg-amber-50 text-amber-700"
              : dueDateStatus.status === "upcoming"
              ? "bg-blue-50 text-blue-700"
              : dueDateStatus.status === "completed"
              ? "bg-green-50 text-green-700"
              : "bg-gray-50 text-gray-700"
          }`}
          whileHover={{ scale: 1.02 }}
          onMouseEnter={() => setShowFullDate("due")}
          onMouseLeave={() => setShowFullDate(null)}
        >
          {dueDateStatus.status === "completed" ? (
            <FaRegCalendarCheck className="w-4 h-4 mr-3" />
          ) : (
            <FaRegClock className="w-4 h-4 mr-3" />
          )}
          <div className="flex flex-col">
            <span className="font-medium">{dueDateStatus.label}</span>
            <span className="text-xs opacity-80">
              {formatDate(task.dueDate)}
              {showFullDate === "due" && (
                <span className="ml-1 opacity-70">
                  {new Date(task.dueDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </span>
          </div>
        </motion.div>
      )}

      {/* Priority badge */}
      {task.priority && (
        <motion.div
          className={`flex items-center rounded-md px-3 py-2 ${priorityInfo.bg}`}
          whileHover={{ scale: 1.02 }}
        >
          <span className={`${priorityInfo.color} mr-3`}>
            {priorityInfo.icon}
          </span>
          <span className="font-medium">{priorityInfo.label}</span>
        </motion.div>
      )}

      {/* Metadata grid for dates and category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
        {/* Created date */}
        <motion.div
          className="flex items-start p-2 bg-gray-50 rounded-md"
          whileHover={{ backgroundColor: "#f3f4f6" }}
          onMouseEnter={() => setShowFullDate("created")}
          onMouseLeave={() => setShowFullDate(null)}
        >
          <FaCalendarAlt className="w-3.5 h-3.5 mt-0.5 mr-2 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-gray-700">Created</span>
            <span className="text-xs text-gray-600">
              {formatDate(task.createdAt || "")}
              {showFullDate === "created" && task.createdAt && (
                <span className="ml-1 text-gray-500">
                  {new Date(task.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </span>
          </div>
        </motion.div>

        {/* Updated timestamp */}
        <motion.div
          className="flex items-start p-2 bg-gray-50 rounded-md"
          whileHover={{ backgroundColor: "#f3f4f6" }}
        >
          <FaClock className="w-3.5 h-3.5 mt-0.5 mr-2 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-gray-700">Updated</span>
            <span className="text-xs text-gray-600">
              {getTimeSince(task.createdAt || "")}
            </span>
          </div>
        </motion.div>

        {/* Category */}
        <motion.div
          className="flex items-start p-2 bg-gray-50 rounded-md sm:col-span-2"
          whileHover={{ backgroundColor: "#f3f4f6" }}
        >
          <FaFolder className="w-3.5 h-3.5 mt-0.5 mr-2 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-gray-700">Category</span>
            <span className="text-xs font-medium text-indigo-600">
              {getCategoryName()}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Completion timeline if task is completed */}
      {task.isCompleted && task.dueDate && (
        <div className="pt-2 mt-2 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <div className="relative flex items-center flex-1">
              <div className="h-0.5 bg-green-500 absolute left-0 right-0"></div>
              <div className="h-2 w-2 rounded-full bg-green-500 absolute left-0"></div>
              <div className="h-2 w-2 rounded-full bg-green-500 absolute right-0"></div>
            </div>
            <span className="ml-2 text-green-600 font-medium">
              Completed on time
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
