import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "../../types/Task";
import { Label } from "../../types/Label";
import { Category } from "../../types/Category";
import { TaskComments } from "../comments/TaskComments";
import { ErrorState } from "../ui/ErrorState";
import apiClient from "../../services/api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { TaskDetailSkeleton } from "./TaskDetailSkeleton";
import { useTaskLabelsByTaskId } from "../../hooks/useTaskLabels";
import { TaskAttachments } from "./TaskAttachments";
import { TaskHeader } from "./TaskHeader";
import { TaskMetadata } from "./TaskMetadata";
import { TaskContent } from "./TaskContent";
import { TaskLabels } from "./TaskLabels";
import { TaskNavigation } from "./TaskNavigation";

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
  onToggleCompletion,
  labels,
  categories,
}: TaskDetailProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [previousTaskExists, setPreviousTaskExists] = useState(taskId > 1);
  const [nextTaskExists, setNextTaskExists] = useState(true);

  // Fetch task details
  const {
    data: task,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await apiClient.get<Task>(`/api/Task/${taskId}`);
      return response.data;
    },
  });

  const { data: taskLabels } = useTaskLabelsByTaskId(taskId);

  // Check if adjacent tasks exist
  useEffect(() => {
    // Previous task check is simple - just verify ID is > 1
    setPreviousTaskExists(taskId > 1);

    // For next task, we can make a lightweight HEAD request to check existence
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

  // Handle back button click
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleToggleCompletion = (id: number) => {
    if (onToggleCompletion) {
      onToggleCompletion(id);
      // Invalidate the query to force refetch
      queryClient.invalidateQueries({ queryKey: ["task", id] });
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
        onRetry={() => queryClient.invalidateQueries({ queryKey: ["task", taskId] })}
      />
    );
  }

  // Convert taskLabels to the expected format for the TaskLabels component
  const formattedTaskLabels = taskLabels?.map(tl => ({
    taskId: tl.taskId || taskId, 
    labelId: tl.labelId || 0
  })) || [];

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6">
      {/* Task Header with Title and Action Buttons */}
      <TaskHeader 
        task={task} 
        onBack={handleBack}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleCompletion={handleToggleCompletion}
      />

      {/* Task Metadata - Dates and Category */}
      <TaskMetadata task={task} categories={categories} />

      {/* Task Labels */}
      <TaskLabels 
        taskId={taskId} 
        taskLabels={formattedTaskLabels} 
        allLabels={labels}
      />

      {/* Task Description */}
      <TaskContent task={task} />

      {/* Task Attachments - if applicable */}
      <TaskAttachments taskId={taskId} />

      {/* Task Comments */}
      <TaskComments taskId={taskId} />

      {/* Navigation to Previous/Next Tasks */}
      <TaskNavigation 
        taskId={taskId}
        previousTaskExists={previousTaskExists}
        nextTaskExists={nextTaskExists}
      />
    </div>
  );
}
