import { v } from "convex/values";
import { scheduler } from "./_generated/server";
import { internal } from "./internal";

/**
 * Twitter Metrics Scheduler Module
 *
 * This module sets up recurring jobs to update Twitter metrics for posts.
 * It schedules different update frequencies based on post age and engagement levels.
 */

// Update metrics for high-engagement recent posts every 15 minutes
export const updateHighPriorityMetrics = scheduler.repeating({
  cronString: "*/15 * * * *", // Every 15 minutes
  handler: async (ctx) => {
    // Get posts published in the last 24 hours or with high engagement
    const posts = await ctx.runQuery(
      internal.twitter.getPostsNeedingMetricsUpdate,
      {
        thresholdMinutes: 15, // Posts that haven't been updated in 15 minutes
      },
    );

    // Filter for high priority posts (recent or high engagement)
    const highPriorityPosts = posts.filter((post) => {
      // Posts from the last 24 hours
      const isRecent =
        post.publishedAt && Date.now() - post.publishedAt < 24 * 60 * 60 * 1000;

      // Posts with high engagement
      const hasHighEngagement =
        post.twitterStats &&
        ((post.twitterStats.likes || 0) > 50 ||
          (post.twitterStats.retweets || 0) > 20 ||
          (post.twitterStats.replies || 0) > 10);

      return isRecent || hasHighEngagement;
    });

    // Update metrics for high priority posts
    if (highPriorityPosts.length > 0) {
      const results = [];

      for (const post of highPriorityPosts.slice(0, 10)) {
        // Limit to 10 posts per run
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
        processed: results.length,
        results,
      };
    }

    return { processed: 0, results: [] };
  },
});

// Update metrics for all posts every hour
export const updateAllMetrics = scheduler.repeating({
  cronString: "0 * * * *", // Every hour
  handler: async (ctx) => {
    return await ctx.runMutation(internal.twitter.updateAllPostMetrics, {});
  },
});

// Daily comprehensive metrics update
export const dailyMetricsUpdate = scheduler.repeating({
  cronString: "0 0 * * *", // Every day at midnight
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
