import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Task } from "../../types/Task";
import { Label } from "../../types/Label";
import { Category } from "../../types/Category";
import { TaskComments } from "../comments/TaskComments";
import { LoadingState } from "../ui/LoadingState";
import { ErrorState } from "../ui/ErrorState";
import apiClient from "../../services/api/axiosConfig";
import {
  FaCalendarAlt,
  FaFolder,
  FaTags,
  FaCheckCircle,
  FaRegCircle,
  FaEdit,
  FaTrash,
  FaClock,
  FaArrowLeft,
  FaCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { formatDate, getTimeSince } from "../../utils/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { TaskDetailSkeleton } from "./TaskDetailSkeleton";

interface TaskDetailProps {
  taskId: number;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onBack?: () => void;
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

  const [previousTaskExists, setPreviousTaskExists] = useState(taskId > 1);
  const [nextTaskExists, setNextTaskExists] = useState(true);

  // Check if adjacent tasks exist
  useEffect(() => {
    // Previous task check is simple - just verify ID is > 1
    setPreviousTaskExists(taskId > 1);

    // For next task, we can make a lightweight HEAD request to check existence
    const checkNextTask = async () => {
      try {
        await apiClient.head(`/api/Task/${taskId + 1}`);
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

  // Get category name
  const getCategoryName = (): string => {
    if (!categories || !task?.categoryId) return "Uncategorized";
    const category = categories.find((cat) => cat.id === task.categoryId);
    return category?.name || "Uncategorized";
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

  // Handle back button click
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  if (isLoading) {
    return <TaskDetailSkeleton />;
  }

  if (isError || !task) {
    return <ErrorState message="Failed to load task details" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Enhanced header with status indicator */}
      <div className="p-6 border-b border-gray-200 relative">
        {/* Status indicator strip */}
        <div
          className={`absolute inset-y-0 left-0 w-1 ${
            task.isCompleted ? "bg-green-500" : "bg-amber-500"
          }`}
        ></div>

        <div className="flex items-center mb-4">
          <button
            onClick={handleBack}
            className="mr-3 text-gray-500 hover:text-indigo-600 transition-colors p-1.5 hover:bg-gray-100 rounded-full"
            aria-label="Go back"
            title="Go back"
          >
            <FaArrowLeft />
          </button>
          <h2 className="text-xl font-bold flex-1">{task.title}</h2>
          <div className="flex items-center gap-2 text-nowrap">
            {/* Toggle completion button */}
            <Button
              onClick={() =>
                onEdit && onEdit({ ...task, isCompleted: !task.isCompleted })
              }
              className={`!py-1.5 !px-3 flex items-center gap-1 ${
                task.isCompleted
                  ? "bg-green-50 hover:bg-green-100 text-green-700"
                  : "bg-amber-50 hover:bg-amber-100 text-amber-700"
              }`}
              title={
                task.isCompleted ? "Mark as incomplete" : "Mark as complete"
              }
            >
              {task.isCompleted ? (
                <>
                  <FaCheckCircle size={14} /> Completed
                </>
              ) : (
                <>
                  <FaRegCircle size={14} /> Mark Complete
                </>
              )}
            </Button>

            {onEdit && (
              <Button
                onClick={() => onEdit(task)}
                className="!py-1.5 !px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1"
              >
                <FaEdit size={14} /> Edit
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={() => onDelete(task)}
                className="!py-1.5 !px-3 bg-red-50 hover:bg-red-100 text-red-700 flex items-center gap-1"
              >
                <FaTrash size={14} /> Delete
              </Button>
            )}
          </div>
        </div>

        {/* Created date */}
        <div className="flex items-center text-sm text-gray-500">
          <FaClock className="mr-1" />
          Created {formatDate(task.createdAt)}
          <span className="ml-1 text-gray-400">
            ({getTimeSince(task.createdAt)})
          </span>
        </div>
      </div>

      {/* Improved content layout with cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content - description */}
        <div className="md:col-span-2 space-y-6">
          {/* Description Card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <svg
                className="w-4 h-4 mr-1.5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                ></path>
              </svg>
              Description
            </h3>
            {task.description ? (
              <p className="text-gray-800 whitespace-pre-wrap">
                {task.description}
              </p>
            ) : (
              <p className="text-gray-500 italic">No description provided.</p>
            )}
          </div>

          {/* Attachments placeholder with improved design */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <svg
                className="w-4 h-4 mr-1.5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
              Attachments
            </h3>

            <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-md">
              <div className="text-center">
                <svg
                  className="mx-auto h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <p className="mt-1 text-sm text-gray-500">
                  Drag files here or{" "}
                  <span className="text-indigo-600 hover:text-indigo-800 cursor-pointer">
                    browse
                  </span>
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Attachment functionality coming soon
                </p>
              </div>
            </div>
          </div>

          {/* Comments section - make TaskComments component call go here */}
          <TaskComments taskId={taskId} />
        </div>

        {/* Sidebar - metadata */}
        <div className="space-y-4">
          {/* Category card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
            <span className="px-3 py-2 text-sm rounded bg-gray-100 text-gray-800 flex items-center gap-1 w-fit">
              <FaFolder className="text-gray-400" />
              {getCategoryName()}
            </span>
          </div>

          {/* Labels card with improved design */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaTags className="mr-1.5 text-gray-500" /> Labels
            </h3>

            <div className="flex flex-wrap gap-2">
              {task.taskLabels && task.taskLabels.length > 0 ? (
                task.taskLabels.map((tl) => {
                  const label = labels?.find((l) => l.id === tl.labelId);
                  if (!label) return null;

                  return (
                    <span
                      key={label.id}
                      className={`px-3 py-1.5 text-sm rounded-full flex items-center ${getLabelColorClass(
                        label.id!
                      )}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full mr-1.5 ${
                          label.id === 1
                            ? "bg-red-500"
                            : label.id === 2
                            ? "bg-blue-500"
                            : label.id === 3
                            ? "bg-green-500"
                            : label.id === 4
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      ></span>
                      {label.name}
                    </span>
                  );
                })
              ) : (
                <div className="flex items-center text-gray-500 text-sm px-3 py-2 rounded-md w-full">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  No labels attached
                </div>
              )}
            </div>

            <button className="w-full mt-3 text-center px-3 py-1.5 text-sm border border-dashed border-gray-300 rounded-md text-gray-500 hover:text-indigo-600 hover:border-indigo-500 transition-colors">
              + Add Label
            </button>
          </div>

          {/* Activity timeline card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Activity</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-4 w-4 rounded-full bg-green-100 flex-shrink-0 mt-1 flex items-center justify-center">
                  <FaCheck size={8} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Created by User</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(task.createdAt)}
                  </p>
                </div>
              </div>
              {task.isCompleted && (
                <div className="flex gap-2">
                  <div className="h-4 w-4 rounded-full bg-indigo-100 flex-shrink-0 mt-1 flex items-center justify-center">
                    <FaCheck size={8} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Marked as complete</p>
                    <p className="text-xs text-gray-400">
                      Sometime after creation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task navigation - improved */}
      <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between">
        <button
          className={`flex items-center text-sm rounded px-3 py-1.5 ${
            previousTaskExists
              ? "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              : "text-gray-400 cursor-not-allowed opacity-50"
          } transition-colors`}
          onClick={() => previousTaskExists && navigate(`/tasks/${taskId - 1}`)}
          disabled={!previousTaskExists}
          aria-label="Previous task"
          title={
            previousTaskExists
              ? "Previous task (Left arrow key)"
              : "No previous task"
          }
        >
          <svg
            className="h-4 w-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Previous Task
        </button>

        <div className="flex gap-3">
          <button
            className="px-4 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
            onClick={() => navigate("/tasks")}
            title="View all tasks"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            All Tasks
          </button>

          {onEdit && task && (
            <button
              className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-sm hover:bg-indigo-100 transition-colors flex items-center gap-1"
              onClick={() => onEdit(task)}
              title="Edit task (Press 'E')"
            >
              <FaEdit size={14} />
              Edit Task
            </button>
          )}
        </div>

        <button
          className={`flex items-center text-sm rounded px-3 py-1.5 ${
            nextTaskExists
              ? "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              : "text-gray-400 cursor-not-allowed opacity-50"
          } transition-colors`}
          onClick={() => nextTaskExists && navigate(`/tasks/${taskId + 1}`)}
          disabled={!nextTaskExists}
          aria-label="Next task"
          title={
            nextTaskExists ? "Next task (Right arrow key)" : "No next task"
          }
        >
          Next Task
          <svg
            className="h-4 w-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
