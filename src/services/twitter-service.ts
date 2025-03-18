import { useToast } from "@/components/ui/use-toast";
import { createTwitterClient } from "./twitter-api-client";

// Twitter API credentials from environment variables
const TWITTER_API_KEY = import.meta.env.VITE_TWITTER_API_KEY;
const TWITTER_API_SECRET = import.meta.env.VITE_TWITTER_API_SECRET;
const TWITTER_ACCESS_TOKEN = import.meta.env.VITE_TWITTER_ACCESS_TOKEN;
const TWITTER_ACCESS_TOKEN_SECRET = import.meta.env
  .VITE_TWITTER_ACCESS_TOKEN_SECRET;

// Check if Twitter credentials are configured
const isTwitterConfigured = !!(
  TWITTER_API_KEY &&
  TWITTER_API_SECRET &&
  TWITTER_ACCESS_TOKEN &&
  TWITTER_ACCESS_TOKEN_SECRET
);

// Create Twitter client if credentials are available
let twitterClient = null;
try {
  if (isTwitterConfigured) {
    twitterClient = createTwitterClient();
    console.log("Twitter client initialized successfully");
  }
} catch (error) {
  console.error("Failed to initialize Twitter client:", error);
}

export class TwitterService {
  private static instance: TwitterService;

  private constructor() {}

  public static getInstance(): TwitterService {
    if (!TwitterService.instance) {
      TwitterService.instance = new TwitterService();
    }
    return TwitterService.instance;
  }

  public async checkCredentials(): Promise<boolean> {
    return !!(
      TWITTER_API_KEY &&
      TWITTER_API_SECRET &&
      TWITTER_ACCESS_TOKEN &&
      TWITTER_ACCESS_TOKEN_SECRET
    );
  }

  public async verifyAuthentication(): Promise<boolean> {
    try {
      // Check if credentials exist
      const hasCredentials = await this.checkCredentials();
      if (!hasCredentials) {
        console.error("Twitter credentials not configured");
        return false;
      }

      if (!twitterClient) {
        console.error("Twitter client not initialized");
        return false;
      }

      // Make a real API call to verify credentials
      console.log("Making API call to verify Twitter credentials...");

      // Get the authenticated user to verify credentials
      const user = await twitterClient.v2.me();
      return !!user.data.id;
    } catch (error) {
      console.error("Error verifying Twitter authentication:", error);
      return false;
    }
  }

  public async getUserProfile(): Promise<any> {
    try {
      const hasCredentials = await this.checkCredentials();
      if (!hasCredentials || !twitterClient) {
        throw new Error(
          "Twitter credentials not configured or client not initialized",
        );
      }

      // Get the authenticated user profile
      const user = await twitterClient.v2.me({
        expansions: ["pinned_tweet_id"],
        "user.fields": ["profile_image_url", "description", "public_metrics"],
      });

      return {
        id: user.data.id,
        username: user.data.username,
        name: user.data.name,
        profile_image_url:
          user.data.profile_image_url ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.data.id}`,
        description: user.data.description,
        metrics: user.data.public_metrics,
      };
    } catch (error) {
      console.error("Error getting Twitter user profile:", error);
      throw error;
    }
  }

  public async schedulePost(post: any): Promise<any> {
    if (!post.isScheduled || !post.scheduledFor) return post;

    try {
      // For scheduled posts, we'll use the Convex backend
      // This will be handled by the server-side scheduler
      console.log(
        `Scheduling post ${post.id} for ${new Date(post.scheduledFor).toLocaleString()}`,
      );

      // In a real implementation, you would call a Convex mutation here
      // to store the scheduled post in the database
      // For now, we'll just return the post with updated status
      return {
        ...post,
        status: "scheduled",
        serverJobId: `job-${Date.now()}`,
      };
    } catch (error) {
      console.error("Error scheduling post:", error);
      return {
        ...post,
        status: "failed",
        error: error.message || "Failed to schedule post",
      };
    }
  }

  public async cancelScheduledPost(post: any): Promise<boolean> {
    if (!post.serverJobId) return false;

    try {
      // In a real implementation, you would call a Convex mutation here
      // to cancel the scheduled post
      // For now, we'll just return success
      return true;
    } catch (error) {
      console.error("Error canceling scheduled post:", error);
      return false;
    }
  }

  public async publishPost(post: any): Promise<any> {
    try {
      if (!twitterClient) {
        throw new Error("Twitter client not initialized");
      }

      console.log(`Publishing post to Twitter: ${post.id}`);

      // Call Twitter API to post the tweet
      let tweetResponse;
      if (post.imageUrl) {
        // For posts with images, we would need to download and upload the image
        // This is a simplified version that just includes the image URL in the tweet
        tweetResponse = await twitterClient.v2.tweet(
          `${post.content} ${post.imageUrl}`,
        );
      } else {
        tweetResponse = await twitterClient.v2.tweet(post.content);
      }

      // Create updated post with Twitter data
      const updatedPost = {
        ...post,
        sharedOnTwitter: true,
        twitterPostId: tweetResponse.data.id,
        status: "published",
        publishedAt: Date.now(),
        twitterStats: {
          likes: 0,
          retweets: 0,
          replies: 0,
        },
      };

      return updatedPost;
    } catch (error) {
      console.error("Error publishing to Twitter:", error);
      return {
        ...post,
        status: "failed",
        error: error.message || "Failed to publish to Twitter",
      };
    }
  }

  public setCredentials({
    apiKey,
    apiSecret,
    accessToken,
    accessTokenSecret,
  }: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
  }): void {
    console.log("Setting Twitter credentials");

    try {
      // Initialize Twitter client with provided credentials
      twitterClient = createTwitterClient({
        apiKey,
        apiSecret,
        accessToken,
        accessTokenSecret,
      });

      console.log("Twitter client initialized with provided credentials");
    } catch (error) {
      console.error(
        "Failed to initialize Twitter client with provided credentials:",
        error,
      );
      twitterClient = null;
    }
  }
}

// Hook for components to use the Twitter service
export function useTwitterService() {
  const twitterService = TwitterService.getInstance();
  const { toast } = useToast();

  return {
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
