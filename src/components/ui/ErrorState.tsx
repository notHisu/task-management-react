import { FaExclamationTriangle, FaSync } from "react-icons/fa";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Error",
  message = "Please try again later.",
  onRetry
}: ErrorStateProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
      <div className="flex flex-col">
        <div className="flex items-start mb-2">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{title}</h3>
            <p className="text-sm text-red-700 mt-1">{message}</p>
          </div>
        </div>
        
        {onRetry && (
          <div className="mt-2 ml-8">
            <button 
              onClick={onRetry}
              className="inline-flex items-center px-3 py-1 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaSync className="mr-1.5 h-3 w-3" />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
