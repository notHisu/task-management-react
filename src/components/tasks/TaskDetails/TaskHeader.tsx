import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  FaExclamationTriangle,
  FaFlag,
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaRegCircle,
  FaEdit,
  FaTrash,
  FaKeyboard,
} from "react-icons/fa";
import { Task } from "../../../types/Task";

interface TaskHeaderProps {
  task: Task;
  onBack: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onToggleCompletion: (taskId: number) => void;
}

export function TaskHeader({
  task,
  onBack,
  onEdit,
  onDelete,
  onToggleCompletion,
}: TaskHeaderProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Format the creation date if available
  const createdAt = task.createdAt
    ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
    : null;

  // Priority indicator color
  const getPriorityColor = () => {
    switch (task.priority) {
      case "HIGH":
        return "text-red-500";
      case "LOW":
        return "text-green-500";
      default:
        return "text-blue-500";
    }
  };

  // Priority icon
  const getPriorityIcon = () => {
    switch (task.priority) {
      case "HIGH":
        return <FaExclamationTriangle className={`${getPriorityColor()}`} />;
      case "LOW":
        return <FaFlag className={`${getPriorityColor()}`} />;
      default:
        return <FaFlag className={`${getPriorityColor()}`} />;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-6">
      {/* Left section: Back button and task title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative">
          <button
            onClick={onBack}
            onMouseEnter={() => setShowTooltip("back")}
            onMouseLeave={() => setShowTooltip(null)}
            aria-label="Go back"
            className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <AnimatePresence>
            {showTooltip === "back" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10"
              >
                Back to tasks (Esc)
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            {/* Priority indicator */}
            <span
              className="flex-shrink-0"
              title={`Priority: ${task.priority || "NORMAL"}`}
            >
              {getPriorityIcon()}
            </span>

            {/* Task title with truncation */}
            <h1 className="text-xl sm:text-2xl font-bold truncate">
              {task.title}
            </h1>
          </div>

          {/* Metadata row */}
          <div className="flex items-center text-xs text-gray-500 mt-1">
            {createdAt && (
              <span className="flex items-center mr-3">
                <FaCalendarAlt className="mr-1" size={10} />
                Created {createdAt}
              </span>
            )}
            {task.dueDate && (
              <span
                className={`flex items-center ${
                  new Date(task.dueDate) < new Date() ? "text-red-500" : ""
                }`}
              >
                <FaCalendarAlt className="mr-1" size={10} />
                Due{" "}
                {formatDistanceToNow(new Date(task.dueDate), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Action buttons */}
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        {/* Completion toggle with enhanced visual feedback */}
        <div className="relative">
          <motion.button
            onClick={() => onToggleCompletion(task.id!)}
            onMouseEnter={() => setShowTooltip("toggle")}
            onMouseLeave={() => setShowTooltip(null)}
            aria-label={
              task.isCompleted ? "Mark as incomplete" : "Mark as complete"
            }
            className={`p-2 rounded-full transition-colors ${
              task.isCompleted
                ? "bg-green-100 hover:bg-green-200 text-green-700"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {task.isCompleted ? (
              <FaCheckCircle className="w-5 h-5" />
            ) : (
              <FaRegCircle className="w-5 h-5" />
            )}
          </motion.button>

          <AnimatePresence>
            {showTooltip === "toggle" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10"
              >
                {task.isCompleted
                  ? "Mark as incomplete (Space)"
                  : "Mark as complete (Space)"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Edit button with tooltip */}
        {onEdit && (
          <div className="relative">
            <motion.button
              onClick={() => onEdit(task)}
              onMouseEnter={() => setShowTooltip("edit")}
              onMouseLeave={() => setShowTooltip(null)}
              aria-label="Edit task"
              className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-2 rounded-full transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <FaEdit className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {showTooltip === "edit" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10"
                >
                  Edit task (E)
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Delete button with tooltip */}
        {onDelete && (
          <div className="relative">
            <motion.button
              onClick={() => onDelete(task)}
              onMouseEnter={() => setShowTooltip("delete")}
              onMouseLeave={() => setShowTooltip(null)}
              aria-label="Delete task"
              className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-full transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <FaTrash className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {showTooltip === "delete" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10"
                >
                  Delete task (Del)
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Keyboard shortcuts hint */}
        <div className="relative hidden sm:block">
          <motion.button
            onMouseEnter={() => setShowTooltip("keyboard")}
            onMouseLeave={() => setShowTooltip(null)}
            aria-label="Keyboard shortcuts"
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaKeyboard className="w-4 h-4" />
          </motion.button>

          <AnimatePresence>
            {showTooltip === "keyboard" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 mt-2 p-3 bg-gray-800 text-white text-xs rounded z-10 min-w-[180px]"
              >
                <div className="font-medium mb-1">Keyboard Shortcuts:</div>
                <div className="grid gap-1">
                  <div className="flex justify-between">
                    <span>Edit</span>
                    <kbd className="px-1 bg-gray-700 rounded">E</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Toggle Complete</span>
                    <kbd className="px-1 bg-gray-700 rounded">Space</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Back</span>
                    <kbd className="px-1 bg-gray-700 rounded">Esc</kbd>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
