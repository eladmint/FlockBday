import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function NotSubscribed() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Upgrade Your Account
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Get access to all features by subscribing to one of our plans
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-7xl">
            <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Monthly Plan
              </h3>
              <div className="flex items-baseline mb-4">
                <span className="text-5xl font-bold tracking-tight text-gray-900">
                  $29
                </span>
                <span className="text-lg text-gray-600 ml-1">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <ul className="space-y-4 text-gray-600 mb-6">
                <li className="flex items-center">✓ Unlimited campaigns</li>
                <li className="flex items-center">✓ Advanced analytics</li>
                <li className="flex items-center">✓ Priority support</li>
              </ul>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Subscribe Now
              </Button>
            </div>

            <div className="p-8 bg-white border-2 border-indigo-600 rounded-2xl shadow-md relative">
              <div className="absolute -top-4 right-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  Save 17%
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Yearly Plan
              </h3>
              <div className="flex items-baseline mb-4">
                <span className="text-5xl font-bold tracking-tight text-gray-900">
                  $290
                </span>
                <span className="text-lg text-gray-600 ml-1">/year</span>
              </div>
              <p className="text-gray-600 mb-6">
                Best value for long-term commitment
              </p>
              <ul className="space-y-4 text-gray-600 mb-6">
                <li className="flex items-center">✓ Everything in monthly</li>
                <li className="flex items-center">✓ 2 months free</li>
                <li className="flex items-center">
                  ✓ Early access to new features
                </li>
              </ul>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
