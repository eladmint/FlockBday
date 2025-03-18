import { TwitterService } from "@/services/twitter-service";
import { useToast } from "@/components/ui/use-toast";

/**
 * This utility function tests the Twitter API integration
 * by attempting to perform common operations and logging the results.
 */
export async function testTwitterIntegration() {
  console.log("🧪 Starting Twitter API integration test...");

  // Get the Twitter service instance
  const twitterService = TwitterService.getInstance();

  try {
    // Test 1: Check if Twitter credentials are configured
    console.log("Test 1: Checking Twitter credentials configuration...");
    const hasCredentials = await twitterService.checkCredentials();
    console.log(
      `Credentials configured: ${hasCredentials ? "✅ Yes" : "❌ No"}`,
    );

    if (!hasCredentials) {
      console.error("Twitter credentials are not properly configured.");
      console.log(
        "Please check your environment variables or settings for Twitter API keys.",
      );
      return false;
    }

    // Test 2: Verify authentication
    console.log("Test 2: Verifying authentication...");
    const isAuthenticated = await twitterService.verifyAuthentication();
    console.log(
      `Authentication successful: ${isAuthenticated ? "✅ Yes" : "❌ No"}`,
    );

    if (!isAuthenticated) {
      console.error("Twitter authentication failed.");
      console.log("Please check your API keys and tokens.");
      return false;
    }

    // Test 3: Get user profile
    console.log("Test 3: Retrieving user profile...");
    const userProfile = await twitterService.getUserProfile();
    console.log(`User profile retrieved: ${userProfile ? "✅ Yes" : "❌ No"}`);
    console.log("Profile:", userProfile);

    // Test 4: Post a test tweet (optional - commented out for safety)
    /*
    console.log("Test 4: Posting a test tweet...");
    const testTweet = {
      content: "This is a test tweet from our application. Please ignore. #testing " + new Date().toISOString(),
      campaignId: "test"
    };
    const postResult = await twitterService.publishPost(testTweet);
    console.log(`Test tweet posted: ${postResult ? "✅ Yes" : "❌ No"}`);
    console.log("Post result:", postResult);
    */

    console.log("🎉 Twitter API integration test completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Twitter API integration test failed:", error);
    console.log(
      "Error details:",
      error instanceof Error ? error.message : String(error),
    );
    console.log(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace available",
    );
    return false;
  }
}

/**
 * React hook for testing Twitter integration in components
 */
export function useTwitterTest() {
  const { toast } = useToast();

  const runTest = async () => {
    try {
      toast({
        title: "Twitter Test",
        description:
          "Starting Twitter integration test. Check console for details.",
      });

      const result = await testTwitterIntegration();

      if (result) {
        toast({
          title: "Twitter Test Successful",
          description: "Twitter API integration is working correctly.",
        });
      } else {
        toast({
          title: "Twitter Test Failed",
          description:
            "Twitter API integration test failed. Check console for details.",
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      toast({
        title: "Twitter Test Error",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return { runTest };
}
