// Mock Twitter service implementation to avoid dependency on twitter-api-v2

export class MockTwitterApi {
  private appKey: string;
  private appSecret: string;
  private accessToken: string;
  private accessSecret: string;

  constructor(config: {
    appKey: string;
    appSecret: string;
    accessToken: string;
    accessSecret: string;
  }) {
    this.appKey = config.appKey;
    this.appSecret = config.appSecret;
    this.accessToken = config.accessToken;
    this.accessSecret = config.accessSecret;
  }

  // Mock v2 API methods
  public v2 = {
    tweet: async (content: string) => {
      console.log(`[MOCK] Tweeting: ${content}`);
      return {
        data: {
          id: `mock-tweet-${Date.now()}`,
          text: content,
        },
      };
    },
    singleTweet: async (id: string, options: any) => {
      console.log(`[MOCK] Getting tweet details for: ${id}`);
      return {
        data: {
          id,
          text: "Mock tweet content",
          created_at: new Date().toISOString(),
          public_metrics: {
            retweet_count: 0,
            reply_count: 0,
            like_count: 0,
            quote_count: 0,
          },
        },
      };
    },
    me: async (options?: any) => {
      console.log("[MOCK] Getting authenticated user");
      return {
        data: {
          id: "mock-user-id",
          username: "mock_user",
          name: "Mock User",
          profile_image_url:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=mockuser",
          description: "This is a mock Twitter user for testing",
          public_metrics: {
            followers_count: 100,
            following_count: 50,
            tweet_count: 200,
            listed_count: 5,
          },
        },
      };
    },
  };
}
