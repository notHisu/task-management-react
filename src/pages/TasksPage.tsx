import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useCategories } from "../hooks/useCategories";
import { useLabels } from "../hooks/useLabels";
import { TaskList } from "../components/tasks/TaskList";
import { TaskFilters } from "../components/tasks/TaskFilters";
import { TaskSorter } from "../components/tasks/TaskSorter";
import { FaTasks, FaPlus } from "react-icons/fa";

export function TasksPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch data from APIs using hooks
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useTasks();

  const { data: labels, isLoading: labelsLoading } = useLabels();

  const { data: categories, isLoading: categoriesLoading } = useCategories();

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
        if (
          selectedCategory !== null &&
          task.category?.id !== selectedCategory
        ) {
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
    console.log("Toggle task completion:", taskId);
    // Will implement actual API call in a future step
  };

  // Handler to clear filters
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setShowCompleted(true);
    setSelectedLabels([]);
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
          onClick={() => {
            console.log("Create task clicked");
          }}
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

      {/* TaskList Component */}
      <TaskList
        tasks={filteredAndSortedTasks}
        labels={labels}
        isLoading={tasksLoading}
        isError={tasksError}
        onToggleComplete={handleToggleComplete}
        onClearFilters={handleClearFilters}
      />
    </>
  );
}
