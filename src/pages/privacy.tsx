import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-gray-600 mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <p className="mb-6">
              This Privacy Policy describes how Flock ("we," "us," or "our")
              collects, uses, and shares your personal information when you use
              our campaign management platform (the "Service").
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              1. Information We Collect
            </h2>

            <h3 className="text-lg font-medium mt-6 mb-3">
              1.1 Information You Provide
            </h3>
            <p>We collect information you provide directly to us when you:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Create an account (name, email address, password)</li>
              <li>
                Complete your profile (profile picture, bio, contact
                information)
              </li>
              <li>
                Create and manage campaigns (campaign content, descriptions,
                images)
              </li>
              <li>
                Connect social media accounts (access tokens, account
                information)
              </li>
              <li>
                Communicate with us (support requests, feedback, survey
                responses)
              </li>
              <li>
                Subscribe to our services (payment information, billing details)
              </li>
            </ul>

            <h3 className="text-lg font-medium mt-6 mb-3">
              1.2 Information We Collect Automatically
            </h3>
            <p>
              When you use our Service, we automatically collect certain
              information, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Usage data (pages visited, features used, actions taken)</li>
              <li>
                Device information (IP address, browser type, operating system)
              </li>
              <li>Log data (access times, error reports, referral URLs)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and manage your account</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Protect the security and integrity of our Service</li>
              <li>Comply with legal obligations</li>
              <li>Personalize your experience and deliver relevant content</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              3. Sharing of Information
            </h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Service providers who perform services on our behalf</li>
              <li>
                Business partners with whom we jointly offer products or
                services
              </li>
              <li>
                Other users when you collaborate on campaigns (according to your
                sharing settings)
              </li>
              <li>
                Third-party platforms when you connect social media accounts
              </li>
              <li>
                Legal authorities when required by law or to protect our rights
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              4. Data Retention
            </h2>
            <p>
              We retain your information for as long as your account is active
              or as needed to provide you with our Service. We will also retain
              and use your information as necessary to comply with legal
              obligations, resolve disputes, and enforce our agreements.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              5. Your Rights and Choices
            </h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Accessing, correcting, or deleting your information</li>
              <li>
                Restricting or objecting to our processing of your information
              </li>
              <li>Requesting portability of your information</li>
              <li>Withdrawing consent where processing is based on consent</li>
            </ul>
            <p>
              You can exercise these rights by contacting us at
              privacy@flock.center.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              6. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar tracking technologies to collect
              information about your browsing activities. You can manage your
              cookie preferences through your browser settings, but this may
              affect your ability to use certain features of our Service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              7. Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information. However, no method of
              transmission over the Internet or electronic storage is 100%
              secure, so we cannot guarantee absolute security.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              8. International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your country of residence. These countries may have
              different data protection laws. We ensure appropriate safeguards
              are in place to protect your information in compliance with
              applicable laws.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              9. Children's Privacy
            </h2>
            <p>
              Our Service is not directed to children under the age of 16. We do
              not knowingly collect personal information from children. If you
              believe we have collected information from a child, please contact
              us immediately.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              10. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at privacy@flock.center.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
