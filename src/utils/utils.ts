export const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

export function processLabelColor(color?: string, opacity: number = 0.2) {
  // Default to gray if no color provided
  if (!color) color = "808080";

  // Remove # if present
  let cleanColor = color.startsWith("#") ? color.substring(1) : color;

  // Convert 3-digit hex to 6-digit hex if needed
  if (cleanColor.length === 3) {
    cleanColor = cleanColor
      .split("")
      .map((c) => c + c)
      .join("");
  }

  // Ensure we have a valid 6-digit hex
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanColor)) {
    cleanColor = "808080"; // Fallback to gray if invalid
  }

  // Add # prefix for standard format
  const colorHex = "#" + cleanColor;

  // Parse RGB values
  const r = parseInt(cleanColor.substring(0, 2), 16);
  const g = parseInt(cleanColor.substring(2, 4), 16);
  const b = parseInt(cleanColor.substring(4, 6), 16);

  // Calculate background color with opacity using rgba
  const bgColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;

  // Calculate text color based on brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const textColor = brightness > 0 ? "#000000" : "#FFFFFF";

  return {
    colorHex,
    bgColor,
    textColor,
  };
}
