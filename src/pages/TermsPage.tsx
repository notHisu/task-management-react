import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-gray-600 mb-6">Last Updated: March 7, 2025</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              1. Introduction
            </h2>
            <p className="mb-4">
              Welcome to our application. These Terms of Service ("Terms")
              govern your use of our website, services, and applications
              (collectively, the "Service"). By accessing or using the Service,
              you agree to be bound by these Terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              2. User Accounts
            </h2>
            <p className="mb-4">
              When you create an account with us, you must provide accurate,
              complete, and current information. You are responsible for
              safeguarding the password used to access the Service and for any
              activities under your account.
            </p>
            <p className="mb-4">
              You agree not to disclose your password to any third party. You
              must notify us immediately upon becoming aware of any breach of
              security or unauthorized use of your account.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              3. Acceptable Use
            </h2>
            <p className="mb-4">You agree not to use the Service:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                In any way that violates any applicable laws or regulations
              </li>
              <li>
                To impersonate or attempt to impersonate any person or entity
              </li>
              <li>
                To engage in any conduct that restricts or inhibits anyone's use
                of the Service
              </li>
              <li>
                To attempt to gain unauthorized access to any systems or
                networks
              </li>
              <li>To transmit any malware, spyware, or other malicious code</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              4. Intellectual Property Rights
            </h2>
            <p className="mb-4">
              The Service and its original content, features, and functionality
              are and will remain the exclusive property of our company and its
              licensors. The Service is protected by copyright, trademark, and
              other laws.
            </p>
            <p className="mb-4">
              Our trademarks and trade dress may not be used in connection with
              any product or service without the prior written consent of our
              company.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              5. Termination
            </h2>
            <p className="mb-4">
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including,
              without limitation, if you breach the Terms.
            </p>
            <p className="mb-4">
              Upon termination, your right to use the Service will immediately
              cease. If you wish to terminate your account, you may simply
              discontinue using the Service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="mb-4">
              In no event shall our company, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                Your access to or use of or inability to access or use the
                Service
              </li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>
                Unauthorized access, use or alteration of your transmissions or
                content
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              7. Changes to Terms
            </h2>
            <p className="mb-4">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will try to
              provide at least 30 days' notice prior to any new terms taking
              effect.
            </p>
            <p className="mb-4">
              By continuing to access or use our Service after those revisions
              become effective, you agree to be bound by the revised terms. If
              you do not agree to the new terms, please stop using the Service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              8. Governing Law
            </h2>
            <p className="mb-4">
              These Terms shall be governed and construed in accordance with the
              laws of [Your Country/State], without regard to its conflict of
              law provisions.
            </p>
            <p className="mb-4">
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights. If any provision of
              these Terms is held to be invalid or unenforceable by a court, the
              remaining provisions of these Terms will remain in effect.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              9. Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>By email: legal@example.com</li>
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
