import { UseFormRegister } from "react-hook-form";

interface FormFieldProps {
  label: string;
  id: string;
  type: string;
  error?: string;
  register: UseFormRegister<any>;
  name: string;
}

export default function FormField({
  label,
  id,
  type,
  error,
  register,
  name,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-lg text-sm shadow-sm transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 hover:border-gray-400 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 animate-bounce">{error}</p>
      )}
    </div>
  );
}
