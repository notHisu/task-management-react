import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowUp,
  FaBook,
  FaCheck,
  FaChevronDown,
  FaChevronRight,
  FaPrint,
  FaRegCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sectionsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Track scroll position to show/hide back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section when clicked in TOC
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = sectionsRef.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Toggle section visibility
  const toggleSection = (sectionId: string) => {
    if (activeSection === sectionId) {
      setActiveSection(null);
    } else {
      setActiveSection(sectionId);
    }
  };

  // Handle print document
  const handlePrint = () => {
    window.print();
  };

  // Define sections for the Table of Contents
  const sections = [
    { id: "introduction", title: "1. Introduction" },
    { id: "accounts", title: "2. User Accounts" },
    { id: "acceptable-use", title: "3. Acceptable Use" },
    { id: "intellectual-property", title: "4. Intellectual Property Rights" },
    { id: "termination", title: "5. Termination" },
    { id: "liability", title: "6. Limitation of Liability" },
    { id: "changes", title: "7. Changes to Terms" },
    { id: "governing-law", title: "8. Governing Law" },
    { id: "contact", title: "9. Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-xl overflow-hidden print:shadow-none"
        >
          {/* Header with document icon */}
          <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between print:bg-white print:text-black">
            <div className="flex items-center">
              <div className="bg-indigo-500 bg-opacity-30 rounded-full p-2 mr-3">
                <FaBook className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Terms of Service
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="text-white hover:bg-indigo-500 rounded-full p-2 hidden sm:block print:hidden"
                title="Print Terms"
              >
                <FaPrint className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Last updated badge */}
          <div className="border-b border-gray-200">
            <div className="flex items-center px-6 py-3 bg-gray-50">
              <FaRegCalendarAlt className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-500">
                Last Updated: March 7, 2025
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row print:block">
            {/* Table of contents sidebar */}
            <div className="md:w-64 bg-gray-50 p-5 border-r border-gray-200 shrink-0 print:hidden">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Contents
              </h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeSection === section.id
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/privacy"
                  className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
                >
                  <FaShieldAlt className="mr-2 h-4 w-4" />
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Main content */}
            <div className="p-6 flex-1 overflow-auto">
              <div className="prose prose-slate max-w-none">
                {/* Introduction */}
                <div
                  ref={(el) => (sectionsRef.current["introduction"] = el)}
                  className="scroll-mt-16"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      1. Introduction
                    </h2>
                  </div>
                  <p className="mb-4">
                    Welcome to our application. These Terms of Service ("Terms")
                    govern your use of our website, services, and applications
                    (collectively, the "Service"). By accessing or using the
                    Service, you agree to be bound by these Terms.
                  </p>
                </div>

                {/* User Accounts */}
                <div
                  ref={(el) => (sectionsRef.current["accounts"] = el)}
                  className="pt-6 scroll-mt-16"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      2. User Accounts
                    </h2>
                  </div>
                  <p className="mb-4">
                    When you create an account with us, you must provide
                    accurate, complete, and current information. You are
                    responsible for safeguarding the password used to access the
                    Service and for any activities under your account.
                  </p>
                  <p className="mb-4">
                    You agree not to disclose your password to any third party.
                    You must notify us immediately upon becoming aware of any
                    breach of security or unauthorized use of your account.
                  </p>
                </div>

                {/* Acceptable Use */}
                <div
                  ref={(el) => (sectionsRef.current["acceptable-use"] = el)}
                  className="pt-6 scroll-mt-16"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      3. Acceptable Use
                    </h2>
                  </div>
                  <p className="mb-4">You agree not to use the Service:</p>
                  <ul className="list-none pl-0 mb-4 space-y-2">
                    {[
                      "In any way that violates any applicable laws or regulations",
                      "To impersonate or attempt to impersonate any person or entity",
                      "To engage in any conduct that restricts or inhibits anyone's use of the Service",
                      "To attempt to gain unauthorized access to any systems or networks",
                      "To transmit any malware, spyware, or other malicious code",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1 flex-shrink-0">
                          <FaCheck size={14} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Intellectual Property Rights */}
                <div
                  ref={(el) =>
                    (sectionsRef.current["intellectual-property"] = el)
                  }
                  className="pt-6 border-t border-gray-100 scroll-mt-16"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      4. Intellectual Property Rights
                    </h2>
                  </div>
                  <p className="mb-4">
                    The Service and its original content, features, and
                    functionality are and will remain the exclusive property of
                    our company and its licensors. The Service is protected by
                    copyright, trademark, and other laws.
                  </p>
                  <p className="mb-4">
                    Our trademarks and trade dress may not be used in connection
                    with any product or service without the prior written
                    consent of our company.
                  </p>
                </div>

                {/* Termination */}
                <div
                  ref={(el) => (sectionsRef.current["termination"] = el)}
                  className="pt-6 border-t border-gray-100 scroll-mt-16"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      5. Termination
                    </h2>
                  </div>
                  <p className="mb-4">
                    We may terminate or suspend your account immediately,
                    without prior notice or liability, for any reason
                    whatsoever, including, without limitation, if you breach the
                    Terms.
                  </p>
                  <p className="mb-4">
                    Upon termination, your right to use the Service will
                    immediately cease. If you wish to terminate your account,
                    you may simply discontinue using the Service.
                  </p>
                </div>

                {/* Limitation of Liability */}
                <div
                  ref={(el) => (sectionsRef.current["liability"] = el)}
                  className="pt-6 border-t border-gray-100 scroll-mt-16"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      6. Limitation of Liability
                    </h2>
                  </div>
                  <p className="mb-4">
                    In no event shall our company, nor its directors, employees,
                    partners, agents, suppliers, or affiliates, be liable for
                    any indirect, incidental, special, consequential or punitive
                    damages, including without limitation, loss of profits,
                    data, use, goodwill, or other intangible losses, resulting
                    from:
                  </p>
                  <ul className="list-none pl-0 mb-4 space-y-2">
                    {[
                      "Your access to or use of or inability to access or use the Service",
                      "Any conduct or content of any third party on the Service",
                      "Any content obtained from the Service",
                      "Unauthorized access, use or alteration of your transmissions or content",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2 mt-1 flex-shrink-0">
                          <FaChevronRight size={14} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Changes to Terms */}
                <div
                  ref={(el) => (sectionsRef.current["changes"] = el)}
                  className="pt-6 border-t border-gray-100 scroll-mt-16"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      7. Changes to Terms
                    </h2>
                  </div>
                  <p className="mb-4">
                    We reserve the right, at our sole discretion, to modify or
                    replace these Terms at any time. If a revision is material,
                    we will try to provide at least 30 days' notice prior to any
                    new terms taking effect.
                  </p>
                  <p className="mb-4">
                    By continuing to access or use our Service after those
                    revisions become effective, you agree to be bound by the
                    revised terms. If you do not agree to the new terms, please
                    stop using the Service.
                  </p>
                </div>

                {/* Governing Law */}
                <div
                  ref={(el) => (sectionsRef.current["governing-law"] = el)}
                  className="pt-6 border-t border-gray-100 scroll-mt-16"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      8. Governing Law
                    </h2>
                  </div>
                  <p className="mb-4">
                    These Terms shall be governed and construed in accordance
                    with the laws of [Your Country/State], without regard to its
                    conflict of law provisions.
                  </p>
                  <p className="mb-4">
                    Our failure to enforce any right or provision of these Terms
                    will not be considered a waiver of those rights. If any
                    provision of these Terms is held to be invalid or
                    unenforceable by a court, the remaining provisions of these
                    Terms will remain in effect.
                  </p>
                </div>

                {/* Contact Us */}
                <div
                  ref={(el) => (sectionsRef.current["contact"] = el)}
                  className="pt-6 border-t border-gray-100 scroll-mt-16"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      9. Contact Us
                    </h2>
                  </div>
                  <p className="mb-4">
                    If you have any questions about these Terms, please contact
                    us:
                  </p>
                  <div className="space-y-2 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="flex items-center">
                      <span className="font-medium w-20">Email:</span>
                      <a
                        href="mailto:letrunghoahieu@gmail.com"
                        className="text-indigo-600 hover:underline"
                      >
                        letrunghoahieu@gmail.com
                      </a>
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium w-20">Phone:</span>
                      <a
                        href="tel:+11234567890"
                        className="text-indigo-600 hover:underline"
                      >
                        (123) 456-7890
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center print:hidden">
                <Link
                  to="/privacy"
                  className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                >
                  <FaShieldAlt className="mr-2 h-4 w-4" />
                  Privacy Policy
                </Link>

                <Link
                  to="/"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  &larr; Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-6 bottom-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg print:hidden"
          aria-label="Back to top"
        >
          <FaArrowUp />
        </motion.button>
      )}
    </div>
  );
}
