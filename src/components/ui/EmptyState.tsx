import { useState } from "react";
import { FaPlus, FaSearch, FaFilter, FaRegLightbulb } from "react-icons/fa";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  onClearFilters?: () => void;
  onCreateTask?: () => void;
  hasActiveFilters?: boolean;
  noTasksAtAll?: boolean;
}

export function EmptyState({
  onClearFilters,
  onCreateTask,
  hasActiveFilters = false,
  noTasksAtAll = false,
}: EmptyStateProps) {
  const navigate = useNavigate();
  const [tipIndex, setTipIndex] = useState(0);

  // Productivity tips to show when user has no tasks
  const productivityTips = [
    "Try breaking large tasks into smaller, manageable steps",
    "Set specific deadlines for tasks to stay accountable",
    "Consider using the 'Important' label for high-priority tasks",
    "Complete your most challenging task first thing in the morning",
    "Remember to take short breaks between completing tasks",
  ];

  // Navigate to next tip
  const showNextTip = () => {
    setTipIndex((prevIndex) => (prevIndex + 1) % productivityTips.length);
  };

  if (noTasksAtAll) {
    return (
      <div className="text-center py-16 px-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
          <FaPlus className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Get started by creating your first task. Tasks help you track what
          needs to be done and stay organized.
        </p>

        {/* Quick productivity tip section */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-6 max-w-md mx-auto">
          <div className="flex items-start">
            <FaRegLightbulb className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Productivity Tip
              </h4>
              <p className="text-sm text-yellow-700">
                {productivityTips[tipIndex]}
              </p>
              <button
                onClick={showNextTip}
                className="text-xs text-yellow-600 hover:text-yellow-800 mt-2 underline"
              >
                Show another tip
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onCreateTask || (() => navigate("/tasks/new"))}
            className="!bg-indigo-600 !text-white hover:!bg-indigo-700 !border-transparent !shadow-sm !px-5 !py-2 !rounded-md transition-all duration-200 flex items-center"
          >
            <FaPlus className="mr-1.5" size={12} />
            Create Task
          </Button>
        </div>
      </div>
    );
  }

  if (hasActiveFilters) {
    return (
      <div className="text-center py-12 px-4 rounded-lg border border-gray-200 bg-gray-50">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-4">
          <FaSearch className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No matching tasks found
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          We couldn't find any tasks that match your current filters. Try
          adjusting your filters or creating a new task.
        </p>

        {/* Visual filter indicator */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
            <FaFilter className="mr-1 h-3 w-3" />
            Active filters applied
          </span>
        </div>

        <div className="flex justify-center gap-3">
          {onClearFilters && (
            <Button
              onClick={onClearFilters}
              className="!bg-white !text-gray-600 !border !border-gray-200 hover:!bg-gray-50 hover:!border-gray-300 !shadow-sm !px-5 !py-2 !rounded-md transition-all duration-200 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear Filters
            </Button>
          )}
          <Button
            onClick={onCreateTask || (() => navigate("/tasks/new"))}
            className="!bg-indigo-600 !text-white hover:!bg-indigo-700 !border-transparent !shadow-sm !px-5 !py-2 !rounded-md transition-all duration-200 flex items-center"
          >
            <FaPlus className="mr-1.5" size={12} />
            Create Task
          </Button>
        </div>
      </div>
    );
  }

  // Default empty state (should rarely happen, but good to have)
  return (
    <div className="text-center py-12 px-4 rounded-lg border border-gray-200 bg-gray-50">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
        <span className="text-2xl text-gray-400">🤔</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No tasks to display
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Something unexpected happened. Try refreshing the page or creating a new
        task.
      </p>
      <div className="flex justify-center gap-3">
        <Button
          onClick={() => window.location.reload()}
          className="!bg-white !text-gray-600 !border !border-gray-200 hover:!bg-gray-50 hover:!border-gray-300 !shadow-sm !px-5 !py-2 !rounded-md transition-all duration-200 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </Button>
        <Button
          onClick={onCreateTask || (() => navigate("/tasks/new"))}
          className="!bg-indigo-600 !text-white hover:!bg-indigo-700 !border-transparent !shadow-sm !px-5 !py-2 !rounded-md transition-all duration-200 flex items-center"
        >
          <FaPlus className="mr-1.5" size={12} />
          Create Task
        </Button>
      </div>
    </div>
  );
}
