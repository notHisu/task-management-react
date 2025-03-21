import { motion } from "framer-motion";
import { FaCheck, FaInfoCircle } from "react-icons/fa";

interface TaskStatusNotificationProps {
  isCompleted: boolean;
  show: boolean;
}

export function TaskStatusNotification({
  isCompleted,
  show,
}: TaskStatusNotificationProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`mx-6 mt-2 p-2 rounded-md flex items-center ${
        isCompleted
          ? "bg-green-50 text-green-800 border border-green-200"
          : "bg-blue-50 text-blue-800 border border-blue-200"
      }`}
    >
      <div className="rounded-full bg-white p-1 mr-2">
        {isCompleted ? (
          <FaCheck className="text-green-500" />
        ) : (
          <FaInfoCircle className="text-blue-500" />
        )}
      </div>
      <span>Task marked as {isCompleted ? "completed" : "in progress"}</span>
    </motion.div>
  );
}
