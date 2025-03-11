import { mutation } from "./_generated/server";

// Create a demo user directly
export const createDemoUser = mutation({
  handler: async (ctx) => {
    const tokenIdentifier = "demo-user-123";

    try {
      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
        .first();

      if (existingUser) {
        console.log("Demo user already exists:", existingUser._id);
        return { success: true, userId: existingUser._id, exists: true };
      }

      // Create the user
      const userId = await ctx.db.insert("users", {
        tokenIdentifier,
        name: "Demo User",
        email: "demo@example.com",
        createdAt: Date.now(),
      });

      console.log("Created demo user:", userId);
      return { success: true, userId, exists: false };
    } catch (error) {
      console.error("Error creating demo user:", error);
      return { success: false, error: error.message };
    }
  },
});
