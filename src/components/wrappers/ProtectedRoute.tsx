import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { ReactNode } from "react";
import { Navigate } from "react-router";
import { api } from "../../../convex/_generated/api";

interface ProtectedRouteProps {
  children: ReactNode;
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoaded: isUserLoaded } = useUser();

  // Mock user data instead of querying
  const userData = user
    ? {
        _id: "mock-id",
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        tokenIdentifier: user.id,
        _creationTime: Date.now(),
      }
    : null;

  // Mock subscription status
  const subscriptionStatus = { hasActiveSubscription: true };

  // Step 1: Wait for Clerk to initialize
  if (!isUserLoaded) {
    return <LoadingSpinner />;
  }

  // Step 2: Check if user is authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Step 3: Check if user exists
  if (userData === null) {
    return <Navigate to="/" replace />;
  }

  // Skip subscription check for now and always allow access
  // In a real implementation, we would check subscription status

  // All checks passed, render protected content
  return <>{children}</>;
}
