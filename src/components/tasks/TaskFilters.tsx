import { useState, useRef } from "react";
import { Category } from "../../types/Category";
import { Label } from "../../types/Label";
import {
  FaFolder,
  FaCheckCircle,
  FaTags,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
} from "react-icons/fa";
import { processLabelColor } from "../../utils/utils";

interface TaskFiltersProps {
  labels?: Label[];
  categories?: Category[];
  isLoading: boolean;
  selectedCategory: number | null;
  selectedLabels: number[];
  showCompleted: boolean;
  searchTerm: string;
  onCategoryChange: (categoryId: number | null) => void;
  onCompletedChange: (showCompleted: boolean) => void;
  onLabelToggle: (labelId: number) => void;
  onSearch: (searchTerm: string) => void;
}

export function TaskFilters({
  labels,
  categories,
  isLoading,
  selectedCategory,
  selectedLabels,
  showCompleted,
  searchTerm,
  onCategoryChange,
  onCompletedChange,
  onLabelToggle,
  onSearch,
}: TaskFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Add debounce for search
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update the search handling with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout for search
    debounceTimeout.current = setTimeout(() => {
      onSearch(value);
    }, 300); // 300ms debounce
  };

  // Ensure the input reflects the actual search term
  const handleSearchClear = () => {
    onSearch("");
  };

  // Get active filter count for badge
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory !== null) count++;
    if (!showCompleted) count++;
    count += selectedLabels.length;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Clear all filters
  const handleClearAll = () => {
    onCategoryChange(null);
    onCompletedChange(true);
    selectedLabels.forEach((id) => onLabelToggle(id));
    onSearch("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with toggle for mobile */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer border-b border-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <FaFilter className="text-indigo-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">Filter Tasks</h3>
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button className="text-gray-400 hover:text-indigo-500 focus:outline-none">
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Filter content (collapsible on mobile) */}
      <div className={`${isExpanded ? "block" : "hidden md:block"} p-4`}>
        {/* Search input */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            defaultValue={searchTerm}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            placeholder="Search tasks..."
          />
          {searchTerm && (
            <button
              onClick={handleSearchClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category filter */}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FaFolder className="text-gray-400" /> Category
            </label>

            <div className="relative">
              <select
                value={selectedCategory || ""}
                onChange={(e) =>
                  onCategoryChange(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="block w-full pl-3 pr-12 py-2 text-sm border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                disabled={isLoading}
              >
                <option value="">All Categories</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Custom dropdown icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>

              {searchTerm && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 mr-2">
                        Search results for:
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-md flex items-center gap-1">
                        <FaSearch className="text-indigo-400" size={10} />
                        {searchTerm}
                        <button
                          onClick={handleSearchClear}
                          className="ml-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <FaTimes size={10} />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Clear button - moved to the left of custom dropdown icon */}
              {selectedCategory !== null && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryChange(null);
                  }}
                  className="absolute inset-y-0 right-8 flex items-center pr-1 text-gray-400 hover:text-gray-600"
                  title="Clear selection"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          {/* Status filter with toggle switch */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FaCheckCircle className="text-gray-400" /> Status
            </label>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-gray-700">
                Show Completed Tasks
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={showCompleted}
                  onChange={() => onCompletedChange(!showCompleted)}
                />
                <svg
                  width="44"
                  height="24"
                  viewBox="0 0 44 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer"
                >
                  {/* Track background */}
                  <rect
                    x="0"
                    y="0"
                    width="44"
                    height="24"
                    rx="12"
                    className={`transition-colors duration-300 ${
                      showCompleted ? "fill-indigo-600" : "fill-gray-300"
                    }`}
                  />

                  {/* Toggle circle */}
                  <circle
                    cx={showCompleted ? "32" : "12"}
                    cy="12"
                    r="10"
                    className="fill-white transition-all duration-300 shadow-sm"
                  />
                </svg>
              </label>
            </div>
          </div>
          {/* Labels filter with visual chips */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FaTags className="text-gray-400" /> Labels
            </label>
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
              {labels?.map((label) => {
                const isSelected = selectedLabels.includes(label.id!);

                const { colorHex, bgColor, textColor } = processLabelColor(
                  label.color
                );

                return (
                  <button
                    key={label.id}
                    onClick={() => onLabelToggle(label.id!)}
                    className="px-3 py-1.5 text-xs rounded-full flex items-center gap-1 transition-colors"
                    style={{
                      backgroundColor: isSelected ? bgColor : `${colorHex}15`, // Use even lighter bg when not selected
                      color: isSelected ? textColor : textColor,
                    }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: isSelected ? "#FFFFFF" : colorHex,
                      }}
                    ></span>
                    {label.name}
                    {isSelected && <FaTimes className="ml-1" />}
                  </button>
                );
              })}

              {labels?.length === 0 && (
                <span className="text-xs text-gray-500 italic py-1">
                  No labels available
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">
                  Active filters: {activeFilterCount}
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedCategory !== null && (
                    <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-md flex items-center gap-1">
                      <FaFolder className="text-indigo-400" size={10} />
                      {categories?.find((c) => c.id === selectedCategory)?.name}
                      <button
                        onClick={() => onCategoryChange(null)}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  )}
                  {!showCompleted && (
                    <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-md flex items-center gap-1">
                      <FaCheckCircle className="text-amber-400" size={10} />
                      Hiding Completed
                      <button
                        onClick={() => onCompletedChange(true)}
                        className="ml-1 text-amber-600 hover:text-amber-800"
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  )}
                  {selectedLabels.map((labelId) => {
                    const label = labels?.find((l) => l.id === labelId);
                    if (!label) return null;

                    return (
                      <span
                        key={labelId}
                        className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-md flex items-center gap-1"
                      >
                        <FaTags className="text-indigo-400" size={10} />
                        {label.name}
                        <button
                          onClick={() => onLabelToggle(labelId)}
                          className="ml-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <FaTimes size={10} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={handleClearAll}
                className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
