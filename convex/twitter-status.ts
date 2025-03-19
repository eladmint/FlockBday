import { v } from "convex/values";
import { query, action } from "./_generated/server";
import { checkTwitterCredentials } from "./twitter-config";

/**
 * Query to check Twitter integration status
 *
 * This query checks if Twitter is connected for the current user.
 * It returns:
 * - connected: Whether Twitter is connected
 * - username: The connected Twitter username (if available)
 * - profileImageUrl: The Twitter profile image URL (if available)
 */
export const getTwitterStatus = query({
  args: {},
  handler: async (ctx) => {
    try {
      // Check if Twitter API credentials are configured on the server
      // This is a server-side check, so we can access environment variables directly
      const TWITTER_API_KEY = process.env.VITE_TWITTER_API_KEY;
      const TWITTER_API_SECRET = process.env.VITE_TWITTER_API_SECRET;
      const TWITTER_ACCESS_TOKEN = process.env.VITE_TWITTER_ACCESS_TOKEN;
      const TWITTER_ACCESS_TOKEN_SECRET =
        process.env.VITE_TWITTER_ACCESS_TOKEN_SECRET;

      // Log the check for debugging
      console.log("Server-side Twitter credential check:");
      console.log("API Key exists:", !!TWITTER_API_KEY);
      console.log("API Secret exists:", !!TWITTER_API_SECRET);
      console.log("Access Token exists:", !!TWITTER_ACCESS_TOKEN);
      console.log("Access Token Secret exists:", !!TWITTER_ACCESS_TOKEN_SECRET);

      const connected = !!(
        TWITTER_API_KEY &&
        TWITTER_API_SECRET &&
        TWITTER_ACCESS_TOKEN &&
        TWITTER_ACCESS_TOKEN_SECRET
      );

      return {
        connected,
        username: "twitter_user", // Placeholder - in a real app, this would come from the user's Twitter account
        profileImageUrl:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=twitter",
      };
    } catch (error) {
      console.error("Error checking Twitter status:", error);
      return {
        connected: false,
        error: String(error),
      };
    }
  },
});

/**
 * Query to check if Twitter API is configured on the server
 *
 * This query checks if the Twitter API credentials are configured on the server.
 * It returns:
 * - configured: Whether the Twitter API credentials are configured
 * - environment: The current environment (development, production, etc.)
 * - credentials: Object containing boolean flags for each credential
 */
export const isConfigured = query({
  args: {},
  handler: async (ctx) => {
    try {
      // Check if Twitter API credentials are configured
      const TWITTER_API_KEY = process.env.VITE_TWITTER_API_KEY;
      const TWITTER_API_SECRET = process.env.VITE_TWITTER_API_SECRET;
      const TWITTER_ACCESS_TOKEN = process.env.VITE_TWITTER_ACCESS_TOKEN;
      const TWITTER_ACCESS_TOKEN_SECRET =
        process.env.VITE_TWITTER_ACCESS_TOKEN_SECRET;

      // Log the check for debugging
      console.log("Server-side Twitter credential check in isConfigured:");
      console.log("API Key exists:", !!TWITTER_API_KEY);
      console.log("API Secret exists:", !!TWITTER_API_SECRET);
      console.log("Access Token exists:", !!TWITTER_ACCESS_TOKEN);
      console.log("Access Token Secret exists:", !!TWITTER_ACCESS_TOKEN_SECRET);

      const configured = !!(
        TWITTER_API_KEY &&
        TWITTER_API_SECRET &&
        TWITTER_ACCESS_TOKEN &&
        TWITTER_ACCESS_TOKEN_SECRET
      );

      return {
        configured,
        environment: process.env.NODE_ENV || "unknown",
        credentials: {
          apiKeyExists: !!TWITTER_API_KEY,
          apiSecretExists: !!TWITTER_API_SECRET,
          accessTokenExists: !!TWITTER_ACCESS_TOKEN,
          accessTokenSecretExists: !!TWITTER_ACCESS_TOKEN_SECRET,
        },
      };
    } catch (error) {
      console.error("Error checking Twitter configuration:", error);
      return {
        configured: false,
        error: String(error),
      };
    }
  },
});

/**
 * Action to verify Twitter credentials
 *
 * This action checks if the Twitter API credentials are valid by making a test API call.
 * It returns:
 * - valid: Whether the credentials are valid
 * - error: Error message if the credentials are invalid
 */
export const verifyCredentials = action({
  args: {},
  handler: async (ctx) => {
    try {
      // Check if Twitter API credentials are configured
      const result = await ctx.runAction(checkTwitterCredentials);

      return {
        valid: result.isConfigured,
        details: result,
      };
    } catch (error) {
      console.error("Error verifying Twitter credentials:", error);
      return {
        valid: false,
        error: String(error),
      };
    }
  },
});
