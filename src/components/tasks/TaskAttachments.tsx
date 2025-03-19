import { useState, useRef } from "react";
import { FaPaperclip, FaTrash, FaDownload, FaPlus } from "react-icons/fa";
import {
  useTaskAttachments,
  useUploadTaskAttachment,
  useDeleteTaskAttachment,
  useDownloadAttachment,
} from "../../hooks/useTaskAttachments";
import { bytesToSize } from "../../utils/utils";
import { TaskAttachment } from "../../types/Attachment";
import { getFileIcon } from "../../utils/fileIcons";

interface TaskAttachmentsProps {
  taskId: number;
  readOnly?: boolean;
}

export function TaskAttachments({
  taskId,
  readOnly = false,
}: TaskAttachmentsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: attachments, isLoading } = useTaskAttachments(taskId);
  const {
    mutate: uploadFile,
    uploadProgress,
    isPending: isUploading,
  } = useUploadTaskAttachment();
  const deleteMutation = useDeleteTaskAttachment();
  const downloadMutation = useDownloadAttachment();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
    // Reset the input so the same file can be selected again
    e.target.value = "";
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      uploadFile({ taskId, file });
    });
  };

  const handleDeleteAttachment = (attachmentId: number) => {
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      deleteMutation.mutate({ taskId, attachmentId });
    }
  };

  const handleDownload = (attachment: TaskAttachment) => {
    downloadMutation.mutate(attachment);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
        <FaPaperclip className="w-4 h-4 mr-1.5 text-gray-500" />
        Attachments
      </h3>

      {/* Attachments list */}
      <div className="space-y-2 mb-4">
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ) : attachments && attachments.length > 0 ? (
          attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center overflow-hidden">
                {getFileIcon(attachment.fileType)}
                <div className="truncate">
                  <p
                    className="text-sm font-medium text-gray-700 truncate"
                    title={attachment.fileName}
                  >
                    {attachment.fileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {bytesToSize(attachment.fileSize)} •
                    {new Date(attachment.uploadedAt!).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 ml-2 shrink-0">
                <button
                  onClick={() => handleDownload(attachment)}
                  className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
                  title="Download"
                >
                  <FaDownload size={14} />
                </button>
                {!readOnly && (
                  <button
                    onClick={() => handleDeleteAttachment(attachment.id!)}
                    className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No attachments yet</p>
        )}
      </div>

      {/* Upload area - only show if not readOnly */}
      {!readOnly && (
        <>
          <div
            className={`flex items-center justify-center h-24 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
              isDragging
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <FaPlus className="mx-auto h-6 w-6 text-gray-400" />
              <p className="mt-1 text-sm text-gray-500">
                Drag files here or{" "}
                <span className="text-indigo-600 hover:text-indigo-800 cursor-pointer">
                  browse
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-400">Max file size: 10MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>

          {isUploading && (
            <div className="mt-2">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs text-gray-500">
                  {uploadProgress < 100
                    ? `Uploading: ${uploadProgress}%`
                    : "Processing..."}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
