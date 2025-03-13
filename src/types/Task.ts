import { Category } from "./Category";

export interface Task {
  id?: number;
  title?: string;
  description?: string;
  isCompleted?: boolean;
  userId?: number;
  category?: Category;
  taskLabels?: TaskLabel[];
  createdAt?: string;
}

export interface TaskLabel {
  taskId?: number;
  labelId?: number;
}
