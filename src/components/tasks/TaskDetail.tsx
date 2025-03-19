import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  FaTimes,
  FaPlus,
  FaListAlt,
  FaPaperclip,
  FaInfoCircle,
  FaChevronLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { formatDate, getTimeSince } from "../../utils/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { TaskDetailSkeleton } from "./TaskDetailSkeleton";
import { useAddLabel, useLabels } from "../../hooks/useLabels";
import {
  useAddTaskLabel,
  useDeleteTaskLabel,
  useTaskLabelsByTaskId,
} from "../../hooks/useTaskLabels";
import { MarkdownRenderer } from "../common/MarkdownRenderer";
import { TaskAttachments } from "./TaskAttachments";

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
  const [isLabelSelectorOpen, setIsLabelSelectorOpen] = useState(false);

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

  const [isAddingNewLabel, setIsAddingNewLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#000000");
  const newLabelInputRef = useRef<HTMLInputElement>(null);

  const addLabelMutation = useAddLabel();
  const removeLabelMutation = useDeleteTaskLabel();
  const addTaskLabelMutation = useAddTaskLabel();

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

  useEffect(() => {
    if (isAddingNewLabel && newLabelInputRef.current) {
      newLabelInputRef.current.focus();
    }
  }, [isAddingNewLabel]);

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

  // Map labels to color classes based on label's actual color
  const getLabelColorClass = (labelId: number) => {
    if (!labels) return "bg-gray-100 text-gray-800";

    const label = labels.find((l) => l.id === labelId);
    if (!label || !label.color) return "bg-gray-100 text-gray-800";

    // Generate color code (adding # if needed)
    const colorHex = label.color.startsWith("#")
      ? label.color
      : `#${label.color}`;

    // Calculate text color (black or white) based on background color brightness
    const r = parseInt(colorHex.slice(1, 3), 16);
    const g = parseInt(colorHex.slice(3, 5), 16);
    const b = parseInt(colorHex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    const textColor = brightness > 128 ? "text-gray-800" : "text-white";

    // Return an empty string for className, we'll use inline style instead
    return "";
  };

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

  // Handle adding a label to the task
  const handleAddTaskLabel = (labelId: number) => {
    addTaskLabelMutation
      .mutateAsync({
        taskId: taskId,
        labelId: labelId,
      })
      .then(() => {
        // Refresh the task data
        queryClient.invalidateQueries({ queryKey: ["task", taskId] });
        setIsLabelSelectorOpen(false);
      });
  };

  const handleCreateNewLabel = () => {
    if (!newLabelName.trim()) return;

    addLabelMutation
      .mutateAsync({
        name: newLabelName.trim(),
        color: newLabelColor.replace("#", ""), // Remove # prefix if API requires
      })
      .then((newLabel) => {
        // After creating the label, add it to the task
        handleAddTaskLabel(newLabel.id!);

        // Reset the form
        setNewLabelName("");
        setIsAddingNewLabel(false);

        // Refresh labels list
        queryClient.invalidateQueries({ queryKey: ["labels"] });
      });
  };

  // Handle removing a label from the task
  const handleRemoveLabel = (labelId: number) => {
    removeLabelMutation
      .mutateAsync({
        taskId: taskId,
        labelId: labelId,
      })
      .then(() => {
        // Refresh the task data
        queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      });
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
              onClick={() => handleToggleCompletion(task.id!)}
              className={`!py-1.5 !px-3 flex items-center gap-1 ${
                task.isCompleted
                  ? "bg-green-300 hover:bg-green-400 text-green-700"
                  : "bg-amber-300 hover:bg-amber-400 text-amber-700"
              }`}
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
                className="!py-1.5 !px-3 bg-indigo-400 hover:bg-indigo-500 text-indigo-700 flex items-center gap-1"
              >
                <FaEdit size={14} /> Edit
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={() => onDelete(task)}
                className="!py-1.5 !px-3 bg-red-400 hover:bg-red-500 text-red-700 flex items-center gap-1"
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
              <FaListAlt className="w-4 h-4 mr-1.5 text-gray-500" />
              Description
            </h3>
            {task.description ? (
              <MarkdownRenderer
                content={task.description}
                className="text-gray-800"
              />
            ) : (
              <p className="text-gray-500 italic">No description provided.</p>
            )}
          </div>

          {/* Attachments placeholder with improved design */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <TaskAttachments taskId={taskId} />
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

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaTags className="mr-1.5 text-gray-500" /> Labels
            </h3>

            <div className="flex flex-wrap gap-2">
              {taskLabels && taskLabels.length > 0 ? (
                taskLabels.map((taskLabel) => {
                  const labelId = taskLabel.labelId;
                  const labelInfo = labels?.find((l) => l.id === labelId) || {
                    name: "Unknown Label",
                    color: "808080", // Default gray if label not found
                  };

                  // Generate color code (adding # if needed)
                  const colorHex = labelInfo.color?.startsWith("#")
                    ? labelInfo.color
                    : `#${labelInfo.color || "808080"}`;

                  // Calculate light background (20% opacity)
                  const bgColor = `${colorHex}33`;

                  // Calculate text color based on background brightness
                  const r = parseInt(colorHex.slice(1, 3) || "80", 16);
                  const g = parseInt(colorHex.slice(3, 5) || "80", 16);
                  const b = parseInt(colorHex.slice(5, 7) || "80", 16);
                  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                  const textColor = brightness > 128 ? "#1F2937" : "#FFFFFF";

                  return (
                    <span
                      key={labelId}
                      className="px-3 py-1.5 text-sm rounded-full flex items-center justify-between gap-2"
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                      }}
                    >
                      <div className="flex items-center">
                        <span
                          className="h-2 w-2 rounded-full mr-1.5"
                          style={{ backgroundColor: colorHex }}
                        ></span>
                        {labelInfo.name}
                      </div>
                      <button
                        onClick={() => handleRemoveLabel(labelId!)}
                        className="text-opacity-60 hover:text-opacity-100"
                        title="Remove label"
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  );
                })
              ) : (
                <div className="flex items-center text-gray-500 text-sm px-3 py-2 rounded-md w-full">
                  <FaInfoCircle className="w-4 h-4 mr-2 text-gray-400" />
                  No labels attached
                </div>
              )}
            </div>

            {/* Label selector dropdown - ADD THIS PART */}
            {isLabelSelectorOpen ? (
              <div className="mt-3 border border-gray-200 rounded-md p-2 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-medium text-gray-700">
                    Add a label
                  </h4>
                  <button
                    onClick={() => setIsLabelSelectorOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>

                {isAddingNewLabel ? (
                  <div className="space-y-2">
                    <div>
                      <input
                        ref={newLabelInputRef}
                        type="text"
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                        placeholder="Label name"
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded mb-1.5"
                        maxLength={20}
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <label className="text-xs text-gray-600">Color:</label>
                      <input
                        type="color"
                        value={newLabelColor}
                        onChange={(e) => setNewLabelColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <div
                        className="ml-1 flex-1 px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: `${newLabelColor}20`,
                          color: newLabelColor,
                        }}
                      >
                        Preview
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => setIsAddingNewLabel(false)}
                        className="flex-1 px-2 py-1.5 text-xs rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateNewLabel}
                        disabled={!newLabelName.trim()}
                        className={`flex-1 px-2 py-1.5 text-xs rounded ${
                          newLabelName.trim()
                            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Create & Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="max-h-32 overflow-y-auto">
                      {labels
                        ?.filter(
                          (label) =>
                            // Only show labels not already on the task
                            !taskLabels?.some((tl) => tl.labelId === label.id)
                        )
                        .map((label) => (
                          <button
                            key={label.id}
                            onClick={() => handleAddTaskLabel(label.id!)}
                            className={`w-full text-left px-2 py-1.5 text-xs rounded mb-1 flex items-center ${getLabelColorClass(
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
                          </button>
                        ))}

                      {labels?.filter(
                        (label) =>
                          !taskLabels?.some((tl) => tl.labelId === label.id)
                      ).length === 0 && (
                        <p className="text-xs text-gray-500 italic p-1">
                          All existing labels added
                        </p>
                      )}
                    </div>

                    {/* Add this custom label button */}
                    <button
                      onClick={() => setIsAddingNewLabel(true)}
                      className="w-full mt-2 text-center px-3 py-1.5 text-xs border border-dashed border-gray-300 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center"
                    >
                      <FaPlus size={10} className="mr-1.5" /> Create new label
                    </button>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLabelSelectorOpen(true)}
                className="w-full mt-3 text-center px-3 py-1.5 text-sm border border-dashed border-gray-300 rounded-md text-gray-500 hover:text-indigo-600 hover:border-indigo-500 transition-colors flex items-center justify-center"
              >
                <FaPlus size={10} className="mr-1.5" /> Add Label
              </button>
            )}
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
          <FaChevronLeft className="h-4 w-4 mr-1" />
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
            viewBox="0 0 24 24"
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
