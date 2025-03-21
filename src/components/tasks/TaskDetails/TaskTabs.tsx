type TabKey = "details" | "attachments" | "comments";

interface TaskTabsProps {
  selectedTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function TaskTabs({ selectedTab, onTabChange }: TaskTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-6">
        <button
          onClick={() => onTabChange("details")}
          className={`py-3 border-b-2 font-medium text-sm ${
            selectedTab === "details"
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <span className="hidden sm:inline">Task </span>Details
          <span className="ml-1 text-xs text-gray-400">(1)</span>
        </button>
        <button
          onClick={() => onTabChange("attachments")}
          className={`py-3 border-b-2 font-medium text-sm ${
            selectedTab === "attachments"
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Attachments
          <span className="ml-1 text-xs text-gray-400">(2)</span>
        </button>
        <button
          onClick={() => onTabChange("comments")}
          className={`py-3 border-b-2 font-medium text-sm ${
            selectedTab === "comments"
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Comments
          <span className="ml-1 text-xs text-gray-400">(3)</span>
        </button>
      </nav>
    </div>
  );
}
