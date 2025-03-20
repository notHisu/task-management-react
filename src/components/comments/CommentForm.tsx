import { useState, useRef, useEffect } from "react";
import {
  FaPaperPlane,
  FaSmile,
  FaBold,
  FaItalic,
  FaList,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import Button from "../common/Button";
import { useAuthStore } from "../../store/store";

interface CommentFormProps {
  taskId: number;
  onSubmit: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export function CommentForm({
  taskId,
  onSubmit,
  isLoading = false,
}: CommentFormProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update character count when content changes
  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      await onSubmit(content);
      setContent("");
      setCharCount(0);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  const handleCancel = () => {
    setContent("");
    setIsFocused(false);
    setCharCount(0);
  };

  // Get initial letter for avatar
  const getInitial = () => {
    return user?.name?.charAt(0) || user?.email?.charAt(0) || "U";
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex gap-3">
          {/* User avatar */}
          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium flex-shrink-0 text-sm">
            {getInitial()}
          </div>

          {/* Comment input area */}
          <div
            className={`flex-grow border ${
              isFocused
                ? "border-indigo-400 ring-1 ring-indigo-300"
                : "border-gray-300"
            } rounded-lg overflow-hidden transition-all duration-200`}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="w-full px-3 py-2 text-sm resize-none focus:outline-none min-h-[60px]"
              placeholder="Write a comment..."
              rows={1}
              maxLength={1000}
            />

            {/* Expandable editor toolbar - shows when focused */}
            {isFocused && (
              <div className="bg-gray-50 px-3 py-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  {/* Formatting controls */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                      title="Bold"
                    >
                      <FaBold size={12} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                      title="Italic"
                    >
                      <FaItalic size={12} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                      title="List"
                    >
                      <FaList size={12} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                      title="Emoji"
                    >
                      <FaSmile size={12} />
                    </button>
                  </div>

                  {/* Character count */}
                  <div className="text-xs text-gray-500">{charCount}/1000</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons - only show when focused */}
        {isFocused && (
          <div className="flex justify-end mt-2 gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <FaTimes size={12} /> Cancel
            </button>
            <Button
              type="submit"
              disabled={!content.trim() || isLoading}
              className={`!w-fit !py-1.5 !px-4 ${
                !content.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <FaSpinner className="animate-spin mr-1" size={12} />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <FaPaperPlane size={12} /> Comment
                </span>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
