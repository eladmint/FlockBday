import { TwitterApi } from "twitter-api-v2";

// This file provides a factory function to create Twitter API clients
// It handles both environment variables and explicitly passed credentials

export function createTwitterClient(credentials?: {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}) {
  // If credentials are explicitly provided, use those
  if (credentials) {
    return new TwitterApi({
      appKey: credentials.apiKey,
      appSecret: credentials.apiSecret,
      accessToken: credentials.accessToken,
      accessSecret: credentials.accessTokenSecret,
    });
  }

  // Otherwise, use environment variables
  const apiKey = import.meta.env.VITE_TWITTER_API_KEY;
  const apiSecret = import.meta.env.VITE_TWITTER_API_SECRET;
  const accessToken = import.meta.env.VITE_TWITTER_ACCESS_TOKEN;
  const accessTokenSecret = import.meta.env.VITE_TWITTER_ACCESS_TOKEN_SECRET;

  // Check if credentials exist
  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    throw new Error(
      "Twitter API credentials not found in environment variables",
    );
  }

  // Create and return the Twitter client
  return new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessToken,
    accessSecret: accessTokenSecret,
  });
}
