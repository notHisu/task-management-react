import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface TaskNavigationProps {
  taskId: number;
  previousTaskExists: boolean;
  nextTaskExists: boolean;
}

export function TaskNavigation({
  taskId,
  previousTaskExists,
  nextTaskExists
}: TaskNavigationProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between mb-6">
      <button
        onClick={() => navigate(`/tasks/${taskId - 1}`)}
        disabled={!previousTaskExists}
        className={`flex items-center gap-1 px-4 py-2 rounded-md border ${
          previousTaskExists 
            ? "border-gray-300 text-gray-700 hover:bg-gray-50" 
            : "border-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        <FaChevronLeft className="w-3 h-3" />
        Previous Task
      </button>
      
      <button
        onClick={() => navigate(`/tasks/${taskId + 1}`)}
        disabled={!nextTaskExists}
        className={`flex items-center gap-1 px-4 py-2 rounded-md border ${
          nextTaskExists 
            ? "border-gray-300 text-gray-700 hover:bg-gray-50" 
            : "border-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Next Task
        <FaChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}
