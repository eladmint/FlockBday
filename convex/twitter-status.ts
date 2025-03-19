import { v } from "convex/values";
import { query } from "./_generated/server";
import { checkTwitterCredentials } from "./twitter-config";

/**
 * Query to check Twitter integration status
 */
export const getTwitterStatus = query({
  args: {},
  handler: async (ctx) => {
    try {
      // This is a client-side query, so we can't directly access environment variables
      // Instead, we'll return information about whether the credentials are configured
      // in the server environment

      const TWITTER_API_KEY = process.env.VITE_TWITTER_API_KEY;
      const TWITTER_API_SECRET = process.env.VITE_TWITTER_API_SECRET;
      const TWITTER_ACCESS_TOKEN = process.env.VITE_TWITTER_ACCESS_TOKEN;
      const TWITTER_ACCESS_TOKEN_SECRET =
        process.env.VITE_TWITTER_ACCESS_TOKEN_SECRET;

      return {
        connected: !!(
          TWITTER_API_KEY &&
          TWITTER_API_SECRET &&
          TWITTER_ACCESS_TOKEN &&
          TWITTER_ACCESS_TOKEN_SECRET
        ),
        username: "twitter_user", // Placeholder
        profileImageUrl: undefined,
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
