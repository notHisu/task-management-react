// Create a new component for task detail skeleton loading
import { FaArrowLeft } from "react-icons/fa";

export const TaskDetailSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md animate-pulse">
      {/* Header skeleton */}
      <div className="p-6 border-b border-gray-200 relative">
        {/* Left border indicator */}
        <div className="absolute inset-y-0 left-0 w-1 bg-gray-200"></div>

        <div className="flex items-center mb-4">
          <div className="mr-3 h-8 w-8 bg-gray-200 rounded-full"></div>
          <div className="h-7 bg-gray-200 rounded-md w-1/3 flex-1"></div>
          <div className="flex items-center gap-2 ml-2">
            <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="h-4 bg-gray-200 rounded w-36"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description skeleton */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex mb-2 items-center">
              <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              <div className="h-4 bg-gray-100 rounded w-4/6"></div>
            </div>
          </div>

          {/* Attachments skeleton */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex mb-2 items-center">
              <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
            </div>
            <div className="h-24 border-2 border-dashed border-gray-200 rounded-md"></div>
          </div>

          {/* Comments skeleton */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex mb-4 items-center">
              <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>

            {/* Comment items */}
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white p-3 rounded-lg border border-gray-100"
                >
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                      <div className="ml-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-100 rounded w-16 mt-1"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 pl-10">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-4/5 mt-1"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment input */}
            <div className="mt-4 flex items-start gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="h-20 bg-gray-100 rounded-md flex-grow"></div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Category skeleton */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-100 rounded w-32"></div>
          </div>

          {/* Labels skeleton */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 bg-gray-100 rounded-full w-16"></div>
              <div className="h-6 bg-gray-100 rounded-full w-20"></div>
              <div className="h-6 bg-gray-100 rounded-full w-12"></div>
            </div>
          </div>

          {/* Activity skeleton */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-100 rounded w-20 mt-1"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-3 bg-gray-200 rounded w-28"></div>
                  <div className="h-3 bg-gray-100 rounded w-20 mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation skeleton */}
      <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between">
        <div className="h-8 w-28 bg-gray-200 rounded-md"></div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
          <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
        </div>
        <div className="h-8 w-28 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
};
