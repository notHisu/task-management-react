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
