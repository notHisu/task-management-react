import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormData } from "../../schemas/taskSchema";
import { useCategories } from "../../hooks/useCategories";
import { useLabels } from "../../hooks/useLabels";
import Button from "../common/Button";
import FormField from "../common/FormElements/FormField";
import { useState } from "react";

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  isLoading: boolean;
}

export function TaskForm({ onSubmit, isLoading }: TaskFormProps) {
  const { data: categories } = useCategories();
  const { data: labels } = useLabels();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      isCompleted: false,
      labelIds: [],
    },
    shouldUnregister: false,
  });

  const processFormData = (data: TaskFormData) => {
    console.log("Form data before submission:", data);
    handleFormSubmit(data);
  };

  const handleFormSubmit = async (data: TaskFormData) => {
    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmitting(true);

    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(processFormData)} className="space-y-4">
      <FormField
        label="Title"
        id="title"
        type="text"
        name="title"
        register={register}
        error={errors.title?.message}
      />

      <FormField
        label="Description"
        id="description"
        type="text"
        name="description"
        register={register}
        error={errors.description?.message}
      />

      <div>
        <label
          htmlFor="categoryId"
          className="text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="categoryId"
          {...register("categoryId", {
            setValueAs: (value) => (value === "" ? null : Number(value)),
          })}
          className="w-full px-3 py-2 border rounded-lg text-sm shadow-sm transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 hover:border-gray-400"
        >
          <option value="">Select a category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Labels</label>
        <div className="flex flex-wrap gap-2">
          <Controller
            name="labelIds"
            control={control}
            render={({ field }) => (
              <>
                {labels?.map((label) => (
                  <label key={label.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={label.id}
                      checked={field.value?.includes(Number(label.id))}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        const newValues = e.target.checked
                          ? [...(field.value || []), value]
                          : (field.value || []).filter((id) => id !== value);
                        field.onChange(newValues);
                      }}
                      className="h-4 w-4 text-indigo-600 rounded"
                    />
                    {label.name}
                  </label>
                ))}
              </>
            )}
          />
        </div>
      </div>

      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="isCompleted"
          {...register("isCompleted")}
          className="h-4 w-4 text-indigo-600 rounded mr-2"
        />
        <label
          htmlFor="isCompleted"
          className="text-sm font-medium text-gray-700"
        >
          Mark as completed
        </label>
      </div>

      <Button
        type="submit"
        disabled={isLoading || isSubmitting}
        isLoading={isLoading || isSubmitting}
      >
        {isLoading || isSubmitting ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
}
