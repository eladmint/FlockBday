import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Hook to check if Twitter credentials are properly configured
 */
export function useTwitterCredentials() {
  // Query Twitter status from Convex
  const twitterStatus = useQuery(api.twitter.getTwitterStatus);

  return {
    isConfigured: twitterStatus?.connected || false,
    isLoading: twitterStatus === undefined,
    error: twitterStatus?.error,
    username: twitterStatus?.username,
    profileImageUrl: twitterStatus?.profileImageUrl,
  };
}
