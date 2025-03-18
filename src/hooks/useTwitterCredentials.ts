import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Hook to check if Twitter credentials are properly configured
 */
export function useTwitterCredentials() {
  // Query Twitter status from Convex
  const twitterStatus = useQuery(api.twitter.getTwitterStatus);

  // Add fallback for development/testing
  const fallbackStatus = {
    connected: false,
    username: "twitter_demo",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=twitter",
  };

  // Handle loading state and errors gracefully
  if (twitterStatus === undefined) {
    return {
      isConfigured: false,
      isLoading: true,
      error: null,
      username: null,
      profileImageUrl: null,
    };
  }

  // Use actual data or fallback
  const status = twitterStatus || fallbackStatus;

  return {
    isConfigured: status.connected || false,
    isLoading: false,
    error: status.error,
    username: status.username,
    profileImageUrl: status.profileImageUrl,
  };
}
