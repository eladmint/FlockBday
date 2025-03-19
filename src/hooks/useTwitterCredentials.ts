import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Hook to check if Twitter credentials are properly configured
 * This hook relies on server-side status checks rather than client-side environment variables
 *
 * The hook returns:
 * - isConfigured: Whether Twitter API credentials are configured on the server
 * - isConnected: Whether the user has connected their Twitter account
 * - username: The connected Twitter username (if available)
 * - profileImageUrl: The Twitter profile image URL (if available)
 * - serverConfig: The full server configuration object
 */
export function useTwitterCredentials() {
  // Query Twitter status from Convex
  const twitterStatus = useQuery(api.twitter.getTwitterStatus);
  const serverConfig = useQuery(api.twitterStatus.isConfigured, {
    // Add onError handler to gracefully handle server errors
    onError: (error) => {
      console.error("Error fetching Twitter configuration:", error);
      return {
        configured: false,
        error: String(error),
        credentials: {
          apiKeyExists: false,
          apiSecretExists: false,
          accessTokenExists: false,
          accessTokenSecretExists: false,
        },
      };
    },
  });

  // Handle loading state and errors gracefully
  if (twitterStatus === undefined || serverConfig === undefined) {
    return {
      isConfigured: false,
      isConnected: false,
      isLoading: true,
      error: null,
      username: null,
      profileImageUrl: null,
      serverConfig: null,
    };
  }

  // IMPORTANT: Rely primarily on the server-side configuration check
  // This is more reliable than client-side environment variables
  const isServerConfigured = serverConfig?.configured || false;

  return {
    // Prioritize server-side configuration status
    isConfigured: isServerConfigured,
    // Fall back to connection status if server config is unavailable
    isConnected: twitterStatus?.connected || false,
    isLoading: false,
    error: twitterStatus?.error || null,
    username: twitterStatus?.username || null,
    profileImageUrl: twitterStatus?.profileImageUrl || null,
    serverConfig: serverConfig,
  };
}
