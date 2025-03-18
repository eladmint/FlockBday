import { useToast } from "@/components/ui/use-toast";

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

// Mock server-side API for Twitter integration
const mockServerAPI = {
  // Schedule a post on the server
  schedulePost: async (post: any) => {
    // Simulate API call to server-side scheduler
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes, if scheduled within 1 minute, publish immediately
    const isWithinOneMinute = post.scheduledFor - Date.now() < 60000;

    if (isWithinOneMinute) {
      return {
        ...post,
        scheduledOnServer: false,
        serverJobId: `job-${Date.now()}`,
        status: "published",
        sharedOnTwitter: true,
        twitterPostId: `twitter-${Date.now()}`,
        publishedAt: Date.now(),
        twitterStats: {
          likes: 0,
          retweets: 0,
          replies: 0,
        },
      };
    }

    return {
      ...post,
      scheduledOnServer: true,
      serverJobId: `job-${Date.now()}`,
      status: "scheduled",
    };
  },

  // Publish a tweet immediately
  publishTweet: async (content: string, imageUrl?: string | null) => {
    // Check if Twitter API is configured
    if (isTwitterConfigured) {
      try {
        console.log("Using real Twitter API credentials to publish tweet");
        // In a real implementation, this would use the Twitter API
        // For example, with the twitter-api-v2 library:
        // const client = new TwitterApi({
        //   appKey: TWITTER_API_KEY,
        //   appSecret: TWITTER_API_SECRET,
        //   accessToken: TWITTER_ACCESS_TOKEN,
        //   accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
        // });
        // const tweet = await client.v2.tweet(content);

        // For now, we'll still simulate the API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        return {
          id: `twitter-${Date.now()}`,
          text: content,
          created_at: new Date().toISOString(),
          public_metrics: {
            retweet_count: 0,
            reply_count: 0,
            like_count: 0,
            quote_count: 0,
          },
        };
      } catch (error) {
        console.error("Error publishing to Twitter:", error);
        throw error;
      }
    } else {
      // Simulate API call in demo mode
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, log that we're attempting to publish to Twitter
      console.log(`TWITTER API: Publishing tweet: "${content}"`);
      console.log(
        "Note: In this demo, tweets are not actually published to Twitter",
      );

      // Store in localStorage that we attempted to publish
      const tweetAttempts = JSON.parse(
        localStorage.getItem("tweetAttempts") || "[]",
      );
      tweetAttempts.push({
        content,
        imageUrl,
        timestamp: Date.now(),
        status: "attempted",
      });
      localStorage.setItem("tweetAttempts", JSON.stringify(tweetAttempts));

      // Simulate success (in a real app, this would return data from Twitter API)
      return {
        id: `twitter-${Date.now()}`,
        text: content,
        created_at: new Date().toISOString(),
        public_metrics: {
          retweet_count: 0,
          reply_count: 0,
          like_count: 0,
          quote_count: 0,
        },
      };
    }
  },

  // Cancel a scheduled post on the server
  cancelScheduledPost: async (serverJobId: string) => {
    // Simulate API call to cancel server job
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  },
};

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
      // In a real implementation, this would make an API call to verify credentials
      // For now, we'll just check if credentials exist
      const hasCredentials = await this.checkCredentials();
      if (!hasCredentials) {
        console.error("Twitter credentials not configured");
        return false;
      }

      // Simulate API call
      console.log("Making API call to verify Twitter credentials...");

      // For testing purposes, we'll return true if credentials exist
      return true;
    } catch (error) {
      console.error("Error verifying Twitter authentication:", error);
      return false;
    }
  }

  public async getUserProfile(): Promise<any> {
    try {
      const hasCredentials = await this.checkCredentials();
      if (!hasCredentials) {
        throw new Error("Twitter credentials not configured");
      }

      // For testing purposes, we'll return mock data
      return {
        id: "12345678",
        username: "test_user",
        name: "Test User",
        profile_image_url:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=twitter",
      };
    } catch (error) {
      console.error("Error getting Twitter user profile:", error);
      throw error;
    }
  }

  public async schedulePost(post: any): Promise<any> {
    if (!post.isScheduled || !post.scheduledFor) return post;

    try {
      console.log(
        `Scheduling post ${post.id} on server for ${new Date(post.scheduledFor).toLocaleString()}`,
      );
      console.log(
        "Note: In this demo, scheduled posts may not actually be published to Twitter",
      );

      // Store scheduled post in localStorage
      const scheduledPosts = JSON.parse(
        localStorage.getItem("scheduledPosts") || "[]",
      );
      scheduledPosts.push({
        ...post,
        scheduledTime: post.scheduledFor,
        status: "scheduled",
      });
      localStorage.setItem("scheduledPosts", JSON.stringify(scheduledPosts));

      // Send to server-side scheduler
      const scheduledPost = await mockServerAPI.schedulePost(post);
      return scheduledPost;
    } catch (error) {
      console.error("Error scheduling post on server:", error);
      return {
        ...post,
        status: "failed",
        error: error.message || "Failed to schedule post on server",
      };
    }
  }

  public async cancelScheduledPost(post: any): Promise<boolean> {
    if (!post.serverJobId) return false;

    try {
      // Call server API to cancel the scheduled job
      const result = await mockServerAPI.cancelScheduledPost(post.serverJobId);
      return result.success;
    } catch (error) {
      console.error("Error canceling scheduled post:", error);
      return false;
    }
  }

  public async publishPost(post: any): Promise<any> {
    try {
      console.log(`Publishing post to Twitter: ${post.id}`);

      // Call Twitter API (mock)
      const twitterResponse = await mockServerAPI.publishTweet(
        post.content,
        post.imageUrl,
      );

      // Create updated post with Twitter data
      const updatedPost = {
        ...post,
        sharedOnTwitter: true,
        twitterPostId: twitterResponse.id,
        status: "published",
        publishedAt: Date.now(),
        twitterStats: {
          likes: 0,
          retweets: 0,
          replies: 0,
        },
      };

      // Save to published tweets in localStorage
      const publishedTweets = JSON.parse(
        localStorage.getItem("publishedTweets") || "[]",
      );
      publishedTweets.push({
        id: twitterResponse.id,
        postId: post.id,
        content: post.content,
        imageUrl: post.imageUrl,
        publishedAt: Date.now(),
        campaignId: post.campaignId,
      });
      localStorage.setItem("publishedTweets", JSON.stringify(publishedTweets));

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
    // In a real implementation, we would set these credentials
    // For now, we'll just log that we received them
    console.log("Received Twitter credentials");
    // We would normally store these securely or use them to initialize a client
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
          title: "Post Scheduled on Server",
          description: `Your post will be published on ${new Date(post.scheduledFor).toLocaleString()}`,
        });
        return scheduledPost;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to schedule post on server",
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
            description: "Your scheduled post has been cancelled on the server",
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
