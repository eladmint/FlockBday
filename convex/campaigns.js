import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all campaigns for the current user (owned or collaborated)
export const getMyCampaigns = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    let tokenIdentifier;

    if (!identity) {
      // For demo purposes, use a mock user ID
      tokenIdentifier = "demo-user-123";

      // Check if mock user exists
      const mockUser = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
        .first();

      if (!mockUser) {
        // Create mock user
        await ctx.db.insert("users", {
          tokenIdentifier,
          name: "Demo User",
          email: "demo@example.com",
          createdAt: Date.now(),
        });
      }
    } else {
      tokenIdentifier = identity.subject;
    }

    return [];
  },
});

// Get trending public campaigns
export const getTrendingCampaigns = query({
  handler: async (ctx) => {
    return [];
  },
});

// Create a new campaign
export const createCampaign = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    visibility: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let tokenIdentifier;

    if (!identity) {
      // For demo purposes, use a mock user ID
      tokenIdentifier = "demo-user-123";

      // Check if mock user exists
      const mockUser = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
        .first();

      if (!mockUser) {
        // Create mock user
        await ctx.db.insert("users", {
          tokenIdentifier,
          name: "Demo User",
          email: "demo@example.com",
          createdAt: Date.now(),
        });
      }
    } else {
      tokenIdentifier = identity.subject;

      // Create user if not exists
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
        .first();

      if (!user) {
        await ctx.db.insert("users", {
          tokenIdentifier,
          name: identity.name || "User",
          email: identity.email || "",
          image: identity.pictureUrl,
          createdAt: Date.now(),
        });
      }
    }

    // Create the campaign
    const campaignId = await ctx.db.insert("campaigns", {
      title: args.title,
      description: args.description,
      visibility: args.visibility,
      createdBy: tokenIdentifier,
      createdAt: Date.now(),
      status: "active",
    });

    // Add the user as the owner
    await ctx.db.insert("campaignMembers", {
      campaignId,
      userId: tokenIdentifier,
      role: "owner",
      joinedAt: Date.now(),
      status: "active",
    });

    return campaignId;
  },
});
