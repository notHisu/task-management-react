import { defineConfig } from "tailwindcss";
import plugin from "@tailwindcss/plugin";

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust based on your project structure
  ],
  theme: {
    // Define custom animations, colors, etc., if needed
    animation: {
      "fade-in": "fadeIn 0.5s ease-in-out",
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: "0", transform: "translateY(10px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        // Button Base
        ".btn": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "0.375rem", // rounded-md
          fontSize: "0.875rem", // text-sm
          fontWeight: "500", // font-medium
          transitionProperty: "colors",
          transitionDuration: "150ms",
          "&:focus-visible": {
            outline: "none",
            ringWidth: "2px",
            ringColor: "#1f2937", // gray-950
          },
          "&:disabled": {
            pointerEvents: "none",
            opacity: "0.5",
          },
        },
        // Button Variants
        ".btn-default": {
          backgroundColor: "#ffffff", // white
          color: "#1f2937", // gray-900
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // shadow-sm
          border: "1px solid #d1d5db", // border-gray-300
          "&:hover": { backgroundColor: "#f3f4f6" }, // hover:bg-gray-100
        },
        ".btn-primary": {
          backgroundColor: "#1f2937", // gray-900
          color: "#ffffff", // white
          "&:hover": { backgroundColor: "#374151" }, // hover:bg-gray-800
        },
        ".btn-destructive": {
          backgroundColor: "#ef4444", // red-500
          color: "#ffffff", // white
          "&:hover": { backgroundColor: "#dc2626" }, // hover:bg-red-600
        },
        // Card Base
        ".card": {
          display: "flex",
          flexDirection: "column",
          borderRadius: "0.5rem", // rounded-lg
          border: "1px solid #e5e7eb", // border-gray-200
          backgroundColor: "#ffffff", // bg-white
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // shadow-sm
          overflow: "hidden",
        },
        // Flex Utilities
        ".flex-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ".flex-between": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        // Add more utilities as needed (e.g., .form-group, .alert, etc.)
      });
    }),
  ],
});
