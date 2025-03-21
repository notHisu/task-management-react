import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowUp,
  FaShieldAlt,
  FaPrint,
  FaChevronRight,
  FaRegCalendarAlt,
  FaLock,
  FaCookieBite,
  FaLink,
  FaUserShield,
  FaClipboard,
} from "react-icons/fa";

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sectionsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [copySuccess, setCopySuccess] = useState(false);

  // Track scroll position for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);

      // Determine active section based on scroll position
      const sectionIds = Object.keys(sectionsRef.current);
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const section = sectionsRef.current[id];
        if (section && section.getBoundingClientRect().top <= 100) {
          if (activeSection !== id) {
            setActiveSection(id);
          }
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  // Scroll to section when clicked in TOC
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = sectionsRef.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Copy page URL with section hash
  const copyLink = (sectionId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Handle print document
  const handlePrint = () => {
    window.print();
  };

  // Define sections for the Table of Contents
  const sections = [
    { id: "introduction", title: "Introduction", icon: <FaShieldAlt /> },
    {
      id: "information-collected",
      title: "Information We Collect",
      icon: <FaClipboard />,
    },
    {
      id: "information-usage",
      title: "How We Use Your Information",
      icon: <FaUserShield />,
    },
    { id: "cookies", title: "Cookies and Tracking", icon: <FaCookieBite /> },
    { id: "security", title: "Data Security", icon: <FaLock /> },
    { id: "third-party", title: "Third-Party Services", icon: <FaLink /> },
    { id: "your-rights", title: "Your Rights", icon: <FaUserShield /> },
    { id: "changes", title: "Changes to Policy", icon: <FaRegCalendarAlt /> },
    { id: "contact", title: "Contact Us", icon: <FaRegCalendarAlt /> },
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
          {/* Header with shield icon */}
          <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between print:bg-white print:text-black">
            <div className="flex items-center">
              <div className="bg-indigo-500 bg-opacity-30 rounded-full p-2 mr-3">
                <FaShieldAlt className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Privacy Policy
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="text-white hover:bg-indigo-500 rounded-full p-2 hidden sm:block print:hidden"
                title="Print Privacy Policy"
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
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center ${
                      activeSection === section.id
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2 opacity-70">{section.icon}</span>
                    <span>{section.title}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/terms"
                  className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
                >
                  <FaShieldAlt className="mr-2 h-4 w-4" />
                  Terms of Service
                </Link>
              </div>

              {copySuccess && (
                <div className="mt-4 p-2 bg-green-50 text-green-700 text-xs rounded">
                  Link copied to clipboard!
                </div>
              )}
            </div>

            {/* Main content */}
            <div className="p-6 flex-1 overflow-auto">
              <div className="prose prose-slate max-w-none">
                {/* Introduction */}
                <div
                  ref={(el) => (sectionsRef.current["introduction"] = el)}
                  id="introduction"
                  className="scroll-mt-16 group"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Introduction
                    </h2>
                    <button
                      onClick={() => copyLink("introduction")}
                      className="ml-2 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy link to this section"
                    >
                      <FaLink className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mb-4">
                    We respect your privacy and are committed to protecting your
                    personal data. This Privacy Policy explains how we collect,
                    use, and safeguard your information when you use our
                    service.
                  </p>
                </div>

                {/* Information We Collect */}
                <div
                  ref={(el) =>
                    (sectionsRef.current["information-collected"] = el)
                  }
                  id="information-collected"
                  className="pt-6 border-t border-gray-100 mt-6 scroll-mt-16 group"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Information We Collect
                    </h2>
                    <button
                      onClick={() => copyLink("information-collected")}
                      className="ml-2 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy link to this section"
                    >
                      <FaLink className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mb-4">
                    We may collect several types of information from and about
                    users of our website, including:
                  </p>
                  <ul className="list-none pl-0 mb-4 space-y-2">
                    {[
                      "Personal identifiers (such as name and email address)",
                      "Login credentials",
                      "Usage data and analytics information",
                      "Device and browser information",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-500 mr-2 mt-1 flex-shrink-0">
                          <FaChevronRight size={14} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How We Use Your Information */}
                <div
                  ref={(el) => (sectionsRef.current["information-usage"] = el)}
                  id="information-usage"
                  className="pt-6 border-t border-gray-100 mt-6 scroll-mt-16 group"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      How We Use Your Information
                    </h2>
                    <button
                      onClick={() => copyLink("information-usage")}
                      className="ml-2 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy link to this section"
                    >
                      <FaLink className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mb-4">We use the information we collect to:</p>
                  <ul className="list-none pl-0 mb-4 space-y-2">
                    {[
                      "Provide and maintain our service",
                      "Notify you about changes to our service",
                      "Allow you to participate in interactive features",
                      "Provide customer support",
                      "Monitor usage of our service",
                      "Detect, prevent, and address technical issues",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-500 mr-2 mt-1 flex-shrink-0">
                          <FaChevronRight size={14} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cookies and Tracking */}
                <div
                  ref={(el) => (sectionsRef.current["cookies"] = el)}
                  id="cookies"
                  className="pt-6 border-t border-gray-100 mt-6 scroll-mt-16 group"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Cookies and Tracking
                    </h2>
                    <button
                      onClick={() => copyLink("cookies")}
                      className="ml-2 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy link to this section"
                    >
                      <FaLink className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mb-4">
                    We use cookies and similar tracking technologies to track
                    activity on our service and hold certain information.
                    Cookies are files with small amount of data which may
                    include an anonymous unique identifier.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      You can instruct your browser to refuse all cookies or to
                      indicate when a cookie is being sent. However, if you do
                      not accept cookies, you may not be able to use some
                      portions of our service.
                    </p>
                  </div>
                </div>

                {/* Data Security */}
                <div
                  ref={(el) => (sectionsRef.current["security"] = el)}
                  id="security"
                  className="pt-6 border-t border-gray-100 mt-6 scroll-mt-16 group"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Data Security
                    </h2>
                    <button
                      onClick={() => copyLink("security")}
                      className="ml-2 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy link to this section"
                    >
                      <FaLink className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-1 mr-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <FaLock className="h-5 w-5 text-green-700" />
                      </div>
                    </div>
                    <p className="mb-4">
                      We implement appropriate security measures to protect your
                      personal information. However, no method of transmission
                      over the Internet or method of electronic storage is 100%
                      secure, and we cannot guarantee absolute security.
                    </p>
                  </div>
                </div>

                {/* Third-Party Services */}
                <div
                  ref={(el) => (sectionsRef.current["third-party"] = el)}
                  id="third-party"
                  className="pt-6 border-t border-gray-100 mt-6 scroll-mt-16 group"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Third-Party Services
                    </h2>
                    <button
                      onClick={() => copyLink("third-party")}
                      className="ml-2 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy link to this section"
                    >
                      <FaLink className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mb-4">
                    Our service may contain links to other websites that are not
                    operated by us. If you click on a third-party link, you will
                    be directed to that third party's site. We strongly advise
                    you to review the Privacy Policy of every site you visit.
                  </p>
                </div>

                {/* Your Rights */}
                <div
                  ref={(el) => (sectionsRef.current["your-rights"] = el)}
                  id="your-rights"
                  className="pt-6 border-t border-gray-100 mt-6 scroll-mt-16 group"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Your Rights
                    </h2>
                    <button
                      onClick={() => copyLink("your-rights")}
                      className="ml-2 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy link to this section"
                    >
                      <FaLink className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mb-4">
                    Depending on your location, you may have certain rights
                    regarding your personal data, including:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {[
                      "Right to access the personal data we hold about you",
                      "Right to request correction of your personal data",
                      "Right to request deletion of your personal data",
                      "Right to object to processing of your personal data",
                      "Right to data portability",
                      "Right to withdraw consent",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start bg-gray-50 p-3 rounded-md"
                      >
                        <span className="text-indigo-500 mr-2 mt-0.5 flex-shrink-0">
                          <FaUserShield size={14} />
                        </span>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Changes to Policy */}
                <div
                  ref={(el) => (sectionsRef.current["changes"] = el)}
                  id="changes"
                  className="pt-6 border-t border-gray-100 mt-6 scroll-mt-16 group"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Changes to This Privacy Policy
                    </h2>
                    <button
                      onClick={() => copyLink("changes")}
                      className="ml-2 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy link to this section"
                    >
                      <FaLink className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mb-4">
                    We may update our Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page and updating the "Last Updated" date.
                  </p>
                </div>

                {/* Contact Us */}
                <div
                  ref={(el) => (sectionsRef.current["contact"] = el)}
                  id="contact"
                  className="pt-6 border-t border-gray-100 mt-6 scroll-mt-16 group"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Contact Us
                    </h2>
                    <button
                      onClick={() => copyLink("contact")}
                      className="ml-2 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy link to this section"
                    >
                      <FaLink className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mb-4">
                    If you have any questions about this Privacy Policy, please
                    contact us:
                  </p>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
                    <div className="space-y-2">
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
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center print:hidden">
                <Link
                  to="/terms"
                  className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                >
                  <FaShieldAlt className="mr-2 h-4 w-4" />
                  Terms of Service
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
