import { useState } from "react";
import { FaTasks, FaPlus } from "react-icons/fa";
import { ConfirmationModal } from "../components/common/ConfirmationModal";
import { Modal } from "../components/common/Modal";
import { EditTaskForm } from "../components/tasks/EditTaskForm";
import { TaskFilters } from "../components/tasks/TaskFilters";
import { TaskForm } from "../components/tasks/TaskForm";
import { TaskList } from "../components/tasks/TaskList";
import { TaskSorter } from "../components/tasks/TaskSorter";
import { useCategories } from "../hooks/useCategories";
import { useLabels } from "../hooks/useLabels";
import {
  useTasks,
  useTaskToggleCompletion,
  useTaskEdit,
  useTaskDelete,
} from "../hooks/useTasks";
import { useTaskWithLabelsCreate } from "../hooks/useTaskWithLabelsCreate";
import { TaskFormData } from "../schemas/taskSchema";
import { Task } from "../types/Task";

export function TasksPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formChanged, setFormChanged] = useState(false);

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
  const taskEditMutation = useTaskEdit();
  const taskDeleteMutation = useTaskDelete();

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
        // Check if task matches search term
        const matchesSearch = searchTerm
          ? task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase())
          : true;

        // Check if task matches category filter
        const matchesCategory =
          selectedCategory === null || task.categoryId === selectedCategory;

        // Check if task matches completion status filter
        const matchesCompletionStatus = showCompleted || !task.isCompleted;

        // Check if task contains all selected labels
        const matchesLabels =
          selectedLabels.length === 0 ||
          selectedLabels.every((labelId) =>
            task.taskLabels?.some((tl) => tl.labelId === labelId)
          );

        return (
          matchesSearch &&
          matchesCategory &&
          matchesCompletionStatus &&
          matchesLabels
        );
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

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedLabels.length > 0 ||
    !showCompleted ||
    searchTerm.trim() !== "";

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

  // New handler for task edit
  const handleEditTask = (data: TaskFormData) => {
    if (!selectedTask) return;

    taskEditMutation.mutate(
      {
        taskId: selectedTask.id!,
        data,
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        },
      }
    );
  };

  // New handler for task delete
  const handleDeleteTask = () => {
    if (!selectedTask) return;

    taskDeleteMutation.mutate(selectedTask.id!, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedTask(null);
      },
    });
  };

  // Handle opening edit modal
  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  // Handle opening delete modal
  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  // Add search handler in TasksPage
  const handleSearch = (query: string) => {
    setSearchTerm(query);
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
        searchTerm={searchTerm}
        onCategoryChange={setSelectedCategory}
        onCompletedChange={setShowCompleted}
        onLabelToggle={handleLabelToggle}
        onSearch={handleSearch}
      />

      {/* TaskSorter Component - Add this below the filters */}
      <div className="flex justify-end my-4">
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
        categories={categories}
        isLoading={tasksLoading}
        isError={tasksError}
        onToggleComplete={handleToggleComplete}
        onClearFilters={handleClearFilters}
        onCreateTask={() => setIsModalOpen(true)}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        hasActiveFilters={hasActiveFilters}
        allTasksCount={tasks?.length || 0}
      />

      {/* Task Creation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Create Task</h2>
        <TaskForm
          onSubmit={handleCreateTask}
          isLoading={taskWithLabelsCreateMutation.isPending}
        />
      </Modal>

      {/* Task Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          // Show confirmation if there are unsaved changes
          if (formChanged) {
            if (window.confirm("Discard unsaved changes?")) {
              setIsEditModalOpen(false);
              setSelectedTask(null);
            }
          } else {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }
        }}
        title={`Edit Task: ${selectedTask?.title}`}
        size="large"
      >
        {selectedTask && (
          <EditTaskForm
            initialData={selectedTask}
            onSubmit={handleEditTask}
            onCancel={() => setIsEditModalOpen(false)}
            isLoading={taskEditMutation.isPending}
          />
        )}
      </Modal>

      {/* Task Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        confirmText="Delete"
        isLoading={taskDeleteMutation.isPending}
      >
        <p className="text-gray-700">
          Are you sure you want to delete this task? This action cannot be
          undone.
        </p>
        {selectedTask && (
          <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="font-medium">{selectedTask.title}</p>
            {selectedTask.description && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedTask.description}
              </p>
            )}
          </div>
        )}
      </ConfirmationModal>
    </>
  );
}
