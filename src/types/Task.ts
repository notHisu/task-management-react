import { TaskFormData } from "../schemas/taskSchema";

export interface Task {
  id?: number;
  title?: string;
  description?: string;
  isCompleted?: boolean;
  userId?: number;
  categoryId: number;
  taskLabels?: TaskLabel[];
  createdAt?: string;
  dueDate?: string;
  priority?: string;
}

export interface TaskLabel {
  taskId?: number;
  labelId?: number;
}

export interface TaskUpdate {
  id?: number;
  title?: string;
  description?: string;
  isCompleted?: boolean;
  categoryId: number;
}

export interface TaskWithLabelsFormData extends TaskFormData {
  labelIds?: number[];
}
