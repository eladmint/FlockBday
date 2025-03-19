import { v } from "convex/values";
import { internalAction } from "./_generated/server";

/**
 * Internal action to check if Twitter credentials are properly configured
 */
export const checkTwitterCredentials = internalAction({
  handler: async (ctx) => {
    // Get Twitter credentials from environment variables
    const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
    const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
    const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
    const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;

    // Check if all credentials are present
    const isConfigured = !!(
      TWITTER_API_KEY &&
      TWITTER_API_SECRET &&
      TWITTER_ACCESS_TOKEN &&
      TWITTER_ACCESS_TOKEN_SECRET
    );

    return {
      isConfigured,
      apiKeyExists: !!TWITTER_API_KEY,
      apiSecretExists: !!TWITTER_API_SECRET,
      accessTokenExists: !!TWITTER_ACCESS_TOKEN,
      accessTokenSecretExists: !!TWITTER_ACCESS_TOKEN_SECRET,
    };
  },
});
