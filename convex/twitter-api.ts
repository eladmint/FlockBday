import { v } from "convex/values";
import { action } from "./_generated/server";
// Import the real Twitter API library - this is safe on the server side
import { TwitterApi } from "twitter-api-v2";

// This file contains server-side actions that interact with the Twitter API
// These actions run in a Node.js environment and can use the Twitter API directly

// Helper function to create a Twitter client
function createTwitterClient(accessToken?: string, accessTokenSecret?: string) {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Twitter API credentials not configured on the server");
  }

  // If access token and secret are provided, use them
  if (accessToken && accessTokenSecret) {
    return new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });
  }

  // Otherwise use the server's default credentials
  const defaultAccessToken = process.env.TWITTER_ACCESS_TOKEN;
  const defaultAccessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

  if (!defaultAccessToken || !defaultAccessTokenSecret) {
    throw new Error("Default Twitter credentials not configured on the server");
  }

  return new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: defaultAccessToken,
    accessSecret: defaultAccessTokenSecret,
  });
}

// Action to verify Twitter credentials
export const verifyTwitterCredentials = action({
  args: {
    accessToken: v.string(),
    accessTokenSecret: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const twitterClient = createTwitterClient(
        args.accessToken,
        args.accessTokenSecret,
      );

      // Verify the credentials by fetching the user's profile
      const user = await twitterClient.v2.me();

      return {
        valid: !!user.data.id,
        userId: user.data.id,
        username: user.data.username,
        name: user.data.name,
      };
    } catch (error) {
      console.error("Error verifying Twitter credentials:", error);
      return { valid: false, error: error.message };
    }
  },
});

// Action to post a tweet
export const postTweet = action({
  args: {
    userId: v.string(),
    accessToken: v.optional(v.string()),
    accessTokenSecret: v.optional(v.string()),
    content: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Create Twitter client with provided credentials or fall back to server credentials
      const twitterClient = createTwitterClient(
        args.accessToken,
        args.accessTokenSecret,
      );

      let tweet;
      if (args.imageUrl) {
        // In a production implementation, you would:
        // 1. Download the image from args.imageUrl
        // 2. Upload it to Twitter using mediaUpload
        // 3. Attach the media ID to the tweet
        // For simplicity, we'll just include the URL in the tweet text
        tweet = await twitterClient.v2.tweet(
          `${args.content} ${args.imageUrl}`,
        );
      } else {
        tweet = await twitterClient.v2.tweet(args.content);
      }

      return {
        success: true,
        tweetId: tweet.data.id,
        text: tweet.data.text,
      };
    } catch (error) {
      console.error("Error posting tweet:", error);
      return { success: false, error: error.message };
    }
  },
});

// Action to get tweet details
export const getTweetDetails = action({
  args: {
    tweetId: v.string(),
    accessToken: v.optional(v.string()),
    accessTokenSecret: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const twitterClient = createTwitterClient(
        args.accessToken,
        args.accessTokenSecret,
      );

      const tweet = await twitterClient.v2.singleTweet(args.tweetId, {
        expansions: ["author_id"],
        "tweet.fields": ["created_at", "public_metrics"],
      });

      return {
        success: true,
        tweet: tweet.data,
      };
    } catch (error) {
      console.error("Error getting tweet details:", error);
      return { success: false, error: error.message };
    }
  },
});

// Action to get user profile by username
export const getUserByUsername = action({
  args: {
    username: v.string(),
    accessToken: v.optional(v.string()),
    accessTokenSecret: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const twitterClient = createTwitterClient(
        args.accessToken,
        args.accessTokenSecret,
      );

      const user = await twitterClient.v2.userByUsername(args.username, {
        "user.fields": ["profile_image_url", "description", "public_metrics"],
      });

      return {
        success: true,
        user: user.data,
      };
    } catch (error) {
      console.error("Error getting user profile:", error);
      return { success: false, error: error.message };
    }
  },
});
