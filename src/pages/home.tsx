import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PricingCard } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/clerk-react";
import {
  Authenticated,
  Unauthenticated,
  useAction,
  useMutation,
  useQuery,
} from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../convex/_generated/api";
import { Megaphone, Users, BarChart } from "lucide-react";

const FEATURES = [
  {
    icon: "⚡️",
    title: "React + Vite",
    description:
      "Lightning-fast development with modern tooling and instant HMR",
  },
  {
    icon: "🔐",
    title: "Clerk Auth",
    description: "Secure authentication and user management out of the box",
  },
  {
    icon: "🚀",
    title: "Convex BaaS",
    description:
      "Real-time backend with automatic scaling and TypeScript support",
  },
  {
    icon: "💳",
    title: "Stripe",
    description: "Seamless payment integration for your SaaS",
  },
] as const;

const CAMPAIGN_FEATURES = [
  {
    icon: <Megaphone className="h-8 w-8 text-indigo-600" />,
    title: "Campaign Management",
    description: "Create and manage marketing campaigns with ease",
  },
  {
    icon: <Users className="h-8 w-8 text-indigo-600" />,
    title: "Team Collaboration",
    description: "Invite team members to collaborate on campaigns",
  },
  {
    icon: <BarChart className="h-8 w-8 text-indigo-600" />,
    title: "Performance Tracking",
    description: "Track campaign performance with detailed analytics",
  },
] as const;

function App() {
  const { user, isLoaded: isUserLoaded } = useUser();
  // Mock subscription status
  const subscriptionStatus = { hasActiveSubscription: false };
  const [products, setProducts] = useState(null);
  const navigate = useNavigate();

  // No need to store user in this mock implementation

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              Campaign Management Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-8">
              Create, manage, and collaborate on marketing campaigns with our
              powerful platform.
            </p>

            {!isUserLoaded ? (
              <div className="flex gap-4">
                <div className="px-8 py-3 w-[145px] h-[38px] rounded-lg bg-gray-200 animate-pulse"></div>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-4">
                <Unauthenticated>
                  <SignInButton mode="modal" signUpFallbackRedirectUrl="/">
                    <Button className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200">
                      Get Started
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Button
                    onClick={() => navigate("/campaigns")}
                    className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Go to Campaigns
                  </Button>
                </Authenticated>
              </div>
            )}
          </div>

          {/* Campaign Features */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Campaign Management Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {CAMPAIGN_FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="p-6 bg-gray-50 rounded-xl">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Pricing Section */}
          <section id="pricing" className="">
            <div className="flex flex-col items-center justify-center">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-lg text-gray-600">
                  Choose the plan that's right for you
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Free Plan
                  </h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">
                      $0
                    </span>
                    <span className="text-lg text-gray-600 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Perfect for getting started
                  </p>
                  <ul className="space-y-4 text-gray-600 mb-6">
                    <li className="flex items-center">✓ Up to 3 campaigns</li>
                    <li className="flex items-center">✓ Basic analytics</li>
                    <li className="flex items-center">✓ Community support</li>
                  </ul>
                  <button className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Get Started
                  </button>
                </div>

                <div className="p-8 bg-white border-2 border-indigo-600 rounded-2xl shadow-md relative">
                  <div className="absolute -top-4 right-8">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      Popular
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Pro Plan
                  </h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">
                      $29
                    </span>
                    <span className="text-lg text-gray-600 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">For growing businesses</p>
                  <ul className="space-y-4 text-gray-600 mb-6">
                    <li className="flex items-center">✓ Unlimited campaigns</li>
                    <li className="flex items-center">✓ Advanced analytics</li>
                    <li className="flex items-center">✓ Priority support</li>
                    <li className="flex items-center">✓ Team collaboration</li>
                  </ul>
                  <button className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Upgrade Now
                  </button>
                </div>

                <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Enterprise
                  </h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">
                      $99
                    </span>
                    <span className="text-lg text-gray-600 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">For large organizations</p>
                  <ul className="space-y-4 text-gray-600 mb-6">
                    <li className="flex items-center">✓ Everything in Pro</li>
                    <li className="flex items-center">✓ Custom integrations</li>
                    <li className="flex items-center">✓ Dedicated support</li>
                    <li className="flex items-center">✓ Advanced security</li>
                  </ul>
                  <button className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
