import { motion } from "framer-motion";

export const TaskDetailSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden animate-pulse"
    >
      {/* Sticky header/toolbar */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          {/* Left section: Back button and task title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48 sm:w-64"></div>
              </div>
              <div className="flex items-center mt-1 gap-3">
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-24"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-32"></div>
              </div>
            </div>
          </div>

          {/* Right section: Action buttons */}
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Status notification (placeholder for the toast) */}
      <div className="mx-6 mt-2 p-2 rounded-md border border-transparent">
        <div className="h-4 w-full bg-transparent"></div>
      </div>

      {/* Main content area */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-6">
                {["Details", "Attachments", "Comments"].map((tab, i) => (
                  <div
                    key={i}
                    className={`py-3 border-b-2 ${
                      i === 0 ? "border-indigo-500" : "border-transparent"
                    } flex items-center gap-1`}
                  >
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 sm:w-20"></div>
                    <div className="h-3 w-3 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab content - Description */}
            <div>
              {/* Description header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-md mr-2">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                  <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                </div>
              </div>

              {/* Description content */}
              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-4/6"></div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="h-3 w-3 bg-gray-100 dark:bg-gray-800 rounded-full mr-1"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">
            {/* Task status card */}
            <div className="rounded-lg p-4 border bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
              <div className="flex items-center mb-2">
                <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-16 mr-2"></div>
                <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-24"></div>
              </div>

              {/* TaskMetadata skeleton */}
              <div className="space-y-3 mt-4">
                {/* Due date */}
                <div className="bg-blue-100 dark:bg-blue-800 rounded-md px-3 py-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-200 dark:bg-blue-700 rounded mr-3"></div>
                    <div className="flex flex-col">
                      <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-24"></div>
                      <div className="h-3 bg-blue-100 dark:bg-blue-800 rounded w-20 mt-1"></div>
                    </div>
                  </div>
                </div>

                {/* Priority badge */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mr-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`flex items-start p-2 bg-gray-50 dark:bg-gray-800 rounded-md ${
                        i === 3 ? "sm:col-span-2" : ""
                      }`}
                    >
                      <div className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-700 rounded mt-0.5 mr-2"></div>
                      <div className="flex flex-col">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-12 mt-1"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task labels card */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-md">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="h-4 ml-2 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-7 w-20 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full h-6 w-16"
                  ></div>
                ))}
                <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full h-6 w-24"></div>
              </div>
            </div>

            {/* Keyboard shortcuts card */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mr-1.5"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
              </div>

              <div className="space-y-2 overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-24"></div>
                    <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 h-5 w-8"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task navigation footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </motion.div>
  );
};
