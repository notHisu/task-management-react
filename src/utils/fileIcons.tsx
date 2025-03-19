import {
  FaFile,
  FaFileImage,
  FaFilePdf,
  FaFileAlt,
  FaFileCode,
} from "react-icons/fa";

export const getFileIcon = (fileType?: string) => {
  // If fileType is undefined or null, return default file icon
  if (!fileType) return <FaFile className="text-gray-400 mr-2" />;

  if (fileType.includes("image"))
    return <FaFileImage className="text-blue-400 mr-2" />;
  if (fileType.includes("pdf"))
    return <FaFilePdf className="text-red-400 mr-2" />;
  if (fileType.includes("text") || fileType.includes("document"))
    return <FaFileAlt className="text-yellow-400 mr-2" />;
  if (
    fileType.includes("code") ||
    fileType.includes("javascript") ||
    fileType.includes("html")
  )
    return <FaFileCode className="text-green-400 mr-2" />;
  return <FaFile className="text-gray-400 mr-2" />;
};
