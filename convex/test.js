import { mutation } from "./_generated/server";

// Test function to create a user and campaign directly
export const createTestCampaign = mutation({
  handler: async (ctx) => {
    // Create a test user
    const tokenIdentifier = "test-user-" + Date.now();

    try {
      const userId = await ctx.db.insert("users", {
        tokenIdentifier,
        name: "Test User",
        email: "test@example.com",
        createdAt: Date.now(),
      });

      console.log("Created test user:", userId);

      // Create a test campaign
      const campaignId = await ctx.db.insert("campaigns", {
        title: "Test Campaign",
        description: "This is a test campaign",
        visibility: "public",
        createdBy: tokenIdentifier,
        createdAt: Date.now(),
        status: "active",
      });

      console.log("Created test campaign:", campaignId);

      // Add the user as the owner
      const membershipId = await ctx.db.insert("campaignMembers", {
        campaignId,
        userId: tokenIdentifier,
        role: "owner",
        joinedAt: Date.now(),
        status: "active",
      });

      console.log("Created test membership:", membershipId);

      return { success: true, userId, campaignId, membershipId };
    } catch (error) {
      console.error("Error in test function:", error);
      return { success: false, error: error.message };
    }
  },
});
