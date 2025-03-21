import { useState } from "react";
import { FaKeyboard } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export function KeyboardShortcutsCard() {
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <FaKeyboard className="mr-1.5 text-gray-500" /> Keyboard Shortcuts
        </h3>
        <button
          onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
          className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          {showKeyboardShortcuts ? "Hide" : "Show"}
        </button>
      </div>

      <AnimatePresence>
        {showKeyboardShortcuts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-gray-600 space-y-2 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span>Previous task</span>
              <kbd className="px-2 py-1 bg-white text-xs rounded border border-gray-300">
                ←
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Next task</span>
              <kbd className="px-2 py-1 bg-white text-xs rounded border border-gray-300">
                →
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Edit task</span>
              <kbd className="px-2 py-1 bg-white text-xs rounded border border-gray-300">
                E
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Toggle shortcuts</span>
              <kbd className="px-2 py-1 bg-white text-xs rounded border border-gray-300">
                K
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Tab navigation</span>
              <div className="flex space-x-1">
                <kbd className="px-2 py-1 bg-white text-xs rounded border border-gray-300">
                  1
                </kbd>
                <kbd className="px-2 py-1 bg-white text-xs rounded border border-gray-300">
                  2
                </kbd>
                <kbd className="px-2 py-1 bg-white text-xs rounded border border-gray-300">
                  3
                </kbd>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
