import { Category } from "../../../types/Category";
import { Label } from "../../../types/Label";
import { Task } from "../../../types/Task";
import { KeyboardShortcutsCard } from "./KeyboardShortcutsCard";
import { TaskLabels } from "./TaskLabels";
import { TaskMetadata } from "./TaskMetadata";

interface TaskSidebarProps {
  task: Task;
  taskId: number;
  taskLabels: { taskId: number; labelId: number }[];
  categories?: Category[];
  labels?: Label[];
}

export function TaskSidebar({
  task,
  taskId,
  taskLabels,
  categories,
  labels,
}: TaskSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Task status card */}
      <div
        className={`rounded-lg p-4 border ${
          task.isCompleted
            ? "bg-green-50 border-green-200"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <div className="text-sm font-medium mb-2">
          Status:{" "}
          <span
            className={task.isCompleted ? "text-green-700" : "text-blue-700"}
          >
            {task.isCompleted ? "Completed" : "In Progress"}
          </span>
        </div>
        <TaskMetadata task={task} categories={categories} />
      </div>

      {/* Task labels card */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <TaskLabels
          taskId={taskId}
          taskLabels={taskLabels}
          allLabels={labels}
        />
      </div>

      {/* Keyboard shortcuts reference */}
      <KeyboardShortcutsCard />
    </div>
  );
}
