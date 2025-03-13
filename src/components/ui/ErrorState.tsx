import { FaExclamationTriangle } from "react-icons/fa";

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({
  message = "Please try again later.",
}: ErrorStateProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <FaExclamationTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">Error loading tasks. {message}</p>
        </div>
      </div>
    </div>
  );
}
