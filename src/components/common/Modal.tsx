import { ReactNode, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "small" | "medium" | "large" | "full";
  preventClose?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
  position?: "center" | "top";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "medium",
  preventClose = false,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  showCloseButton = true,
  position = "center",
  className = "",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Get position styles
  const getPosition = () => {
    switch (position) {
      case "top":
        return "items-start mt-16";
      case "center":
      default:
        return "items-center";
    }
  };

  // Close on ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape || preventClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEscape, preventClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus trap inside modal
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Find all focusable elements in the modal
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    // Focus first element when modal opens
    firstElement.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab - if on first element, go to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab - if on last element, go to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [isOpen]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && !preventClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Using React Portal to render the modal at the document body level
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex justify-center ${getPosition()} overflow-y-auto overflow-x-hidden`}
          role="dialog"
          aria-modal="true"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: position === "top" ? -20 : 0,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === "top" ? -20 : 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.2,
            }}
            className={`relative z-50 w-full max-w-fit m-4 bg-white rounded-lg shadow-xl ${className}`}
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            {/* Header - only shown if title is provided */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                {showCloseButton && !preventClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 -mr-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label="Close modal"
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className={`p-6 ${title ? "" : "pt-10"}`}>
              {/* Close button at top right if no header */}
              {!title && showCloseButton && !preventClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Close modal"
                >
                  <FaTimes size={16} />
                </button>
              )}

              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
