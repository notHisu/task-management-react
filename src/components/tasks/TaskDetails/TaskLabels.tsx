import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  FaTags,
  FaPlus,
  FaTimes,
  FaSearch,
  FaCheck,
  FaSpinner,
  FaPalette,
  FaInfoCircle,
} from "react-icons/fa";
import { useAddLabel } from "../../../hooks/useLabels";
import {
  useDeleteTaskLabel,
  useAddTaskLabel,
} from "../../../hooks/useTaskLabels";
import { Label } from "../../../types/Label";
import { processLabelColor } from "../../../utils/utils";

interface TaskLabelsProps {
  taskId: number;
  taskLabels: { taskId: number; labelId: number }[];
  allLabels?: Label[];
}

// Pre-defined color palette for better UX
const COLOR_PALETTE = [
  "#4361ee",
  "#3a86ff",
  "#4cc9f0",
  "#4895ef",
  "#560bad",
  "#f72585",
  "#7209b7",
  "#3f37c9",
  "#4cc9f0",
  "#4361ee",
  "#e63946",
  "#fb8500",
  "#ffb703",
  "#2a9d8f",
  "#06d6a0",
];

export function TaskLabels({ taskId, taskLabels, allLabels }: TaskLabelsProps) {
  const queryClient = useQueryClient();
  const [isLabelSelectorOpen, setIsLabelSelectorOpen] = useState(false);
  const [isAddingNewLabel, setIsAddingNewLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#4361ee");
  const [searchTerm, setSearchTerm] = useState("");
  const [removingLabelId, setRemovingLabelId] = useState<number | null>(null);
  const [addingLabelId, setAddingLabelId] = useState<number | null>(null);
  const newLabelInputRef = useRef<HTMLInputElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const addLabelMutation = useAddLabel();
  const removeLabelMutation = useDeleteTaskLabel();
  const addTaskLabelMutation = useAddTaskLabel();

  // Auto-focus input when opening search or creating a new label
  useEffect(() => {
    if (isAddingNewLabel && newLabelInputRef.current) {
      newLabelInputRef.current.focus();
    } else if (isLabelSelectorOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isAddingNewLabel, isLabelSelectorOpen]);

  // Close selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsLabelSelectorOpen(false);
        setIsAddingNewLabel(false);
        setSearchTerm("");
      }
    };

    if (isLabelSelectorOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLabelSelectorOpen]);

  // Handle keyboard shortcuts for the selector
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLabelSelectorOpen && e.key === "Escape") {
        setIsLabelSelectorOpen(false);
        setIsAddingNewLabel(false);
        setSearchTerm("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLabelSelectorOpen]);

  // Get existing label IDs for the task
  const existingLabelIds = taskLabels.map((tl) => tl.labelId);

  // Filter labels based on search term
  const filteredLabels = allLabels?.filter((label) =>
    label.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a label to the task
  const handleAddTaskLabel = (labelId: number) => {
    // Check if label is already attached
    if (existingLabelIds.includes(labelId)) return;

    setAddingLabelId(labelId);

    addTaskLabelMutation
      .mutateAsync({
        taskId: taskId,
        labelId: labelId,
      })
      .then(() => {
        // Refresh the task data
        queryClient.invalidateQueries({ queryKey: ["task", taskId] });
        queryClient.invalidateQueries({ queryKey: ["taskLabels", taskId] });
        setSearchTerm("");
      })
      .finally(() => {
        setAddingLabelId(null);
      });
  };

  const handleCreateNewLabel = () => {
    if (!newLabelName.trim()) return;

    addLabelMutation
      .mutateAsync({
        name: newLabelName.trim(),
        color: newLabelColor.replace("#", ""), // Remove # prefix if API requires
      })
      .then((newLabel) => {
        // After creating the label, add it to the task
        handleAddTaskLabel(newLabel.id!);

        // Reset the form
        setNewLabelName("");
        setIsAddingNewLabel(false);

        // Refresh labels list
        queryClient.invalidateQueries({ queryKey: ["labels"] });
      });
  };

  const handleRemoveLabel = (labelId: number) => {
    setRemovingLabelId(labelId);

    // Find the specific taskLabel entry to delete
    const taskLabelEntry = taskLabels?.find(
      (tl) => tl.taskId === taskId && tl.labelId === labelId
    );

    if (taskLabelEntry) {
      removeLabelMutation
        .mutateAsync(taskLabelEntry)
        .then(() => {
          // Refresh the task labels data
          queryClient.invalidateQueries({ queryKey: ["taskLabels", taskId] });
          queryClient.invalidateQueries({ queryKey: ["task", taskId] });
        })
        .finally(() => {
          setRemovingLabelId(null);
        });
    }
  };

  // Helper function to get label info by ID
  const getLabelInfo = (labelId: number) => {
    if (!allLabels) return null;
    return allLabels.find((l) => l.id === labelId);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="bg-indigo-100 rounded-md p-1.5">
            <FaTags className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="ml-2 text-md font-medium text-gray-700">Labels</h3>
        </div>
        <motion.button
          onClick={() => setIsLabelSelectorOpen(!isLabelSelectorOpen)}
          className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors flex items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus className="w-3 h-3 mr-1.5" />
          Add label
        </motion.button>
      </div>

      {/* Label Selector Dropdown */}
      <AnimatePresence>
        {isLabelSelectorOpen && (
          <motion.div
            ref={selectorRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 w-80 bg-white z-10 rounded-lg shadow-lg border border-gray-200 p-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-700">
                {isAddingNewLabel ? "Create new label" : "Select a label"}
              </h4>
              <button
                onClick={() => {
                  setIsLabelSelectorOpen(false);
                  setIsAddingNewLabel(false);
                  setSearchTerm("");
                }}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            {!isAddingNewLabel ? (
              <>
                {/* Search input */}
                <div className="relative mb-3">
                  <FaSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={12}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search labels..."
                    className="w-full pl-8 pr-3 py-2 text-sm border rounded-md"
                  />
                </div>

                {/* Label list */}
                <div className="max-h-48 overflow-y-auto mb-3">
                  {filteredLabels && filteredLabels.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {filteredLabels.map((label) => {
                        const { colorHex, bgColor, textColor } =
                          processLabelColor(label.color || "");
                        const isAttached = existingLabelIds.includes(label.id!);
                        const isAdding = addingLabelId === label.id;

                        return (
                          <motion.button
                            key={label.id}
                            onClick={() =>
                              !isAttached &&
                              !isAdding &&
                              handleAddTaskLabel(label.id!)
                            }
                            disabled={isAttached || isAdding}
                            className={`px-2 py-2 text-xs rounded-md flex items-center justify-between ${
                              isAttached ? "opacity-70" : ""
                            }`}
                            style={{
                              backgroundColor: isAttached
                                ? bgColor
                                : `${colorHex}15`,
                              color: textColor,
                            }}
                            whileHover={
                              !isAttached && !isAdding ? { scale: 1.02 } : {}
                            }
                            whileTap={
                              !isAttached && !isAdding ? { scale: 0.98 } : {}
                            }
                          >
                            <span className="flex items-center overflow-hidden">
                              <span
                                className="h-3 w-3 rounded-full flex-shrink-0 mr-1.5"
                                style={{ backgroundColor: colorHex }}
                              ></span>
                              <span className="truncate">{label.name}</span>
                            </span>
                            {isAttached && <FaCheck size={10} />}
                            {isAdding && (
                              <FaSpinner className="animate-spin" size={10} />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-gray-500 text-sm">
                      {searchTerm
                        ? "No matching labels found"
                        : "No labels available"}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <button
                    onClick={() => setIsAddingNewLabel(true)}
                    className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm rounded-md text-gray-700 flex items-center justify-center transition-colors"
                  >
                    <FaPalette className="mr-1.5 text-indigo-500" size={12} />
                    Create a new label
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Label name input */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Label name
                  </label>
                  <input
                    ref={newLabelInputRef}
                    type="text"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    placeholder="Enter label name"
                    className="w-full px-3 py-2 text-sm rounded-md border focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:outline-none"
                  />
                </div>

                {/* Color selection */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Label color
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {COLOR_PALETTE.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewLabelColor(color)}
                        className={`w-6 h-6 rounded-full transition-all ${
                          newLabelColor === color
                            ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  <div className="flex items-center mt-2">
                    <input
                      type="color"
                      value={newLabelColor}
                      onChange={(e) => setNewLabelColor(e.target.value)}
                      className="w-8 h-8 p-0 rounded border cursor-pointer"
                    />
                    <span className="ml-2 text-xs text-gray-500">
                      Or pick a custom color
                    </span>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Preview
                  </label>
                  <div className="p-4 bg-gray-50 rounded-md flex justify-center">
                    {newLabelName && (
                      <span
                        className="px-3 py-1 text-sm rounded-full"
                        style={{
                          backgroundColor: `${newLabelColor}20`,
                          color: newLabelColor,
                          border: `1px solid ${newLabelColor}40`,
                        }}
                      >
                        <span
                          className="inline-block h-2 w-2 rounded-full mr-1.5"
                          style={{ backgroundColor: newLabelColor }}
                        ></span>
                        {newLabelName}
                      </span>
                    )}
                    {!newLabelName && (
                      <span className="text-gray-400 text-sm">
                        Enter a label name to see preview
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setIsAddingNewLabel(false)}
                    className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateNewLabel}
                    disabled={
                      !newLabelName.trim() || addLabelMutation.isPending
                    }
                    className={`px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center ${
                      !newLabelName.trim() || addLabelMutation.isPending
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {addLabelMutation.isPending && (
                      <FaSpinner className="animate-spin mr-2" size={12} />
                    )}
                    Create label
                  </button>
                </div>
              </motion.div>
            )}

            <div className="mt-3 pt-2 text-xs text-gray-400 text-center">
              Press{" "}
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600">
                Esc
              </kbd>{" "}
              to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing Labels */}
      <div className="flex flex-wrap gap-2">
        {taskLabels && taskLabels.length > 0 ? (
          taskLabels.map((taskLabel) => {
            const labelInfo = getLabelInfo(taskLabel.labelId);
            if (!labelInfo) return null;

            const { colorHex, bgColor, textColor } = processLabelColor(
              labelInfo.color || ""
            );
            const isRemoving = removingLabelId === taskLabel.labelId;

            return (
              <motion.span
                key={taskLabel.labelId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.03 }}
                className="px-3 py-1.5 text-sm rounded-full flex items-center justify-between gap-2"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                }}
              >
                <div className="flex items-center max-w-[150px]">
                  <span
                    className="h-2 w-2 rounded-full mr-1.5 flex-shrink-0"
                    style={{ backgroundColor: colorHex }}
                  ></span>
                  <span className="truncate">{labelInfo.name}</span>
                </div>
                <button
                  onClick={() =>
                    !isRemoving && handleRemoveLabel(taskLabel.labelId)
                  }
                  disabled={isRemoving}
                  className="text-opacity-60 hover:text-opacity-100 focus:outline-none"
                  title="Remove label"
                >
                  {isRemoving ? (
                    <FaSpinner className="animate-spin" size={10} />
                  ) : (
                    <FaTimes size={10} />
                  )}
                </button>
              </motion.span>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center text-gray-500 text-sm px-4 py-3 rounded-md w-full bg-gray-50 border border-dashed border-gray-200"
          >
            <FaInfoCircle className="w-4 h-4 mr-2 text-gray-400" />
            No labels attached to this task
          </motion.div>
        )}
      </div>
    </div>
  );
}
