import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./internal";

/**
 * Twitter Integration Module
 *
 * This module provides the main interface for Twitter integration in the application.
 * It includes functions for posting tweets, managing Twitter integration for campaigns,
 * and scheduling posts for future publication.
 */

// Connect Twitter account
export const connectTwitterAccount = mutation({
  args: {
    accessToken: v.string(),
    accessTokenSecret: v.string(),
    username: v.string(),
    profileImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const tokenIdentifier = identity.subject;

    // Check if user already has a Twitter integration
    const existingIntegration = await ctx.db
      .query("twitterIntegrations")
      .withIndex("by_user", (q) => q.eq("userId", tokenIdentifier))
      .first();

    if (existingIntegration) {
      // Update existing integration
      await ctx.db.patch(existingIntegration._id, {
        accessToken: args.accessToken,
        accessTokenSecret: args.accessTokenSecret,
        username: args.username,
        profileImageUrl: args.profileImageUrl,
        status: "active",
        lastUsedAt: Date.now(),
      });

      // Update user record
      await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
        .first()
        .then((user) => {
          if (user) {
            ctx.db.patch(user._id, {
              twitterConnected: true,
              twitterUsername: args.username,
            });
          }
        });

      return existingIntegration._id;
    }

    // Create new integration
    const integrationId = await ctx.db.insert("twitterIntegrations", {
      userId: tokenIdentifier,
      accessToken: args.accessToken,
      accessTokenSecret: args.accessTokenSecret,
      username: args.username,
      profileImageUrl: args.profileImageUrl,
      connectedAt: Date.now(),
      status: "active",
    });

    // Update user record
    await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .first()
      .then((user) => {
        if (user) {
          ctx.db.patch(user._id, {
            twitterConnected: true,
            twitterUsername: args.username,
          });
        }
      });

    return integrationId;
  },
});

// Post a tweet directly
export const postTweet = mutation({
  args: {
    content: v.string(),
    imageUrl: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { content, imageUrl, userId } = args;

    try {
      // Call the Twitter API action
      const result = await ctx.runAction(internal.twitter.publishTweet, {
        content,
        imageUrl,
        userId,
      });

      return result;
    } catch (error) {
      console.error("Error posting tweet:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// Publish a tweet for a specific post
export const publishTweet = mutation({
  args: {
    postId: v.id("campaignPosts"),
  },
  handler: async (ctx, args) => {
    const { postId } = args;

    try {
      // Get the post
      const post = await ctx.db.get(postId);
      if (!post) {
        return {
          success: false,
          error: "Post not found",
        };
      }

      // Call the Twitter API action
      const result = await ctx.runAction(internal.twitter.publishPostTweet, {
        postId,
      });

      if (result.success) {
        // Update the post with Twitter data
        await ctx.db.patch(postId, {
          sharedOnTwitter: true,
          twitterPostId: result.tweetId,
          publishedAt: Date.now(),
          status: "published",
        });
      }

      return result;
    } catch (error) {
      console.error("Error publishing tweet for post:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// Schedule a post for future publication
export const scheduleTwitterPost = mutation({
  args: {
    postId: v.id("campaignPosts"),
    scheduledFor: v.number(),
  },
  handler: async (ctx, args) => {
    const { postId, scheduledFor } = args;

    try {
      // Get the post
      const post = await ctx.db.get(postId);
      if (!post) {
        return {
          success: false,
          error: "Post not found",
        };
      }

      // Schedule the post using the scheduler
      const result = await ctx.runMutation(internal.twitter.schedulePost, {
        postId,
        scheduledFor,
      });

      return result;
    } catch (error) {
      console.error("Error scheduling post:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// Cancel a scheduled post
export const cancelScheduledTwitterPost = mutation({
  args: {
    postId: v.id("campaignPosts"),
  },
  handler: async (ctx, args) => {
    const { postId } = args;

    try {
      // Get the post
      const post = await ctx.db.get(postId);
      if (!post) {
        return {
          success: false,
          error: "Post not found",
        };
      }

      // Cancel the scheduled post
      const result = await ctx.runMutation(
        internal.twitter.cancelScheduledPost,
        {
          postId,
        },
      );

      return result;
    } catch (error) {
      console.error("Error canceling scheduled post:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// Get all scheduled posts for a campaign
export const getScheduledPosts = query({
  args: {
    campaignId: v.optional(v.id("campaigns")),
  },
  handler: async (ctx, args) => {
    const { campaignId } = args;

    // Get the user ID from auth
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject;

    // Get scheduled posts using the internal query
    return await ctx.runQuery(internal.twitter.getScheduledPosts, {
      campaignId,
      userId,
    });
  },
});

// Get Twitter status for a campaign
export const getCampaignTwitterStatus = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const { campaignId } = args;

    // Get the campaign
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      return {
        isConnected: false,
        error: "Campaign not found",
      };
    }

    // Check if Twitter is enabled for this campaign
    return {
      isConnected: Boolean(campaign.twitterEnabled),
      username: campaign.twitterUsername,
    };
  },
});

// Enable Twitter for a campaign
export const enableTwitterForCampaign = mutation({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const { campaignId } = args;

    // Get the campaign
    const campaign = await ctx.db.get(campaignId);
    if (!campaign) {
      return {
        success: false,
        error: "Campaign not found",
      };
    }

    // Get the user's Twitter integration
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const userId = identity.subject;

    // Check if the user has Twitter connected
    const twitterIntegrations = await ctx.db
      .query("twitterIntegrations")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (!twitterIntegrations) {
      return {
        success: false,
        error: "Twitter not connected for this user",
      };
    }

    // Enable Twitter for the campaign
    await ctx.db.patch(campaignId, {
      twitterEnabled: true,
      twitterUsername: twitterIntegrations.username,
    });

    return {
      success: true,
    };
  },
});

// Disable Twitter for a campaign
export const disableTwitterForCampaign = mutation({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const { campaignId } = args;

    // Get the campaign
    const campaign = await ctx.db.get(campaignId);
    if (!campaign) {
      return {
        success: false,
        error: "Campaign not found",
      };
    }

    // Disable Twitter for the campaign
    await ctx.db.patch(campaignId, {
      twitterEnabled: false,
      twitterUsername: null,
    });

    return {
      success: true,
    };
  },
});

// Check Twitter connection status
export const getTwitterStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { connected: false };
    }

    const tokenIdentifier = identity.subject;

    // Check if user has Twitter connected
    const integration = await ctx.db
      .query("twitterIntegrations")
      .withIndex("by_user", (q) => q.eq("userId", tokenIdentifier))
      .first();

    return {
      connected: !!integration && integration.status === "active",
      username: integration?.username,
      profileImageUrl: integration?.profileImageUrl,
    };
  },
});

// Get Twitter integration for internal use
export const getTwitterIntegrationInternal = query({
  args: {
    userId: v.string(),
    campaignId: v.optional(v.id("campaigns")),
  },
  handler: async (ctx, args) => {
    // First try to get campaign-specific integration if campaignId is provided
    if (args.campaignId) {
      const campaignIntegration = await ctx.db
        .query("twitterIntegrations")
        .withIndex("by_user_and_campaign", (q) =>
          q.eq("userId", args.userId).eq("campaignId", args.campaignId),
        )
        .first();

      if (campaignIntegration && campaignIntegration.status === "active") {
        return campaignIntegration;
      }
    }

    // Fall back to user's general integration
    return await ctx.db
      .query("twitterIntegrations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});
