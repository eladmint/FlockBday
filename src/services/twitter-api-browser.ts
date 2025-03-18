// Browser-compatible Twitter API client
// This file provides a safe implementation for browser environments
// that redirects actual API calls to our Convex backend

export class TwitterApiBrowser {
  private appKey: string;
  private appSecret: string;
  private accessToken: string;
  private accessSecret: string;

  constructor(options: {
    appKey: string;
    appSecret: string;
    accessToken: string;
    accessSecret: string;
  }) {
    this.appKey = options.appKey;
    this.appSecret = options.appSecret;
    this.accessToken = options.accessToken;
    this.accessSecret = options.accessSecret;
  }

  // Browser-safe API methods that redirect to Convex
  public v2 = {
    me: async (options?: any) => {
      console.log(
        "Browser environment: Redirecting Twitter API calls to backend",
      );
      // In browser, we should use our Convex backend instead
      throw new Error(
        "Twitter API direct calls not supported in browser. Use Convex actions instead.",
      );
    },

    tweet: async (content: string) => {
      console.log(
        "Browser environment: Redirecting Twitter API calls to backend",
      );
      // In browser, we should use our Convex backend instead
      throw new Error(
        "Twitter API direct calls not supported in browser. Use Convex actions instead.",
      );
    },

    singleTweet: async (id: string, options?: any) => {
      console.log(
        "Browser environment: Redirecting Twitter API calls to backend",
      );
      // In browser, we should use our Convex backend instead
      throw new Error(
        "Twitter API direct calls not supported in browser. Use Convex actions instead.",
      );
    },
  };
}

// Factory function that mimics the original but returns our browser-compatible version
export function createTwitterClient(credentials?: {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}) {
  // Check if we should use mock implementation
  if (import.meta.env.VITE_USE_MOCK_TWITTER === "true") {
    // Import dynamically to avoid bundling issues
    const { MockTwitterApi } = require("./mock-twitter-service");

    if (credentials) {
      return new MockTwitterApi({
        appKey: credentials.apiKey,
        appSecret: credentials.apiSecret,
        accessToken: credentials.accessToken,
        accessSecret: credentials.accessTokenSecret,
      });
    }

    // Use environment variables for mock
    const apiKey = import.meta.env.VITE_TWITTER_API_KEY || "mock-key";
    const apiSecret = import.meta.env.VITE_TWITTER_API_SECRET || "mock-secret";
    const accessToken =
      import.meta.env.VITE_TWITTER_ACCESS_TOKEN || "mock-token";
    const accessTokenSecret =
      import.meta.env.VITE_TWITTER_ACCESS_TOKEN_SECRET || "mock-token-secret";

    return new MockTwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });
  }

  // If credentials are explicitly provided, use those
  if (credentials) {
    return new TwitterApiBrowser({
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
    console.warn(
      "Twitter API credentials not found in environment variables, using empty values",
    );
    // Return with empty values instead of throwing - this allows the app to load
    // even without credentials, and the actual API calls will be handled by Convex
    return new TwitterApiBrowser({
      appKey: apiKey || "",
      appSecret: apiSecret || "",
      accessToken: accessToken || "",
      accessSecret: accessTokenSecret || "",
    });
  }

  // Create and return the Twitter client
  return new TwitterApiBrowser({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessToken,
    accessSecret: accessTokenSecret,
  });
}
