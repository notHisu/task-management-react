import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  type = "button",
  onClick,
  className = "",
  disabled = false,
  isLoading = false,
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full py-2 text-white bg-gray-900 rounded-lg font-medium text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
