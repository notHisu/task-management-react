import { useState, useRef, useEffect } from "react";
import { useTaskComments, useAddComment } from "../../hooks/useTaskComments";
import { CommentForm } from "./CommentForm";
import { formatDistanceToNow } from "date-fns";
import { FaComment, FaReply, FaTrash, FaEllipsisV } from "react-icons/fa";
import { Comment } from "../../types/Comment";
import { useAuthStore } from "../../store/store";
import { AnimatePresence, motion } from "framer-motion";

interface TaskCommentsProps {
  taskId: number;
}

export function TaskComments({ taskId }: TaskCommentsProps) {
  const [expandedCommentId, setExpandedCommentId] = useState<number | null>(
    null
  );
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  const { data: comments, isLoading, isError } = useTaskComments(taskId);

  const addCommentMutation = useAddComment();

  const handleAddComment = async (content: string): Promise<any> => {
    if (!content.trim()) return Promise.resolve();

    return addCommentMutation.mutateAsync({
      taskId,
      content,
    });
  };

  const handleToggleDropdown = (commentId: number) => {
    setActiveDropdown(activeDropdown === commentId ? null : commentId);
  };

  const handleReplyClick = (commentId: number) => {
    setExpandedCommentId(expandedCommentId === commentId ? null : commentId);
    setActiveDropdown(null); // Close dropdown after clicking Reply
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get initial letter for user avatar
  const getInitial = (name?: string, email?: string) => {
    if (name && name.length > 0) return name.charAt(0).toUpperCase();
    if (email && email.length > 0) return email.charAt(0).toUpperCase();
    return "?";
  };

  // Calculate comment background based on user
  const getCommentStyle = (comment: Comment) => {
    const isCurrentUser = comment.userId === user?.id;

    return {
      wrapperClass: isCurrentUser ? "ml-auto" : "",
      avatarClass: isCurrentUser
        ? "bg-indigo-100 text-indigo-700"
        : "bg-gray-100 text-gray-700",
      actionClass: isCurrentUser ? "justify-start" : "justify-end",
    };
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
        <FaComment className="text-gray-500 mr-1.5" />
        Comments
        {comments && comments.length > 0 && (
          <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
            {comments.length}
          </span>
        )}
      </h3>

      <div className="space-y-4 mb-4">
        {isLoading ? (
          // Comment skeletons
          Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex mb-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
                <div className="ml-2 flex-grow">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-100 rounded w-16 mt-1" />
                </div>
              </div>
              <div className="pl-10">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6 mt-1" />
              </div>
            </div>
          ))
        ) : isError ? (
          <div className="text-center p-4">
            <p className="text-sm text-red-500">Failed to load comments</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
            >
              Try again
            </button>
          </div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => {
            const style = getCommentStyle(comment);
            const isCommentExpanded = expandedCommentId === comment.id;
            const isDropdownOpen = activeDropdown === comment.id;

            return (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
              >
                <div className="flex justify-between">
                  {/* User info */}
                  <div className="flex items-start">
                    <div
                      className={`h-8 w-8 rounded-full ${style.avatarClass} flex-shrink-0 flex items-center justify-center text-sm font-medium`}
                    >
                      {getInitial(comment.user?.name, comment.user?.email)}
                    </div>
                    <div className="ml-2">
                      <div className="font-medium text-sm">
                        {comment.user?.name ||
                          comment.user?.email ||
                          "Anonymous"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {comment.createdAt &&
                          formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                      </div>
                    </div>
                  </div>

                  {/* Comment actions */}
                  <div className="relative">
                    <button
                      onClick={() => handleToggleDropdown(comment.id!)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50"
                    >
                      <FaEllipsisV size={12} />
                    </button>

                    {/* Dropdown menu */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          ref={dropdownRef}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200"
                        >
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => handleReplyClick(comment.id!)}
                          >
                            <FaReply size={12} className="mr-2" />
                            Reply
                          </button>
                          {user?.id === comment.userId && (
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                              <FaTrash size={12} className="mr-2" />
                              Delete
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Comment content */}
                <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap pl-10">
                  {comment.content}
                </div>

                {/* Reply form - shown when expanded */}
                <AnimatePresence>
                  {isCommentExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pl-8 border-l-2 border-gray-100"
                    >
                      <div className="pt-2">
                        <CommentForm
                          taskId={taskId}
                          onSubmit={async (content) => {
                            await handleAddComment(
                              `@${comment.user?.name || "User"} ${content}`
                            );
                            setExpandedCommentId(null);
                          }}
                          isLoading={addCommentMutation.isPending}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No comments yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Be the first to share your thoughts on this task.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <CommentForm
          taskId={taskId}
          onSubmit={handleAddComment}
          isLoading={addCommentMutation.isPending}
        />
      </div>
    </div>
  );
}
