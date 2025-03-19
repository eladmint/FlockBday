import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  scheduler,
} from "./_generated/server";
import { internal } from "./internal";
import { Id } from "./_generated/dataModel";

/**
 * Twitter Scheduler Module
 *
 * This module handles the scheduling of Twitter posts using Convex's scheduler.
 * It provides functions to:
 * - Schedule posts for future publication
 * - Process scheduled posts when their time arrives
 * - Handle errors and retries for failed publications
 */

// Schedule a post to be published at a specific time
export const schedulePost = internalMutation({
  args: {
    postId: v.id("campaignPosts"),
    scheduledFor: v.number(),
  },
  handler: async (ctx, args) => {
    const { postId, scheduledFor } = args;

    // Get the post to ensure it exists
    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error(`Post with ID ${postId} not found`);
    }

    // Update the post status to scheduled
    await ctx.db.patch(postId, {
      status: "scheduled",
      scheduledFor,
    });

    // Schedule the job to run at the specified time
    const jobId = await ctx.scheduler.runAt(
      scheduledFor,
      internal.twitter.publishScheduledPost,
      {
        postId,
      },
    );

    // Store the job ID with the post for reference
    await ctx.db.patch(postId, {
      serverJobId: jobId,
    });

    return { success: true, jobId };
  },
});

// Cancel a scheduled post
export const cancelScheduledPost = internalMutation({
  args: {
    postId: v.id("campaignPosts"),
  },
  handler: async (ctx, args) => {
    const { postId } = args;

    // Get the post to ensure it exists
    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error(`Post with ID ${postId} not found`);
    }

    // Check if the post has a scheduled job
    if (!post.serverJobId) {
      return { success: false, error: "No scheduled job found for this post" };
    }

    try {
      // Cancel the scheduled job
      await ctx.scheduler.cancel(post.serverJobId);

      // Update the post status
      await ctx.db.patch(postId, {
        status: "draft",
        scheduledFor: undefined,
        serverJobId: undefined,
      });

      return { success: true };
    } catch (error) {
      console.error("Error canceling scheduled post:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// Publish a scheduled post when its time arrives
export const publishScheduledPost = internalMutation({
  args: {
    postId: v.id("campaignPosts"),
  },
  handler: async (ctx, args) => {
    const { postId } = args;

    // Get the post to ensure it exists
    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error(`Post with ID ${postId} not found`);
    }

    try {
      // Call the Twitter API to publish the post
      const result = await ctx.runAction(internal.twitter.publishPostTweet, {
        postId,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to publish to Twitter");
      }

      // Update the post with Twitter data
      await ctx.db.patch(postId, {
        status: "published",
        publishedAt: Date.now(),
        twitterPostId: result.tweetId,
        scheduledFor: undefined,
        serverJobId: undefined,
      });

      return { success: true, tweetId: result.tweetId };
    } catch (error) {
      console.error("Error publishing scheduled post:", error);

      // Update the post status to failed
      await ctx.db.patch(postId, {
        status: "failed",
      });

      // Schedule a retry if appropriate
      const retryCount = post.retryCount || 0;
      if (retryCount < 3) {
        // Exponential backoff: 5 minutes, 15 minutes, 45 minutes
        const backoffTime = 5 * 60 * 1000 * Math.pow(3, retryCount);
        const retryTime = Date.now() + backoffTime;

        const jobId = await ctx.scheduler.runAt(
          retryTime,
          internal.twitter.publishScheduledPost,
          {
            postId,
          },
        );

        await ctx.db.patch(postId, {
          serverJobId: jobId,
          retryCount: retryCount + 1,
          nextRetryAt: retryTime,
        });

        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          scheduled_retry: true,
          retry_at: new Date(retryTime).toISOString(),
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// Get all scheduled posts
export const getScheduledPosts = internalQuery({
  args: {
    campaignId: v.optional(v.id("campaigns")),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { campaignId, userId } = args;

    let query = ctx.db
      .query("campaignPosts")
      .filter((q) => q.eq(q.field("status"), "scheduled"));

    if (campaignId) {
      query = query.filter((q) => q.eq(q.field("campaignId"), campaignId));
    }

    if (userId) {
      query = query.filter((q) => q.eq(q.field("createdBy"), userId));
    }

    return await query.collect();
  },
});

// Process all due scheduled posts (can be run periodically as a backup)
export const processDueScheduledPosts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Find all posts that are scheduled and due
    const duePosts = await ctx.db
      .query("campaignPosts")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "scheduled"),
          q.lte(q.field("scheduledFor"), now),
        ),
      )
      .collect();

    const results = [];

    // Process each due post
    for (const post of duePosts) {
      try {
        const result = await ctx.runAction(internal.twitter.publishPostTweet, {
          postId: post._id,
        });

        if (result.success) {
          await ctx.db.patch(post._id, {
            status: "published",
            publishedAt: Date.now(),
            twitterPostId: result.tweetId,
            scheduledFor: undefined,
            serverJobId: undefined,
          });

          results.push({
            postId: post._id,
            success: true,
            tweetId: result.tweetId,
          });
        } else {
          throw new Error(result.error || "Failed to publish to Twitter");
        }
      } catch (error) {
        console.error(`Error publishing scheduled post ${post._id}:`, error);

        // Update the post status to failed
        await ctx.db.patch(post._id, {
          status: "failed",
        });

        results.push({
          postId: post._id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return {
      processed: duePosts.length,
      results,
    };
  },
});

// Set up a recurring job to check for due posts every hour
export const setupRecurringScheduleCheck = scheduler.repeating({
  cronString: "0 * * * *", // Run every hour
  handler: async (ctx) => {
    return await ctx.runMutation(internal.twitter.processDueScheduledPosts, {});
  },
});
