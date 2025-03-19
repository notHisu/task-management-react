import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormData } from "../../schemas/taskSchema";
import { useCategories } from "../../hooks/useCategories";
import { useLabels } from "../../hooks/useLabels";
import FormField from "../common/FormElements/FormField";
import Button from "../common/Button";
import {
  FaCalendarAlt,
  FaExclamationTriangle,
  FaFlag,
  FaSave,
  FaTimes,
  FaUndo,
  FaCheck,
  FaHistory,
  FaInfoCircle,
  FaEdit,
  FaEye,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Task } from "../../types/Task";
import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { MarkdownRenderer } from "../common/MarkdownRenderer";

interface EditTaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  onFormChanged?: (changed: boolean) => void;
  isLoading?: boolean;
  initialData: Task;
}

export function EditTaskForm({
  onSubmit,
  onCancel,
  onFormChanged,
  isLoading = false,
  initialData,
}: EditTaskFormProps) {
  const { data: categories } = useCategories();
  const { data: labels } = useLabels();
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialData?.dueDate ? new Date(initialData.dueDate) : null
  );
  const [selectedPriority, setSelectedPriority] = useState<string>(
    initialData?.priority || "NORMAL"
  );
  const [showHistoryTooltip, setShowHistoryTooltip] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [fieldChanges, setFieldChanges] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Get formatted creation date
  const createdDate = initialData?.createdAt
    ? formatDistanceToNow(new Date(initialData.createdAt), { addSuffix: true })
    : "recently";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    watch,
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      categoryId: initialData?.categoryId || 0,
      isCompleted: initialData?.isCompleted || false,
      labelIds:
        initialData?.taskLabels?.map((tl) => tl.labelId as number) || [],
      priority: initialData?.priority || "NORMAL",
    },
  });

  // Track which fields have changed from their original values
  const formValues = watch();
  const title = watch("title");
  const description = watch("description");
  const categoryId = watch("categoryId");
  const isCompleted = watch("isCompleted");
  const labelIds = watch("labelIds");

  useEffect(() => {
    const changes: Record<string, boolean> = {};

    if (title !== initialData?.title) changes.title = true;
    if (description !== initialData?.description) changes.description = true;
    if (categoryId != initialData?.categoryId) changes.categoryId = true;
    if (isCompleted !== initialData?.isCompleted) changes.isCompleted = true;
    if (selectedPriority !== initialData?.priority) changes.priority = true;

    // Check if selected date differs from initial data
    const initialDateStr = initialData?.dueDate;
    const initialDate = initialDateStr
      ? new Date(initialDateStr).toDateString()
      : null;
    const selectedDateStr = selectedDate ? selectedDate.toDateString() : null;
    if (selectedDateStr !== initialDate) changes.dueDate = true;

    // Compare label arrays
    const initialLabelIds =
      initialData?.taskLabels?.map((tl) => tl.labelId) || [];
    const currentLabelIds = labelIds || [];
    if (
      JSON.stringify(initialLabelIds.sort()) !==
      JSON.stringify([...currentLabelIds].sort())
    ) {
      changes.labelIds = true;
    }

    if (onFormChanged) {
      onFormChanged(Object.keys(changes).length > 0);
    }

    setFieldChanges(changes);
    setHasUnsavedChanges(Object.keys(changes).length > 0);
  }, [
    title,
    description,
    categoryId,
    isCompleted,
    selectedDate,
    selectedPriority,
    labelIds,
    initialData,
    onFormChanged,
  ]);

  // Show confirmation dialog before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Focus first input on mount
  useEffect(() => {
    const titleInput = document.getElementById("title");
    if (titleInput) {
      titleInput.focus();
    }
  }, []);

  const onFormSubmit = (data: TaskFormData) => {
    // Add due date and priority to the form data
    const enhancedData = {
      ...data,
      dueDate: selectedDate ? selectedDate.toISOString() : undefined,
      priority: selectedPriority,
    };
    onSubmit(enhancedData);
  };

  // Reset form to initial values
  const handleReset = () => {
    reset({
      title: initialData?.title || "",
      description: initialData?.description || "",
      categoryId: initialData?.categoryId || 0,
      isCompleted: initialData?.isCompleted || false,
      labelIds:
        initialData?.taskLabels?.map((tl) => tl.labelId as number) || [],
    });
    setSelectedPriority(initialData?.priority || "NORMAL");
    setSelectedDate(
      initialData?.dueDate ? new Date(initialData.dueDate) : null
    );
  };

  // Get the appropriate field class based on whether it's been changed
  const getFieldClass = (fieldName: string) => {
    return fieldChanges[fieldName]
      ? "bg-yellow-50 border-yellow-300"
      : "bg-white border-gray-300";
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-5"
    >
      {/* Edit status header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <FaHistory size={14} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Editing Task</h3>
            <div className="flex items-center">
              <p className="text-xs text-gray-500">Created {createdDate}</p>
              <button
                type="button"
                className="ml-1 text-gray-400 hover:text-gray-600"
                onMouseEnter={() => setShowHistoryTooltip(true)}
                onMouseLeave={() => setShowHistoryTooltip(false)}
              >
                <FaInfoCircle size={12} />
              </button>
              <AnimatePresence>
                {showHistoryTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-10 mt-16 bg-white border border-gray-200 p-3 rounded-lg shadow-lg text-xs text-gray-700 w-64"
                  >
                    <p className="font-medium mb-1">Task History</p>
                    <p>
                      Created:{" "}
                      {new Date(initialData.createdAt || "").toLocaleString()}
                    </p>
                    {hasUnsavedChanges && (
                      <p className="mt-1 text-yellow-600">
                        <FaExclamationTriangle
                          className="inline mr-1"
                          size={12}
                        />
                        You have unsaved changes
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Changed fields status */}
        <AnimatePresence>
          {hasUnsavedChanges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-xs bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-md px-2 py-1"
            >
              {Object.keys(fieldChanges).length} field(s) changed
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title field with character counter */}
      <div className="space-y-1">
        <label
          htmlFor="title"
          className="text-sm font-medium text-gray-700 flex items-center justify-between"
        >
          <span>
            Title <span className="text-red-500">*</span>
          </span>
          {fieldChanges.title && (
            <span className="text-xs text-yellow-600 flex items-center">
              <FaExclamationTriangle size={10} className="mr-1" /> Modified
            </span>
          )}
        </label>
        <div className="relative">
          <input
            id="title"
            type="text"
            {...register("title")}
            className={`w-full px-3 py-2 border rounded-lg text-sm shadow-sm transition-all duration-200 ease-in-out ${
              errors.title
                ? "border-red-500 focus:ring-red-500"
                : `focus:ring-indigo-500 focus:border-indigo-500 ${getFieldClass(
                    "title"
                  )}`
            }`}
            placeholder="Enter task title"
            maxLength={100}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span
              className={`text-xs ${
                (formValues.title?.length || 0) > 80
                  ? "text-amber-500"
                  : "text-gray-400"
              }`}
            >
              {formValues.title?.length || 0}/100
            </span>
          </div>
        </div>
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description field with character counter and auto-expand */}
      <div className="space-y-1">
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700 flex items-center justify-between"
        >
          <span>Description</span>
          {fieldChanges.description && (
            <span className="text-xs text-yellow-600 flex items-center">
              <FaExclamationTriangle size={10} className="mr-1" /> Modified
            </span>
          )}
        </label>

        <button
          type="button"
          onClick={() => {
            setIsPreviewMode(!isPreviewMode);
          }}
          className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          {isPreviewMode ? (
            <>
              <FaEdit size={12} /> Edit
            </>
          ) : (
            <>
              <FaEye size={12} /> Preview
            </>
          )}
        </button>
        {isPreviewMode /* Preview mode */ ? (
          <div className="border rounded-lg px-3 py-2 min-h-[100px] bg-gray-50">
            {formValues.description ? (
              <MarkdownRenderer
                content={formValues.description}
                className="prose-sm text-gray-800 max-w-none"
              />
            ) : (
              <p className="text-gray-400 italic text-sm">Nothing to preview</p>
            )}
          </div>
        ) : (
          <div className="relative">
            <textarea
              id="description"
              {...register("description")}
              className={`w-full px-3 py-2 border rounded-lg text-sm shadow-sm transition-all duration-200 ease-in-out min-h-[100px] resize-y ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : `focus:ring-indigo-500 focus:border-indigo-500 ${getFieldClass(
                      "description"
                    )}`
              }`}
              placeholder="Describe your task here..."
              maxLength={1000}
            />
            <div className="absolute bottom-2 right-3 flex items-center pointer-events-none">
              <span
                className={`text-xs ${
                  (formValues.description?.length || 0) > 900
                    ? "text-amber-500"
                    : "text-gray-400"
                }`}
              >
                {formValues.description?.length || 0}/1000
              </span>
            </div>
          </div>
        )}

        {errors.description && (
          <p className="text-xs text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Due date picker */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
          <span>Due Date</span>
          {fieldChanges.dueDate && (
            <span className="text-xs text-yellow-600 flex items-center">
              <FaExclamationTriangle size={10} className="mr-1" /> Modified
            </span>
          )}
        </label>
        <div className="relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className={`w-full px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${getFieldClass(
              "dueDate"
            )}`}
            dateFormat="MMMM d, yyyy"
            minDate={new Date()}
            placeholderText="Select a due date (optional)"
            isClearable
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <FaCalendarAlt
              className="h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Two columns for category and priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category dropdown */}
        <div className="space-y-1">
          <label
            htmlFor="categoryId"
            className=" text-sm font-medium text-gray-700 flex items-center justify-between"
          >
            <span>
              Category <span className="text-red-500">*</span>
            </span>
            {fieldChanges.categoryId && (
              <span className="text-xs text-yellow-600 flex items-center">
                <FaExclamationTriangle size={10} className="mr-1" /> Modified
              </span>
            )}
          </label>
          <select
            id="categoryId"
            {...register("categoryId", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
            className={`w-full px-3 py-2 border rounded-lg text-sm shadow-sm transition-all duration-200 appearance-none ${
              errors.categoryId
                ? "border-red-500 focus:ring-red-500"
                : `focus:ring-indigo-500 focus:border-indigo-500 ${getFieldClass(
                    "categoryId"
                  )}`
            }`}
          >
            <option value="">Select a category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Priority selector */}
        <div className="space-y-1">
          <label className=" text-sm font-medium text-gray-700 flex items-center justify-between">
            <span>Priority</span>
            {fieldChanges.priority && (
              <span className="text-xs text-yellow-600 flex items-center">
                <FaExclamationTriangle size={10} className="mr-1" /> Modified
              </span>
            )}
          </label>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => setSelectedPriority("LOW")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                selectedPriority === "LOW"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <FaFlag className="h-3 w-3" />
                Low
              </div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPriority("NORMAL")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                selectedPriority === "NORMAL"
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <FaFlag className="h-3 w-3" />
                Normal
              </div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPriority("HIGH")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                selectedPriority === "HIGH"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <FaExclamationTriangle className="h-3 w-3" />
                High
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Labels selection with improved UI */}
      <div className="space-y-2">
        <label className=" text-sm font-medium text-gray-700 flex items-center justify-between">
          <span>Labels</span>
          {fieldChanges.labelIds && (
            <span className="text-xs text-yellow-600 flex items-center">
              <FaExclamationTriangle size={10} className="mr-1" /> Modified
            </span>
          )}
        </label>
        <div
          className={`p-3 border rounded-lg bg-gray-50 max-h-[150px] overflow-y-auto ${
            fieldChanges.labelIds
              ? "border-yellow-300 bg-yellow-50"
              : "border-gray-200"
          }`}
        >
          <Controller
            name="labelIds"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {labels?.map((label) => {
                  const isSelected = field.value?.includes(Number(label.id));

                  // Determine if this label's selection has changed from the initial state
                  const initialLabelIds =
                    initialData?.taskLabels?.map((tl) => tl.labelId) || [];
                  const wasSelected = initialLabelIds.includes(label.id);
                  const hasChanged = isSelected !== wasSelected;

                  let bgColor = isSelected ? "bg-indigo-500" : "bg-white";
                  let textColor = isSelected ? "text-white" : "text-gray-700";

                  // Add visual indication for changed state
                  if (hasChanged && isSelected) {
                    bgColor = "bg-amber-400";
                    textColor = "text-amber-900";
                  } else if (hasChanged && !isSelected) {
                    bgColor = "bg-gray-100";
                    textColor = "text-gray-500 line-through";
                  }

                  return (
                    <label
                      key={label.id}
                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all ${
                        hasChanged ? "border border-amber-300" : ""
                      } ${
                        isSelected
                          ? `${bgColor} ${textColor}`
                          : `hover:bg-gray-100 ${textColor}`
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={label.id}
                        checked={isSelected}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          const newValues = e.target.checked
                            ? [...(field.value || []), value]
                            : (field.value || []).filter((id) => id !== value);
                          field.onChange(newValues);
                        }}
                        className={`h-4 w-4 rounded ${
                          isSelected ? "opacity-0 absolute" : "text-indigo-600"
                        }`}
                      />
                      <span
                        className={`flex items-center ${
                          isSelected ? "" : "ml-6"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                        {label.name}
                        {hasChanged && (
                          <span className="ml-1 text-xs">
                            {isSelected ? "(added)" : "(removed)"}
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          />
        </div>
      </div>

      {/* Task completion checkbox */}
      <div className="flex items-center mt-4 p-3 border rounded-lg bg-gray-50">
        <input
          type="checkbox"
          id="isCompleted"
          {...register("isCompleted")}
          className={`h-4 w-4 rounded border-gray-300 focus:ring-indigo-500 ${
            fieldChanges.isCompleted ? "bg-yellow-100 border-yellow-400" : ""
          }`}
        />
        <label
          htmlFor="isCompleted"
          className="ml-2 text-sm text-gray-700 flex items-center"
        >
          Mark as completed
          {fieldChanges.isCompleted && (
            <span className="ml-2 text-xs text-yellow-600 flex items-center">
              <FaExclamationTriangle size={10} className="mr-1" /> Modified
            </span>
          )}
        </label>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Form actions */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div>
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FaUndo className="mr-2" size={14} /> Reset Changes
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors flex items-center"
          >
            <FaTimes className="mr-2" size={14} /> Cancel
          </button>

          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            className={`!bg-indigo-600 !text-white hover:!bg-indigo-700 !py-2 !px-5 ${
              !hasUnsavedChanges ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading || isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FaSave size={14} /> Save Changes
              </span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
