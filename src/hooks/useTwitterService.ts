import { useTwitterIntegration } from "./useTwitterIntegration";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

/**
 * Interface for Twitter post data
 * Used for creating, scheduling, and publishing posts to Twitter
 */
export interface TwitterPost {
  id?: string | Id<"campaignPosts">; // Unique identifier for the post
  content: string; // The actual tweet content
  imageUrl?: string; // Optional image URL to attach to the tweet
  scheduledFor?: string | number; // ISO string or timestamp for scheduled posts
  status?: string; // Current status: draft, scheduled, published, failed
  userId?: string; // User ID who created the post
  twitterPostId?: string; // Twitter's post ID after publishing
  createdAt?: string | number; // Creation timestamp
  campaignId?: Id<"campaigns">; // Campaign ID
}

/**
 * Hook that provides Twitter integration functionality for posts
 * This consolidates all Twitter-related operations in one place
 */
export function useTwitterService() {
  const twitterIntegration = useTwitterIntegration();
  const { toast } = useToast();

  // Convex mutations for Twitter actions
  const postTweetMutation = useMutation(api.twitter.postTweet);
  const publishTweetMutation = useMutation(api.twitter.publishTweet);
  const schedulePostMutation = useMutation(api.twitter.scheduleTwitterPost);
  const cancelScheduledPostMutation = useMutation(
    api.twitter.cancelScheduledTwitterPost,
  );

  return {
    // Twitter account connection status
    isConnected: twitterIntegration.isConnected,
    username: twitterIntegration.username,
    profileImageUrl: twitterIntegration.profileImageUrl,
    isConnecting: twitterIntegration.isConnecting,

    // Twitter account connection methods
    connectTwitter: twitterIntegration.connectTwitter,
    disconnectTwitter: twitterIntegration.disconnectTwitter,

    // Twitter post management methods
    schedulePost: async (post: TwitterPost) => {
      try {
        if (!post.id) {
          throw new Error("Post ID is required for scheduling");
        }

        if (!post.scheduledFor) {
          throw new Error("Scheduled time is required");
        }

        // Convert string date to timestamp if needed
        const scheduledTimestamp =
          typeof post.scheduledFor === "string"
            ? new Date(post.scheduledFor).getTime()
            : post.scheduledFor;

        // Schedule the post using Convex
        const result = await schedulePostMutation({
          postId: post.id as Id<"campaignPosts">,
          scheduledFor: scheduledTimestamp,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to schedule post");
        }

        toast({
          title: "Post Scheduled",
          description: `Your post will be published on ${new Date(scheduledTimestamp).toLocaleString()}`,
        });

        return {
          ...post,
          status: "scheduled",
          scheduledFor: scheduledTimestamp,
          scheduledJobId: result.jobId,
        };
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to schedule post",
          variant: "destructive",
        });
        throw error;
      }
    },

    publishNow: async (post: TwitterPost) => {
      try {
        if (!post.id) {
          // If no ID, create a direct tweet without saving to database
          const result = await postTweetMutation({
            content: post.content,
            imageUrl: post.imageUrl,
            userId: post.userId || "unknown",
          });

          if (!result.success) {
            throw new Error(result.error || "Failed to publish to Twitter");
          }

          toast({
            title: "Success",
            description: "Your post has been published to Twitter",
          });

          return {
            ...post,
            twitterPostId: result.tweetId,
            status: "published",
            publishedAt: Date.now(),
          };
        } else {
          // If post has ID, publish existing post
          const result = await publishTweetMutation({
            postId: post.id as Id<"campaignPosts">,
          });

          if (!result.success) {
            throw new Error(result.error || "Failed to publish to Twitter");
          }

          toast({
            title: "Success",
            description: "Your post has been published to Twitter",
          });

          return {
            ...post,
            twitterPostId: result.tweetId,
            status: "published",
            publishedAt: Date.now(),
            sharedOnTwitter: true,
          };
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to publish post to Twitter",
          variant: "destructive",
        });
        throw error;
      }
    },

    cancelScheduledPost: async (post: TwitterPost) => {
      try {
        if (!post.id) {
          throw new Error("Post ID is required for canceling a scheduled post");
        }

        // Cancel the scheduled post using Convex
        const result = await cancelScheduledPostMutation({
          postId: post.id as Id<"campaignPosts">,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to cancel scheduled post");
        }

        toast({
          title: "Post Unscheduled",
          description: "Your scheduled post has been cancelled",
        });

        return true;
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to cancel scheduled post",
          variant: "destructive",
        });
        return false;
      }
    },

    // Get scheduled posts for a campaign
    useScheduledPosts: (campaignId?: Id<"campaigns">) => {
      return useQuery(
        api.twitter.getScheduledPosts,
        campaignId ? { campaignId } : {},
      );
    },
  };
}
