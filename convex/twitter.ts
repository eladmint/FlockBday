import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./internal";

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

// Disconnect Twitter account
export const disconnectTwitterAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const tokenIdentifier = identity.subject;

    // Find the user's Twitter integration
    const integration = await ctx.db
      .query("twitterIntegrations")
      .withIndex("by_user", (q) => q.eq("userId", tokenIdentifier))
      .first();

    if (!integration) {
      throw new Error("No Twitter integration found");
    }

    // Update the integration status
    await ctx.db.patch(integration._id, {
      status: "revoked",
    });

    // Update user record
    await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .first()
      .then((user) => {
        if (user) {
          ctx.db.patch(user._id, {
            twitterConnected: false,
          });
        }
      });

    return { success: true };
  },
});

// Enable Twitter for a campaign
export const enableTwitterForCampaign = mutation({
  args: {
    campaignId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const tokenIdentifier = identity.subject;

    // Validate the campaign ID format before casting
    let campaignId;
    try {
      campaignId = args.campaignId as unknown as Id<"campaigns">;
    } catch (error) {
      throw new Error(`Invalid campaign ID format: ${args.campaignId}`);
    }

    // Check if user is a member of the campaign with appropriate permissions
    const membership = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign_and_user", (q) =>
        q.eq("campaignId", campaignId).eq("userId", tokenIdentifier),
      )
      .first();

    if (
      !membership ||
      (membership.role !== "owner" && membership.role !== "admin")
    ) {
      throw new Error("Not authorized to enable Twitter for this campaign");
    }

    // Check if user has Twitter connected
    const integration = await ctx.db
      .query("twitterIntegrations")
      .withIndex("by_user", (q) => q.eq("userId", tokenIdentifier))
      .first();

    if (!integration || integration.status !== "active") {
      throw new Error("Twitter account not connected");
    }

    // Enable Twitter for the campaign
    await ctx.db.patch(campaignId, {
      twitterEnabled: true,
      updatedAt: Date.now(),
    });

    // Create campaign-specific Twitter integration if it doesn't exist
    const campaignIntegration = await ctx.db
      .query("twitterIntegrations")
      .withIndex("by_user_and_campaign", (q) =>
        q.eq("userId", tokenIdentifier).eq("campaignId", campaignId),
      )
      .first();

    if (!campaignIntegration) {
      await ctx.db.insert("twitterIntegrations", {
        userId: tokenIdentifier,
        campaignId: campaignId,
        accessToken: integration.accessToken,
        accessTokenSecret: integration.accessTokenSecret,
        username: integration.username,
        profileImageUrl: integration.profileImageUrl,
        connectedAt: Date.now(),
        status: "active",
      });
    } else if (campaignIntegration.status !== "active") {
      await ctx.db.patch(campaignIntegration._id, {
        status: "active",
        lastUsedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Disable Twitter for a campaign
export const disableTwitterForCampaign = mutation({
  args: {
    campaignId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const tokenIdentifier = identity.subject;

    // Validate the campaign ID format before casting
    let campaignId;
    try {
      campaignId = args.campaignId as unknown as Id<"campaigns">;
    } catch (error) {
      throw new Error(`Invalid campaign ID format: ${args.campaignId}`);
    }

    // Check if user is a member of the campaign with appropriate permissions
    const membership = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign_and_user", (q) =>
        q.eq("campaignId", campaignId).eq("userId", tokenIdentifier),
      )
      .first();

    if (
      !membership ||
      (membership.role !== "owner" && membership.role !== "admin")
    ) {
      throw new Error("Not authorized to disable Twitter for this campaign");
    }

    // Disable Twitter for the campaign
    await ctx.db.patch(campaignId, {
      twitterEnabled: false,
      updatedAt: Date.now(),
    });

    // Update campaign-specific Twitter integration if it exists
    const campaignIntegration = await ctx.db
      .query("twitterIntegrations")
      .withIndex("by_user_and_campaign", (q) =>
        q.eq("userId", tokenIdentifier).eq("campaignId", campaignId),
      )
      .first();

    if (campaignIntegration) {
      await ctx.db.patch(campaignIntegration._id, {
        status: "revoked",
      });
    }

    return { success: true };
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

// Check campaign Twitter status
export const getCampaignTwitterStatus = query({
  args: {
    campaignId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { enabled: false };
    }

    const tokenIdentifier = identity.subject;

    // Validate the campaign ID format before casting
    let campaignId;
    try {
      campaignId = args.campaignId as unknown as Id<"campaigns">;
    } catch (error) {
      throw new Error(`Invalid campaign ID format: ${args.campaignId}`);
    }

    // Get the campaign
    const campaign = await ctx.db.get(campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Check if user is a member of the campaign
    const membership = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign_and_user", (q) =>
        q.eq("campaignId", campaignId).eq("userId", tokenIdentifier),
      )
      .first();

    if (!membership && campaign.visibility !== "public") {
      throw new Error("Not authorized to view this campaign");
    }

    return {
      enabled: !!campaign.twitterEnabled,
    };
  },
});

// Publish a tweet (action to handle external API call)
export const publishTweet = action({
  args: {
    postId: v.id("campaignPosts"),
  },
  handler: async (ctx, args) => {
    // Get the post
    const post = await ctx.runQuery(internal.posts.getPostInternal, {
      postId: args.postId,
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // Get the campaign
    const campaign = await ctx.runQuery(
      internal.campaigns.getCampaignInternal,
      {
        campaignId: post.campaignId,
      },
    );

    if (!campaign || !campaign.twitterEnabled) {
      throw new Error("Twitter is not enabled for this campaign");
    }

    // Get the Twitter integration for this campaign
    const integration = await ctx.runQuery(
      internal.twitter.getTwitterIntegrationInternal,
      {
        userId: post.createdBy,
        campaignId: post.campaignId,
      },
    );

    if (!integration || integration.status !== "active") {
      throw new Error("Twitter integration not found or inactive");
    }

    try {
      // In a real implementation, this would call the Twitter API
      // For now, we'll simulate a successful tweet
      const tweetId = `twitter-${Date.now()}`;

      // Update the post with the tweet ID and stats
      await ctx.runMutation(internal.posts.updatePostInternal, {
        postId: args.postId,
        status: "published",
        publishedAt: Date.now(),
        sharedOnTwitter: true,
        twitterPostId: tweetId,
        twitterStats: {
          likes: 0,
          retweets: 0,
          replies: 0,
        },
      });

      return {
        success: true,
        tweetId,
      };
    } catch (error) {
      // Update the post with the error
      await ctx.runMutation(internal.posts.updatePostInternal, {
        postId: args.postId,
        status: "failed",
      });

      throw error;
    }
  },
});

// Internal functions
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
