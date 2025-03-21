import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { useLabels } from "../hooks/useLabels";
import {
  useTaskEdit,
  useTaskDelete,
  useTaskToggleCompletion,
} from "../hooks/useTasks";
import { TaskDetail } from "../components/tasks/TaskDetails/TaskDetail";
import { Modal } from "../components/common/Modal";
import { ConfirmationModal } from "../components/common/ConfirmationModal";
import { Task } from "../types/Task";
import { TaskFormData } from "../schemas/taskSchema";
import { EditTaskForm } from "../components/tasks/EditTaskForm";

export function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const taskIdNum = parseInt(taskId || "0");
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formChanged, setFormChanged] = useState(false);

  const { data: categories } = useCategories();
  const { data: labels } = useLabels();

  const taskEditMutation = useTaskEdit();
  const taskDeleteMutation = useTaskDelete();

  // Handler for editing a task
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

  // Handler for deleting a task
  const handleDeleteTask = () => {
    if (!selectedTask) return;

    taskDeleteMutation.mutate(selectedTask.id!, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedTask(null);
        navigate("/tasks");
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

  return (
    <>
      <TaskDetail
        taskId={taskIdNum}
        labels={labels}
        categories={categories}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

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
