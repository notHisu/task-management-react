import { User } from "./Auth";

export interface Comment {
  id?: number;
  taskId?: number;
  userId?: number;
  content?: string;
  createdAt?: string;
  user?: User;
}
