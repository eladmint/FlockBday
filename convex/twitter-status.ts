import { v } from "convex/values";
import { query, action } from "./_generated/server";
import { checkTwitterCredentials } from "./twitter-config";

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
      console.log("Environment variables check in isConfigured:", process.env);

      // Check if Twitter API credentials are configured
      // Try both naming conventions (with and without VITE_ prefix)
      const TWITTER_API_KEY =
        process.env.TWITTER_API_KEY || process.env.VITE_TWITTER_API_KEY;
      const TWITTER_API_SECRET =
        process.env.TWITTER_API_SECRET || process.env.VITE_TWITTER_API_SECRET;
      const TWITTER_ACCESS_TOKEN =
        process.env.TWITTER_ACCESS_TOKEN ||
        process.env.VITE_TWITTER_ACCESS_TOKEN;
      const TWITTER_ACCESS_TOKEN_SECRET =
        process.env.TWITTER_ACCESS_TOKEN_SECRET ||
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
