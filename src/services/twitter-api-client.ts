// This file is for server-side use only and should not be imported in browser code
// It will be used by Convex actions running on the server

// Dynamic import to prevent bundling in browser
const getTwitterApi = async () => {
  try {
    // This will only work in a Node.js environment
    const { TwitterApi } = await import("twitter-api-v2");
    return TwitterApi;
  } catch (error) {
    console.error("Failed to import TwitterApi:", error);
    throw new Error("TwitterApi is only available in Node.js environment");
  }
};

// This file provides a factory function to create Twitter API clients
// It handles both environment variables and explicitly passed credentials
export async function createTwitterClient(credentials?: {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}) {
  const TwitterApi = await getTwitterApi();

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
  // Note: This will only work in a Node.js environment (Convex actions)
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

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
