import { AnimatePresence, motion } from "framer-motion";
import { Task } from "../../../types/Task";
import { TaskComments } from "../../comments/TaskComments";
import { TaskAttachments } from "./TaskAttachments";
import { TaskContent } from "./TaskContent";

type TabKey = "details" | "attachments" | "comments";

interface TaskTabContentProps {
  selectedTab: TabKey;
  task: Task;
  taskId: number;
}

export function TaskTabContent({
  selectedTab,
  task,
  taskId,
}: TaskTabContentProps) {
  return (
    <AnimatePresence mode="wait">
      {selectedTab === "details" && (
        <motion.div
          key="details"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <TaskContent task={task} />
        </motion.div>
      )}

      {selectedTab === "attachments" && (
        <motion.div
          key="attachments"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <TaskAttachments taskId={taskId} />
        </motion.div>
      )}

      {selectedTab === "comments" && (
        <motion.div
          key="comments"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <TaskComments taskId={taskId} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
