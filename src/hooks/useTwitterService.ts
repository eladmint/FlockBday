import { useTwitterIntegration } from "./useTwitterIntegration";
import { useToast } from "@/components/ui/use-toast";
import { TwitterService } from "@/services/twitter-service";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Define a proper type for the post object
export interface TwitterPost {
  id?: string;
  content: string;
  imageUrl?: string;
  scheduledFor?: string;
  status?: string;
  userId?: string;
  twitterPostId?: string;
  createdAt?: string;
}

/**
 * Hook that combines Twitter integration status with Twitter service functionality
 * This consolidates the duplicate logic between components
 */
export function useTwitterService() {
  const twitterIntegration = useTwitterIntegration();
  const twitterService = TwitterService.getInstance();
  const { toast } = useToast();

  // Convex mutations for Twitter actions
  const postTweetMutation = useMutation(api.twitter.postTweet);

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
        const scheduledPost = await twitterService.schedulePost(post);
        toast({
          title: "Post Scheduled",
          description: post.scheduledFor
            ? `Your post will be published on ${new Date(post.scheduledFor).toLocaleString()}`
            : "Your post has been scheduled",
        });
        return scheduledPost;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to schedule post",
          variant: "destructive",
        });
        throw error;
      }
    },

    publishNow: async (post: TwitterPost) => {
      try {
        // First update local state with a placeholder
        const placeholderPost = await twitterService.publishPost(post);

        // Then use Convex to actually post to Twitter
        if (twitterIntegration.isConnected) {
          const result = await postTweetMutation({
            content: post.content,
            imageUrl: post.imageUrl,
            userId: post.userId || "unknown",
          });

          if (!result.success) {
            throw new Error(result.error || "Failed to publish to Twitter");
          }

          // Update with real Twitter data
          placeholderPost.twitterPostId = result.tweetId;
          placeholderPost.status = "published";
        }

        toast({
          title: "Success",
          description: "Your post has been published to Twitter",
        });

        return placeholderPost;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to publish post to Twitter",
          variant: "destructive",
        });
        throw error;
      }
    },

    cancelScheduledPost: async (post: TwitterPost) => {
      try {
        const cancelled = await twitterService.cancelScheduledPost(post);
        if (cancelled) {
          toast({
            title: "Post Unscheduled",
            description: "Your scheduled post has been cancelled",
          });
        }
        return cancelled;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to cancel scheduled post",
          variant: "destructive",
        });
        return false;
      }
    },
  };
}
