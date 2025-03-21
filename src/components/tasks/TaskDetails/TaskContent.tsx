import { useState } from "react";
import { Task } from "../../../types/Task";
import { MarkdownRenderer } from "../../common/MarkdownRenderer";
import {
  FaListAlt,
  FaMarkdown,
  FaExpandAlt,
  FaCompressAlt,
  FaRegLightbulb,
  FaCopy,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface TaskContentProps {
  task: Task;
}

export function TaskContent({ task }: TaskContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

  const hasDescription = !!task.description?.trim();

  // Copy description to clipboard
  const handleCopyDescription = () => {
    if (task.description) {
      navigator.clipboard.writeText(task.description);
      setShowCopyTooltip(true);
      setTimeout(() => setShowCopyTooltip(false), 2000);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-1.5 rounded-md mr-2">
            <FaListAlt className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-md font-semibold">Description</h3>
        </div>

        {hasDescription && (
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showCopyTooltip ? 1 : 0 }}
              className="text-xs bg-gray-800 text-white px-2 py-1 rounded absolute -mt-8 right-0"
            >
              Copied!
            </motion.div>

            <button
              onClick={handleCopyDescription}
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title="Copy description"
            >
              <FaCopy size={14} />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title={isExpanded ? "Collapse description" : "Expand description"}
            >
              {isExpanded ? (
                <FaCompressAlt size={14} />
              ) : (
                <FaExpandAlt size={14} />
              )}
            </button>
          </div>
        )}
      </div>

      <motion.div
        className={`bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 ${
          isExpanded ? "min-h-[300px]" : ""
        } transition-all duration-200`}
        animate={{
          maxHeight: isExpanded ? "600px" : "auto",
        }}
      >
        {hasDescription ? (
          <>
            <div
              className={`prose prose-indigo max-w-none dark:prose-invert ${
                isExpanded ? "prose-lg" : "prose-base"
              }`}
            >
              <MarkdownRenderer content={task.description!} />
            </div>

            <div className="mt-3 pt-3 text-xs text-gray-500 flex items-center border-t border-gray-200 dark:border-gray-700">
              <FaMarkdown className="mr-1.5" />
              <span>Markdown formatting supported</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mb-3">
              <FaRegLightbulb className="text-gray-400 dark:text-gray-300 w-5 h-5" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              No description provided
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs">
              Task descriptions can help team members understand the context and
              requirements of this task.
            </p>
          </div>
        )}
      </motion.div>

      {/* Related content section (conditionally rendered if description exists) */}
      {hasDescription && task.description!.length > 100 && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg"
            >
              <h4 className="text-sm font-medium text-indigo-800 mb-2">
                Key Information
              </h4>
              <ul className="space-y-1 text-sm">
                {/* Extract some relevant information like dates, people mentioned */}
                {task.description!.includes("@") && (
                  <li className="flex items-center text-indigo-700">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                    Mentions team members
                  </li>
                )}
                {(task.description!.includes("http://") ||
                  task.description!.includes("https://")) && (
                  <li className="flex items-center text-indigo-700">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                    Contains external links
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
