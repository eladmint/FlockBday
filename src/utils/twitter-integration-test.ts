import { api } from "../../convex/_generated/api";
import { convexIdToString } from "./convexHelpers";

/**
 * Test utility for Twitter integration
 * This can be used to verify that the Twitter integration is working correctly
 */
export async function testTwitterIntegration(campaignId: string) {
  console.log("🧪 Starting Twitter integration test...");
  const results = {
    success: false,
    steps: [] as Array<{ step: string; success: boolean; message: string }>,
    errors: [] as string[],
  };

  try {
    // Step 1: Check Twitter status
    console.log("Step 1: Checking Twitter account status...");
    const twitterStatus = await api.twitter.getTwitterStatus.query();

    results.steps.push({
      step: "Check Twitter account status",
      success: twitterStatus.connected,
      message: twitterStatus.connected
        ? `Connected as @${twitterStatus.username}`
        : "Twitter account not connected",
    });

    if (!twitterStatus.connected) {
      results.errors.push(
        "Twitter account not connected. Please connect your Twitter account in settings.",
      );
      return results;
    }

    // Step 2: Check campaign Twitter status
    console.log("Step 2: Checking campaign Twitter status...");
    const campaignTwitterStatus =
      await api.twitter.getCampaignTwitterStatus.query({
        campaignId,
      });

    results.steps.push({
      step: "Check campaign Twitter status",
      success: campaignTwitterStatus.enabled,
      message: campaignTwitterStatus.enabled
        ? "Twitter is enabled for this campaign"
        : "Twitter is not enabled for this campaign",
    });

    // Step 3: If not enabled, try to enable Twitter for the campaign
    if (!campaignTwitterStatus.enabled) {
      console.log("Step 3: Enabling Twitter for campaign...");
      try {
        const enableResult =
          await api.twitter.enableTwitterForCampaign.mutation({
            campaignId,
          });

        results.steps.push({
          step: "Enable Twitter for campaign",
          success: enableResult.success,
          message: enableResult.success
            ? "Successfully enabled Twitter for campaign"
            : "Failed to enable Twitter for campaign",
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        results.steps.push({
          step: "Enable Twitter for campaign",
          success: false,
          message: `Error: ${errorMessage}`,
        });
        results.errors.push(`Failed to enable Twitter: ${errorMessage}`);
      }
    }

    // Step 4: Create a test post
    console.log("Step 4: Creating a test post...");
    let postId;
    try {
      postId = await api.posts.createPost.mutation({
        campaignId,
        title: "Twitter Integration Test",
        content:
          "This is a test post for Twitter integration. Please ignore. #testing " +
          new Date().toISOString(),
        status: "draft",
      });

      results.steps.push({
        step: "Create test post",
        success: !!postId,
        message: postId
          ? `Created post with ID: ${postId}`
          : "Failed to create test post",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      results.steps.push({
        step: "Create test post",
        success: false,
        message: `Error: ${errorMessage}`,
      });
      results.errors.push(`Failed to create test post: ${errorMessage}`);
      return results;
    }

    // Step 5: Publish the post to Twitter (optional - commented out for safety)
    // Only uncomment this for actual testing when you want to post to Twitter
    /*
    if (postId) {
      console.log("Step 5: Publishing post to Twitter...");
      try {
        const publishResult = await api.posts.publishToTwitter.mutation({
          postId: convexIdToString(postId)
        });

        results.steps.push({
          step: "Publish to Twitter",
          success: publishResult.success,
          message: publishResult.success 
            ? `Successfully published to Twitter with tweet ID: ${publishResult.tweetId}` 
            : "Failed to publish to Twitter"
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.steps.push({
          step: "Publish to Twitter",
          success: false,
          message: `Error: ${errorMessage}`
        });
        results.errors.push(`Failed to publish to Twitter: ${errorMessage}`);
      }
    }
    */

    // Overall success is determined by whether there are any errors
    results.success = results.errors.length === 0;
    console.log("🎉 Twitter integration test completed!", results);
    return results;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.errors.push(`Test failed with error: ${errorMessage}`);
    console.error("❌ Twitter integration test failed:", error);
    return results;
  }
}

/**
 * React hook for testing Twitter integration in components
 */
export function useTwitterIntegrationTest() {
  const runTest = async (campaignId: string) => {
    return await testTwitterIntegration(campaignId);
  };

  return { runTest };
}
