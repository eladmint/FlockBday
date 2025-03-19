import { v } from "convex/values";
import { internalMutation, internalQuery, action } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./internal";

/**
 * Twitter Metrics Module
 *
 * This module handles fetching and updating Twitter metrics for posts.
 * It provides functions to:
 * - Fetch metrics for a specific tweet
 * - Update metrics in the database
 * - Schedule periodic metrics updates
 */

// Fetch metrics for a tweet
export const fetchTweetMetrics = action({
  args: {
    tweetId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Call the Twitter API to get tweet details
      const result = await ctx.runAction(internal.twitter.getTweetDetails, {
        tweetId: args.tweetId,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch tweet details");
      }

      // Extract metrics from the tweet data
      const tweet = result.tweet;
      const metrics = tweet.public_metrics || {
        like_count: 0,
        retweet_count: 0,
        reply_count: 0,
      };

      return {
        success: true,
        metrics: {
          likes: metrics.like_count,
          retweets: metrics.retweet_count,
          replies: metrics.reply_count,
        },
      };
    } catch (error) {
      console.error("Error fetching tweet metrics:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// Update metrics for a post
export const updatePostMetrics = internalMutation({
  args: {
    postId: v.id("campaignPosts"),
  },
  handler: async (ctx, args) => {
    try {
      // Get the post
      const post = await ctx.db.get(args.postId);
      if (!post) {
        throw new Error("Post not found");
      }

      // Check if the post has a Twitter ID
      if (!post.twitterPostId) {
        return {
          success: false,
          error: "Post has no Twitter ID",
        };
      }

      // Fetch metrics from Twitter
      const metricsResult = await ctx.runAction(
        internal.twitter.fetchTweetMetrics,
        {
          tweetId: post.twitterPostId,
        },
      );

      if (!metricsResult.success) {
        throw new Error(metricsResult.error || "Failed to fetch metrics");
      }

      // Update the post with the new metrics
      await ctx.db.patch(args.postId, {
        twitterStats: metricsResult.metrics,
        lastMetricsUpdate: Date.now(),
      });

      return {
        success: true,
        metrics: metricsResult.metrics,
      };
    } catch (error) {
      console.error("Error updating post metrics:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// Update metrics for all published posts
export const updateAllPostMetrics = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all published posts with Twitter IDs
    const posts = await ctx.db
      .query("campaignPosts")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "published"),
          q.neq(q.field("twitterPostId"), null),
        ),
      )
      .collect();

    const results = [];

    // Update metrics for each post
    for (const post of posts) {
      try {
        const result = await ctx.runMutation(
          internal.twitter.updatePostMetrics,
          {
            postId: post._id,
          },
        );

        results.push({
          postId: post._id,
          success: result.success,
          metrics: result.success ? result.metrics : null,
          error: result.success ? null : result.error,
        });
      } catch (error) {
        results.push({
          postId: post._id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return {
      processed: posts.length,
      results,
    };
  },
});

// Get posts that need metrics updates
export const getPostsNeedingMetricsUpdate = internalQuery({
  args: {
    thresholdMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const thresholdMinutes = args.thresholdMinutes || 30; // Default to 30 minutes
    const thresholdMs = thresholdMinutes * 60 * 1000;
    const cutoffTime = Date.now() - thresholdMs;

    // Get posts that haven't been updated recently
    return await ctx.db
      .query("campaignPosts")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "published"),
          q.neq(q.field("twitterPostId"), null),
          q.or(
            q.eq(q.field("lastMetricsUpdate"), undefined),
            q.lt(q.field("lastMetricsUpdate"), cutoffTime),
          ),
        ),
      )
      .collect();
  },
});
