import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormData } from "../../schemas/taskSchema";
import { useCategories } from "../../hooks/useCategories";
import { useLabels } from "../../hooks/useLabels";
import Button from "../common/Button";
import {
  FaCalendarAlt,
  FaEdit,
  FaExclamationTriangle,
  FaEye,
  FaFlag,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MarkdownRenderer } from "../common/MarkdownRenderer";

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  isLoading?: boolean;
  initialData?: TaskFormData;
}

export function TaskForm({
  onSubmit,
  isLoading = false,
  initialData,
}: TaskFormProps) {
  const { data: categories } = useCategories();
  const { data: labels } = useLabels();
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialData?.dueDate ? new Date(initialData.dueDate) : null
  );
  const [selectedPriority, setSelectedPriority] = useState<string>(
    initialData?.priority || "NORMAL"
  );

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      categoryId: 0,
      isCompleted: false,
      labelIds: [],
      priority: "NORMAL",
    },
  });

  const onFormSubmit = (data: TaskFormData) => {
    // Add due date and priority to the form data
    const enhancedData = {
      ...data,
      dueDate: selectedDate ? selectedDate.toISOString() : undefined,
      priority: selectedPriority,
    };
    onSubmit(enhancedData);
  };

  // Watch for changes to get the current form values
  const formValues = watch();

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      {/* Title field with character counter */}
      <div className="space-y-1">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="title"
            type="text"
            {...register("title")}
            className={`w-full px-3 py-2 border rounded-lg text-sm shadow-sm transition-all duration-200 ease-in-out ${
              errors.title
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
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
          className="block text-sm font-medium text-gray-700"
        >
          Description
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
        {isPreviewMode ? (
          /* Preview mode */
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
          /* Edit mode */
          <div className="relative">
            <textarea
              id="description"
              {...register("description")}
              className={`w-full px-3 py-2 border rounded-lg text-sm shadow-sm transition-all duration-200 ease-in-out min-h-[100px] resize-y ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
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
        <div className="text-xs text-gray-500 mt-1">
          You can use markdown syntax for formatting.
        </div>
      </div>

      {/* Due date picker */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <div className="relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            className="block text-sm font-medium text-gray-700"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
            {...register("categoryId", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
            className={`w-full px-3 py-2 border rounded-lg text-sm shadow-sm transition-all duration-200 appearance-none bg-white ${
              errors.categoryId
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
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
          <label className="block text-sm font-medium text-gray-700">
            Priority
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
        <label className="block text-sm font-medium text-gray-700">
          Labels
        </label>
        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 max-h-[150px] overflow-y-auto">
          <Controller
            name="labelIds"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {labels?.map((label) => {
                  const isSelected = field.value?.includes(Number(label.id));

                  let bgColor = isSelected ? "bg-indigo-500" : "bg-white";
                  let textColor = isSelected ? "text-white" : "text-gray-700";

                  if (isSelected) {
                    if (label.id === 1) bgColor = "bg-red-500";
                    else if (label.id === 2) bgColor = "bg-blue-500";
                    else if (label.id === 3) bgColor = "bg-green-500";
                    else if (label.id === 4) bgColor = "bg-yellow-500";
                  } else {
                    if (label.id === 1) textColor = "text-red-700";
                    else if (label.id === 2) textColor = "text-blue-700";
                    else if (label.id === 3) textColor = "text-green-700";
                    else if (label.id === 4) textColor = "text-yellow-700";
                  }

                  return (
                    <label
                      key={label.id}
                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all ${
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
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="isCompleted"
          {...register("isCompleted")}
          className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
        />
        <label htmlFor="isCompleted" className="ml-2 text-sm text-gray-700">
          Mark as completed
        </label>
      </div>

      {/* Form actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="!bg-indigo-600 !text-white hover:!bg-indigo-700 !py-2 !px-5"
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
          ) : initialData ? (
            "Update Task"
          ) : (
            "Create Task"
          )}
        </Button>
      </div>
    </form>
  );
}
