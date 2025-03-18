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
  onCreateTask?: () => void;
  onEditClick: (task: Task) => void;
  onDeleteClick: (task: Task) => void;
  hasActiveFilters?: boolean;
  allTasksCount?: number;
}

export function TaskList({
  tasks,
  labels,
  categories,
  isLoading,
  isError,
  onToggleComplete,
  onClearFilters,
  onCreateTask,
  onEditClick,
  onDeleteClick,
  hasActiveFilters = false,
  allTasksCount = 0,
}: TaskListProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState />;
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        onClearFilters={onClearFilters}
        onCreateTask={onCreateTask}
        hasActiveFilters={hasActiveFilters}
        noTasksAtAll={allTasksCount === 0}
      />
    );
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
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
}
