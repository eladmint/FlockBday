// Clerk configuration for Tempo environment

// Get the base URL from environment or use the Tempo URL
const BASE_URL = import.meta.env.VITE_BASE_URL || "";

// Clerk expects relative paths for these URLs
export const clerkPaths = {
  // Use relative paths as required by Clerk
  signIn: "/sign-in",
  signUp: "/sign-up",
  afterSignIn: "/dashboard",
  afterSignUp: "/dashboard",
};

// Export the publishable key for easy access
export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Development and production URLs
export const developmentUrl =
  "https://interesting-grothendieck5-78jl4.dev-2.tempolabs.ai";
export const productionUrl = "https://your-production-domain.com"; // Update with your actual production URL when available
