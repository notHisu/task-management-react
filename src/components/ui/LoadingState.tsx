import { FaSpinner } from "react-icons/fa";

export function LoadingState() {
  return (
    <div className="text-center py-8">
      <FaSpinner className="animate-spin text-indigo-600 text-3xl mx-auto" />
      <p className="mt-2 text-gray-500">Loading tasks...</p>
    </div>
  );
}
