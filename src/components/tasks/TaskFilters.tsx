import { Category } from "../../types/Category";
import { Label } from "../../types/Label";
import {
  FaFolder,
  FaCheckCircle,
  FaTags,
  FaFilter,
  FaTimes,
} from "react-icons/fa";

interface TaskFiltersProps {
  labels?: Label[];
  categories?: Category[];
  isLoading: boolean;
  selectedCategory: number | null;
  selectedLabels: number[];
  showCompleted: boolean;
  onCategoryChange: (categoryId: number | null) => void;
  onCompletedChange: (show: boolean) => void;
  onLabelToggle: (labelId: number) => void;
}

export function TaskFilters({
  labels,
  categories,
  isLoading,
  selectedCategory,
  selectedLabels,
  showCompleted,
  onCategoryChange,
  onCompletedChange,
  onLabelToggle,
}: TaskFiltersProps) {
  // Get active filter count for badge
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory !== null) count++;
    if (!showCompleted) count++;
    count += selectedLabels.length;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <FaFilter className="text-gray-500" /> Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Category filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <FaFolder className="text-gray-400" /> Category
          </label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-40"
            value={selectedCategory || ""}
            onChange={(e) =>
              onCategoryChange(e.target.value ? Number(e.target.value) : null)
            }
            disabled={isLoading}
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <FaCheckCircle className="text-gray-400" /> Status
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showCompleted"
              checked={showCompleted}
              onChange={() => onCompletedChange(!showCompleted)}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label htmlFor="showCompleted" className="text-sm text-gray-700">
              Show Completed
            </label>
          </div>
        </div>

        {/* Labels filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <FaTags className="text-gray-400" /> Labels
          </label>
          <div className="flex flex-wrap gap-2">
            {labels?.map((label) => (
              <button
                key={label.id}
                onClick={() => onLabelToggle(label.id!)}
                className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                  selectedLabels.includes(label.id!)
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {label.name}
                {selectedLabels.includes(label.id!) && (
                  <FaTimes className="ml-1" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Active filters: {activeFilterCount}
            </span>
            <button
              onClick={() => {
                onCategoryChange(null);
                onCompletedChange(true);
                selectedLabels.forEach((id) => onLabelToggle(id));
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
