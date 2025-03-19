export interface TaskAttachment {
  id?: number;
  taskId: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedAt?: string;
}
