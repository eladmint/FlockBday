import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Terms of Use
          </h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-gray-600 mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using this platform, you accept and agree to be
              bound by the terms and provisions of this agreement. If you do not
              agree to abide by these terms, please do not use this service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              2. Description of Service
            </h2>
            <p>
              Flock provides a campaign management platform that allows users to
              create, manage, and collaborate on marketing campaigns. The
              service includes features for social media integration, team
              collaboration, and campaign analytics.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              3. User Accounts
            </h2>
            <p>
              To access certain features of the platform, you must register for
              an account. You agree to provide accurate information during the
              registration process and to keep your account credentials secure.
              You are responsible for all activities that occur under your
              account.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. User Content</h2>
            <p>
              You retain ownership of any content you create, upload, or share
              on the platform. By posting content, you grant us a non-exclusive,
              worldwide, royalty-free license to use, reproduce, and display
              your content in connection with providing and promoting the
              service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              5. Acceptable Use
            </h2>
            <p>You agree not to use the service to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Distribute malicious software or harmful content</li>
              <li>
                Attempt to gain unauthorized access to the service or its
                systems
              </li>
              <li>
                Engage in activities that could disable or overburden the
                service
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              6. Subscription and Payments
            </h2>
            <p>
              Some features of the service require a paid subscription. Payment
              terms are specified at the time of purchase. Subscriptions
              automatically renew unless canceled before the renewal date.
              Refunds are provided in accordance with our refund policy.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account if you
              violate these terms or engage in fraudulent or illegal activities.
              You may terminate your account at any time by following the
              instructions on the platform.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              8. Disclaimer of Warranties
            </h2>
            <p>
              The service is provided "as is" without warranties of any kind,
              either express or implied. We do not guarantee that the service
              will be uninterrupted, secure, or error-free.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              9. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for
              any indirect, incidental, special, consequential, or punitive
              damages resulting from your use of or inability to use the
              service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              10. Changes to Terms
            </h2>
            <p>
              We may modify these terms at any time. We will notify users of
              significant changes. Your continued use of the service after such
              modifications constitutes your acceptance of the updated terms.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              11. Governing Law
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with
              the laws of [Your Jurisdiction], without regard to its conflict of
              law provisions.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              12. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at
              support@flock.center.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
