import { useState, useRef, useEffect } from "react";
import {
  FaSortAmountDown,
  FaSortAmountUp,
  FaChevronDown,
  FaCalendarAlt,
  FaAlignLeft,
  FaCheckCircle,
} from "react-icons/fa";

type SortBy = "date" | "title" | "status";
type SortOrder = "asc" | "desc";

interface TaskSorterProps {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortByChange: (sortBy: SortBy) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
}

export function TaskSorter({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: TaskSorterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get label text for current sort option
  const getSortByLabel = () => {
    switch (sortBy) {
      case "date":
        return "Date";
      case "title":
        return "Title";
      case "status":
        return "Status";
      default:
        return "Sort by";
    }
  };

  // Get icon for current sort option
  const getSortByIcon = () => {
    switch (sortBy) {
      case "date":
        return <FaCalendarAlt className="mr-1.5" />;
      case "title":
        return <FaAlignLeft className="mr-1.5" />;
      case "status":
        return <FaCheckCircle className="mr-1.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2 relative" ref={dropdownRef}>
      <div className="text-sm text-gray-500">Sort:</div>

      {/* Sort By Dropdown */}
      <div className="relative">
        <button
          className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm flex items-center shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="flex items-center text-gray-700">
            {getSortByIcon()}
            {getSortByLabel()}
          </span>
          <FaChevronDown className="ml-2 text-gray-400" size={10} />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                className={`block w-full text-left px-4 py-2 text-sm ${
                  sortBy === "date"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => {
                  onSortByChange("date");
                  setIsDropdownOpen(false);
                }}
              >
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  <span>Date Created</span>
                </div>
              </button>

              <button
                className={`block w-full text-left px-4 py-2 text-sm ${
                  sortBy === "title"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => {
                  onSortByChange("title");
                  setIsDropdownOpen(false);
                }}
              >
                <div className="flex items-center">
                  <FaAlignLeft className="mr-2 text-gray-400" />
                  <span>Title</span>
                </div>
              </button>

              <button
                className={`block w-full text-left px-4 py-2 text-sm ${
                  sortBy === "status"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => {
                  onSortByChange("status");
                  setIsDropdownOpen(false);
                }}
              >
                <div className="flex items-center">
                  <FaCheckCircle className="mr-2 text-gray-400" />
                  <span>Completion Status</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sort Order Toggle Button */}
      <button
        className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${
          sortOrder === "asc" ? "text-indigo-600" : "text-gray-600"
        }`}
        onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
        title={sortOrder === "asc" ? "Ascending Order" : "Descending Order"}
      >
        {sortOrder === "asc" ? (
          <FaSortAmountUp size={16} />
        ) : (
          <FaSortAmountDown size={16} />
        )}
      </button>
    </div>
  );
}
