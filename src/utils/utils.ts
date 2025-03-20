import { Label } from "../types/Label";

// Format date utility function
export const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Time ago formatting
export const getTimeSince = (dateString?: string) => {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 86400);
  if (interval >= 1)
    return interval + (interval === 1 ? " day ago" : " days ago");

  interval = Math.floor(seconds / 3600);
  if (interval >= 1)
    return interval + (interval === 1 ? " hour ago" : " hours ago");

  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return interval + (interval === 1 ? " minute ago" : " minutes ago");

  return "just now";
};

export const bytesToSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
};

export function processLabelColor(color?: string, opacity: string = "33") {
  // Generate color code (adding # if needed)
  const colorHex = color?.startsWith("#") ? color : `#${color || "808080"}`;

  // Calculate light background with specified opacity
  const bgColor = `${colorHex}${opacity}`;

  // Calculate text color based on background brightness
  const r = parseInt(colorHex.slice(1, 3) || "80", 16);
  const g = parseInt(colorHex.slice(3, 5) || "80", 16);
  const b = parseInt(colorHex.slice(5, 7) || "80", 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const textColor = brightness > 128 ? "#1F2937" : "#FFFFFF";

  return {
    colorHex, // The normalized hex color with # prefix
    bgColor, // Background color with opacity
    textColor, // Contrasting text color
  };
}
