import { Link } from "react-router-dom";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-gray-600 mb-6">Last Updated: March 7, 2025</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              Introduction
            </h2>
            <p className="mb-4">
              We respect your privacy and are committed to protecting your
              personal data. This Privacy Policy explains how we collect, use,
              and safeguard your information when you use our service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              Information We Collect
            </h2>
            <p className="mb-4">
              We may collect several types of information from and about users
              of our website, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Personal identifiers (such as name and email address)</li>
              <li>Login credentials</li>
              <li>Usage data and analytics information</li>
              <li>Device and browser information</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              How We Use Your Information
            </h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide and maintain our service</li>
              <li>Notify you about changes to our service</li>
              <li>Allow you to participate in interactive features</li>
              <li>Provide customer support</li>
              <li>Monitor usage of our service</li>
              <li>Detect, prevent, and address technical issues</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              Cookies and Tracking
            </h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to track activity
              on our service and hold certain information. Cookies are files
              with small amount of data which may include an anonymous unique
              identifier.
            </p>
            <p className="mb-4">
              You can instruct your browser to refuse all cookies or to indicate
              when a cookie is being sent. However, if you do not accept
              cookies, you may not be able to use some portions of our service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              Data Security
            </h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your
              personal information. However, no method of transmission over the
              Internet or method of electronic storage is 100% secure, and we
              cannot guarantee absolute security.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              Third-Party Services
            </h2>
            <p className="mb-4">
              Our service may contain links to other websites that are not
              operated by us. If you click on a third-party link, you will be
              directed to that third party's site. We strongly advise you to
              review the Privacy Policy of every site you visit.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              Your Rights
            </h2>
            <p className="mb-4">
              Depending on your location, you may have certain rights regarding
              your personal data, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Right to access the personal data we hold about you</li>
              <li>Right to request correction of your personal data</li>
              <li>Right to request deletion of your personal data</li>
              <li>Right to object to processing of your personal data</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last Updated" date.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>By email: privacy@example.com</li>
              <li>By phone: (123) 456-7890</li>
            </ul>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              &larr; Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
