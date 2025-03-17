import { useState } from "react";
import { useTasks, useTaskToggleCompletion } from "../hooks/useTasks";
import { useTaskWithLabelsCreate } from "../hooks/useTaskWithLabelsCreate";
import { useCategories } from "../hooks/useCategories";
import { useLabels } from "../hooks/useLabels";
import { TaskList } from "../components/tasks/TaskList";
import { TaskFilters } from "../components/tasks/TaskFilters";
import { TaskSorter } from "../components/tasks/TaskSorter";
import { TaskForm } from "../components/tasks/TaskForm";
import { Modal } from "../components/common/Modal";
import { FaTasks, FaPlus } from "react-icons/fa";
import { TaskFormData } from "../schemas/taskSchema";

export function TasksPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data from APIs using hooks
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useTasks();

  const { data: labels, isLoading: labelsLoading } = useLabels();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const toggleTaskCompletionMutation = useTaskToggleCompletion();

  const taskWithLabelsCreateMutation = useTaskWithLabelsCreate();

  // Handler for toggling label selection
  const handleLabelToggle = (labelId: number) => {
    setSelectedLabels((prev) => {
      if (prev.includes(labelId)) {
        return prev.filter((id) => id !== labelId);
      } else {
        return [...prev, labelId];
      }
    });
  };

  // Filter tasks based on selected category, completion status, and labels
  const filteredTasks = tasks
    ? tasks.filter((task) => {
        // Check category - using task.category.id (not categoryId)
        if (selectedCategory !== null && task.categoryId !== selectedCategory) {
          return false;
        }

        // Check completion status
        if (!showCompleted && task.isCompleted) {
          return false;
        }

        // Check labels - if any labels are selected, the task must have at least one
        if (selectedLabels.length > 0) {
          // If task has no labels or taskLabels array is empty, filter it out
          if (!task.taskLabels || task.taskLabels.length === 0) {
            return false;
          }

          // Check if the task has any of the selected labels
          const taskLabelIds = task.taskLabels.map((tl) => tl.labelId);
          const hasMatchingLabel = selectedLabels.some((labelId) =>
            taskLabelIds.includes(labelId)
          );

          if (!hasMatchingLabel) {
            return false;
          }
        }

        return true;
      })
    : [];

  // Sort tasks based on selected sort criteria
  const filteredAndSortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.createdAt || "").getTime();
      const dateB = new Date(b.createdAt || "").getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      // Sort by status (completed items at bottom or top)
      if (a.isCompleted === b.isCompleted) return 0;
      if (sortOrder === "asc") {
        return a.isCompleted ? 1 : -1;
      } else {
        return a.isCompleted ? -1 : 1;
      }
    }
  });

  // Handler to toggle task completion
  const handleToggleComplete = (taskId: number) => {
    toggleTaskCompletionMutation.mutate(taskId);
  };

  // Handler to clear filters
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setShowCompleted(true);
    setSelectedLabels([]);
  };

  // Updated handler for task creation
  const handleCreateTask = (data: TaskFormData) => {
    // Add console.log to debug
    console.log("Submitting task data:", data);

    taskWithLabelsCreateMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
      onError: (error) => {
        console.error("Error creating task:", error);
      },
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <FaTasks className="text-indigo-600 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        </div>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus /> Create Task
        </button>
      </div>

      {/* TaskFilters Component */}
      <TaskFilters
        labels={labels}
        categories={categories}
        isLoading={categoriesLoading}
        selectedCategory={selectedCategory}
        selectedLabels={selectedLabels}
        showCompleted={showCompleted}
        onCategoryChange={setSelectedCategory}
        onCompletedChange={setShowCompleted}
        onLabelToggle={handleLabelToggle}
      />

      {/* TaskSorter Component - Add this below the filters */}
      <div className="flex justify-end mb-4">
        <TaskSorter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
        />
      </div>

      {/* TaskList Component - Add categories prop */}
      <TaskList
        tasks={filteredAndSortedTasks}
        labels={labels}
        categories={categories} // Add this line
        isLoading={tasksLoading}
        isError={tasksError}
        onToggleComplete={handleToggleComplete}
        onClearFilters={handleClearFilters}
      />

      {/* Task Creation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Create Task</h2>
        <TaskForm
          onSubmit={handleCreateTask}
          isLoading={taskWithLabelsCreateMutation.isPending}
        />
      </Modal>
    </>
  );
}
