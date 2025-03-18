import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Internal functions for posts
export const posts = {
  getPostInternal: internalQuery({
    args: { postId: v.id("campaignPosts") },
    handler: async (ctx, args) => {
      return await ctx.db.get(args.postId);
    },
  }),

  updatePostInternal: internalMutation({
    args: {
      postId: v.id("campaignPosts"),
      status: v.optional(v.string()),
      publishedAt: v.optional(v.number()),
      sharedOnTwitter: v.optional(v.boolean()),
      twitterPostId: v.optional(v.string()),
      twitterStats: v.optional(
        v.object({
          likes: v.number(),
          retweets: v.number(),
          replies: v.number(),
        }),
      ),
    },
    handler: async (ctx, args) => {
      const updateData: any = {
        updatedAt: Date.now(),
      };

      if (args.status !== undefined) updateData.status = args.status;
      if (args.publishedAt !== undefined)
        updateData.publishedAt = args.publishedAt;
      if (args.sharedOnTwitter !== undefined)
        updateData.sharedOnTwitter = args.sharedOnTwitter;
      if (args.twitterPostId !== undefined)
        updateData.twitterPostId = args.twitterPostId;
      if (args.twitterStats !== undefined)
        updateData.twitterStats = args.twitterStats;

      await ctx.db.patch(args.postId, updateData);
    },
  }),
};

// Internal functions for campaigns
export const campaigns = {
  getCampaignInternal: internalQuery({
    args: { campaignId: v.id("campaigns") },
    handler: async (ctx, args) => {
      return await ctx.db.get(args.campaignId);
    },
  }),
};

// Process scheduled posts
export const processScheduledJobs = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Get all pending jobs that are due
    const dueJobs = await ctx.db
      .query("scheduledJobs")
      .withIndex("by_type_and_status", (q) =>
        q.eq("type", "twitter_post").eq("status", "pending"),
      )
      .filter((q) => q.lte(q.field("scheduledFor"), now))
      .collect();

    const results = [];

    for (const job of dueJobs) {
      // Mark job as processing
      await ctx.db.patch(job._id, {
        status: "processing",
        processedAt: now,
      });

      try {
        // Get the post
        const post = await ctx.db.get(job.data.postId);
        if (!post) {
          throw new Error("Post not found");
        }

        // Get the campaign
        const campaign = await ctx.db.get(post.campaignId);
        if (!campaign || !campaign.twitterEnabled) {
          throw new Error("Twitter is not enabled for this campaign");
        }

        // In a real implementation, this would call the Twitter API
        // For now, we'll simulate a successful tweet
        const tweetId = `twitter-${Date.now()}`;

        // Update the post with the tweet ID and stats
        await ctx.db.patch(post._id, {
          status: "published",
          publishedAt: now,
          sharedOnTwitter: true,
          twitterPostId: tweetId,
          twitterStats: {
            likes: 0,
            retweets: 0,
            replies: 0,
          },
        });

        // Mark job as completed
        await ctx.db.patch(job._id, {
          status: "completed",
          result: {
            success: true,
            tweetId,
          },
        });

        results.push({
          jobId: job._id,
          postId: post._id,
          success: true,
        });
      } catch (error) {
        // Handle error
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        // Update the post status
        if (job.data.postId) {
          await ctx.db.patch(job.data.postId, {
            status: "failed",
          });
        }

        // Mark job as failed
        await ctx.db.patch(job._id, {
          status: "failed",
          error: errorMessage,
        });

        results.push({
          jobId: job._id,
          postId: job.data.postId,
          success: false,
          error: errorMessage,
        });
      }
    }

    return results;
  },
});

// Add Twitter internal functions
export const twitter = {
  getTwitterIntegrationInternal: internalQuery({
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
  }),
};
