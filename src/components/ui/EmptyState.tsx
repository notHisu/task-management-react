import { FaSearch } from "react-icons/fa";

interface EmptyStateProps {
  message?: string;
  onClearFilters?: () => void;
}

export function EmptyState({
  message = "No tasks found matching your criteria.",
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg p-8 text-center shadow-sm">
      <FaSearch className="mx-auto text-gray-300 text-4xl mb-4" />
      <p className="text-gray-500">{message}</p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
