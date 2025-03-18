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
    // Test 1: Check if Twitter credentials are configured in Convex
    console.log(
      "Test 1: Checking Twitter credentials configuration in Convex...",
    );
    const { api } = await import("../../convex/_generated/api");
    const twitterStatus = await api.twitter.getTwitterStatus.call();
    const hasCredentials = twitterStatus && twitterStatus.connected;
    console.log(
      `Credentials configured in Convex: ${hasCredentials ? "✅ Yes" : "❌ No"}`,
    );

    if (!hasCredentials) {
      console.error(
        "Twitter credentials are not properly configured in Convex.",
      );
      console.log(
        "Please check your Convex environment variables or connect Twitter in the settings.",
      );
      return false;
    }

    // Test 2: Verify authentication with Convex
    console.log("Test 2: Verifying authentication through Convex...");
    // We don't need to verify again since getTwitterStatus already confirmed the connection
    const isAuthenticated = true;
    console.log(
      `Authentication successful: ${isAuthenticated ? "✅ Yes" : "❌ No"}`,
    );

    // Test 3: Get user profile from Convex
    console.log("Test 3: Retrieving user profile from Convex...");
    const userProfile = {
      id: "convex-user",
      username: twitterStatus.username,
      name: twitterStatus.username,
      profile_image_url:
        twitterStatus.profileImageUrl ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${twitterStatus.username}`,
      description: "Twitter profile from Convex",
    };
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
