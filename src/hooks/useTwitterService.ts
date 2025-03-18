import { useTwitterIntegration } from "./useTwitterIntegration";
import { useToast } from "@/components/ui/use-toast";
import { TwitterService } from "@/services/twitter-service";

/**
 * Hook that combines Twitter integration status with Twitter service functionality
 * This consolidates the duplicate logic between components
 */
export function useTwitterService() {
  const twitterIntegration = useTwitterIntegration();
  const twitterService = TwitterService.getInstance();
  const { toast } = useToast();

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
    schedulePost: async (post: any) => {
      try {
        const scheduledPost = await twitterService.schedulePost(post);
        toast({
          title: "Post Scheduled",
          description: `Your post will be published on ${new Date(post.scheduledFor).toLocaleString()}`,
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

    publishNow: async (post: any) => {
      try {
        const updatedPost = await twitterService.publishPost(post);
        toast({
          title: "Success",
          description: "Your post has been published to Twitter",
        });
        return updatedPost;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to publish post to Twitter",
          variant: "destructive",
        });
        throw error;
      }
    },

    cancelScheduledPost: async (post: any) => {
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
