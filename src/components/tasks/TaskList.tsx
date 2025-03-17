import { Task } from "../../types/Task";
import { Label } from "../../types/Label";
import { Category } from "../../types/Category";
import { LoadingState } from "../ui/LoadingState";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  labels?: Label[];
  categories?: Category[];
  isLoading: boolean;
  isError: boolean;
  onToggleComplete: (taskId: number) => void;
  onClearFilters?: () => void;
}

export function TaskList({
  tasks,
  labels,
  categories,
  isLoading,
  isError,
  onToggleComplete,
  onClearFilters,
}: TaskListProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState />;
  }

  if (tasks.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          labels={labels}
          categories={categories}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
