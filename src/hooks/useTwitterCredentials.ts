import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Hook to check if Twitter credentials are properly configured
 * This hook relies on server-side status checks rather than client-side environment variables
 */
export function useTwitterCredentials() {
  // Query Twitter status from Convex
  const twitterStatus = useQuery(api.twitter.getTwitterStatus);
  const serverConfig = useQuery(api.twitterStatus.isConfigured);

  // Add fallback for development/testing
  const fallbackStatus = {
    connected: false,
    username: "twitter_demo",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=twitter",
  };

  // Handle loading state and errors gracefully
  if (twitterStatus === undefined || serverConfig === undefined) {
    return {
      isConfigured: false,
      isLoading: true,
      error: null,
      username: null,
      profileImageUrl: null,
      serverConfig: null,
    };
  }

  // Use actual data or fallback
  const status = twitterStatus || fallbackStatus;

  // IMPORTANT: Rely primarily on the server-side configuration check
  // This is more reliable than client-side environment variables
  const isServerConfigured = serverConfig?.configured || false;

  return {
    // Prioritize server-side configuration status
    isConfigured: isServerConfigured,
    // Fall back to connection status if server config is unavailable
    isConnected: status.connected,
    isLoading: false,
    error: status.error,
    username: status.username,
    profileImageUrl: status.profileImageUrl,
    serverConfig: serverConfig,
  };
}
