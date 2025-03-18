import { ReactNode } from "react";
import Button from "./Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-3 text-gray-900">{title}</h3>
        <div className="mb-6">{children}</div>

        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            disabled={isLoading}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            isLoading={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
