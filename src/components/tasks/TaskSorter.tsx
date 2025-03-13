import { FaSortUp, FaSortDown } from "react-icons/fa";

interface TaskSorterProps {
  sortBy: "date" | "status";
  sortOrder: "asc" | "desc";
  onSortByChange: (sortBy: "date" | "status") => void;
  onSortOrderChange: (sortOrder: "asc" | "desc") => void;
}

export function TaskSorter({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: TaskSorterProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <span className="text-sm text-gray-500 mr-2">Sort by:</span>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-medium rounded-l-md ${
              sortBy === "date"
                ? "bg-indigo-50 text-indigo-700"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-gray-200`}
            onClick={() => onSortByChange("date")}
          >
            Date
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-medium rounded-r-md ${
              sortBy === "status"
                ? "bg-indigo-50 text-indigo-700"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-l-0 border-gray-200`}
            onClick={() => onSortByChange("status")}
          >
            Status
          </button>
        </div>
      </div>

      <button
        className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100"
        onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
        aria-label={sortOrder === "asc" ? "Sort descending" : "Sort ascending"}
      >
        {sortOrder === "asc" ? (
          <FaSortUp className="text-gray-500 text-lg" />
        ) : (
          <FaSortDown className="text-gray-500 text-lg" />
        )}
      </button>
    </div>
  );
}
