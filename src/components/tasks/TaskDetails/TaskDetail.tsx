import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { useTaskLabelsByTaskId } from "../../../hooks/useTaskLabels";
import { useTaskById, useTaskToggleCompletion } from "../../../hooks/useTasks";
import { Category } from "../../../types/Category";
import { Label } from "../../../types/Label";
import { Task } from "../../../types/Task";
import { ErrorState } from "../../ui/ErrorState";
import { TaskDetailSkeleton } from "./TaskDetailSkeleton";
import { TaskHeader } from "./TaskHeader";
import { TaskNavigation } from "./TaskNavigation";
import { TaskSidebar } from "./TaskSidebar";
import { TaskStatusNotification } from "./TaskStatusNotification";
import { TaskTabContent } from "./TaskTabContent";
import { TaskTabs } from "./TaskTabs";

interface TaskDetailProps {
  taskId: number;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onBack?: () => void;
  onToggleCompletion?: (taskId: number) => void;
  labels?: Label[];
  categories?: Category[];
}

export function TaskDetail({
  taskId,
  onEdit,
  onDelete,
  onBack,
  labels,
  categories,
}: TaskDetailProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [previousTaskExists, setPreviousTaskExists] = useState(taskId > 1);
  const [nextTaskExists, setNextTaskExists] = useState(true);
  const [selectedTab, setSelectedTab] = useState<
    "details" | "attachments" | "comments"
  >("details");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const { data: task, isLoading, isError } = useTaskById(taskId);
  const { data: taskLabels } = useTaskLabelsByTaskId(taskId);

  // Check if adjacent tasks exist
  useEffect(() => {
    setPreviousTaskExists(taskId > 1);

    const checkNextTask = async () => {
      try {
        // await apiClient.head(`/api/Task/${taskId + 1}`);
        setNextTaskExists(true);
      } catch (error) {
        setNextTaskExists(false);
      }
    };

    if (task) {
      checkNextTask();
    }
  }, [taskId, task]);

  // Add keyboard shortcuts
  useHotkeys(
    "left",
    () => {
      if (previousTaskExists) {
        navigate(`/tasks/${taskId - 1}`);
      }
    },
    [previousTaskExists, taskId]
  );

  useHotkeys(
    "right",
    () => {
      if (nextTaskExists) {
        navigate(`/tasks/${taskId + 1}`);
      }
    },
    [nextTaskExists, taskId]
  );

  useHotkeys(
    "e",
    () => {
      if (onEdit && task) {
        onEdit(task);
      }
    },
    [onEdit, task]
  );

  useHotkeys("1", () => setSelectedTab("details"), []);
  useHotkeys("2", () => setSelectedTab("attachments"), []);
  useHotkeys("3", () => setSelectedTab("comments"), []);

  // Handle back button click
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const toggleCompletion = useTaskToggleCompletion();

  const handleToggleCompletion = async (id: number) => {
    try {
      await toggleCompletion.mutateAsync(id);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    } catch (error) {
      console.error("Failed to toggle completion:", error);
    }
  };

  // Show loading state
  if (isLoading) {
    return <TaskDetailSkeleton />;
  }

  // Show error state
  if (isError || !task) {
    return (
      <ErrorState
        title="Error loading task"
        message="We couldn't load the task details. Please try again later."
        onRetry={() =>
          queryClient.invalidateQueries({ queryKey: ["task", taskId] })
        }
      />
    );
  }

  // Convert taskLabels to the expected format for the TaskLabels component
  const formattedTaskLabels =
    taskLabels?.map((tl) => ({
      taskId: tl.taskId || taskId,
      labelId: tl.labelId || 0,
    })) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden"
    >
      {/* Sticky header/toolbar */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <TaskHeader
          task={task}
          onBack={handleBack}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleCompletion={handleToggleCompletion}
        />
      </div>

      {/* Status/completion notification */}
      <AnimatePresence>
        {showSuccessToast && (
          <TaskStatusNotification
            isCompleted={task.isCompleted!}
            show={showSuccessToast}
          />
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab navigation */}
            <TaskTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

            {/* Tab content */}
            <TaskTabContent
              selectedTab={selectedTab}
              task={task}
              taskId={taskId}
            />
          </div>

          {/* Sidebar */}
          <TaskSidebar
            task={task}
            taskId={taskId}
            taskLabels={formattedTaskLabels}
            categories={categories}
            labels={labels}
          />
        </div>
      </div>

      {/* Task navigation footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
        <TaskNavigation
          taskId={taskId}
          previousTaskExists={previousTaskExists}
          nextTaskExists={nextTaskExists}
        />
      </div>
    </motion.div>
  );
}
