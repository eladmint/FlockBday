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

    // Get all campaigns where the user is a member
    const memberships = await ctx.db
      .query("campaignMembers")
      .withIndex("by_user", (q) => q.eq("userId", tokenIdentifier))
      .collect();

    // Get the campaign IDs
    const campaignIds = memberships.map((membership) => membership.campaignId);

    // If no campaigns, return empty array
    if (campaignIds.length === 0) {
      return [];
    }

    // Get all campaigns
    const campaigns = await Promise.all(
      campaignIds.map(async (id) => {
        const campaign = await ctx.db.get(id);
        if (!campaign) return null;

        // Get the membership for this campaign
        const membership = memberships.find((m) => m.campaignId === id);

        // Get post count
        const posts = await ctx.db
          .query("campaignPosts")
          .withIndex("by_campaign", (q) => q.eq("campaignId", id))
          .collect();

        // Get collaborator count
        const collaborators = await ctx.db
          .query("campaignMembers")
          .withIndex("by_campaign", (q) => q.eq("campaignId", id))
          .collect();

        // Get creator info
        const creator = await ctx.db
          .query("users")
          .withIndex("by_token", (q) =>
            q.eq("tokenIdentifier", campaign.createdBy),
          )
          .first();

        return {
          ...campaign,
          _id: id,
          id: id,
          postsCount: posts.length,
          collaboratorsCount: collaborators.length,
          isOwner: membership?.role === "owner",
          isMember: true,
          createdByName: creator?.name || "Unknown User",
          createdByAvatar:
            creator?.image ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${campaign.createdBy}`,
        };
      }),
    );

    // Filter out null values and return
    return campaigns.filter(Boolean);
  },
});

// Get trending public campaigns
export const getTrendingCampaigns = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    let tokenIdentifier = identity?.subject;

    if (!tokenIdentifier) {
      // For demo purposes, use a mock user ID
      tokenIdentifier = "demo-user-123";
    }

    // Get all public campaigns
    const publicCampaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .order("desc")
      .take(10);

    // Get the campaign IDs
    const campaignIds = publicCampaigns.map((campaign) => campaign._id);

    // If no campaigns, return empty array
    if (campaignIds.length === 0) {
      return [];
    }

    // Get all campaigns with additional data
    const campaigns = await Promise.all(
      publicCampaigns.map(async (campaign) => {
        const id = campaign._id;

        // Get post count
        const posts = await ctx.db
          .query("campaignPosts")
          .withIndex("by_campaign", (q) => q.eq("campaignId", id))
          .collect();

        // Get collaborator count
        const collaborators = await ctx.db
          .query("campaignMembers")
          .withIndex("by_campaign", (q) => q.eq("campaignId", id))
          .collect();

        // Get creator info
        const creator = await ctx.db
          .query("users")
          .withIndex("by_token", (q) =>
            q.eq("tokenIdentifier", campaign.createdBy),
          )
          .first();

        // Check if the user is a member
        let isMember = false;
        if (tokenIdentifier) {
          const membership = await ctx.db
            .query("campaignMembers")
            .withIndex("by_campaign_and_user", (q) =>
              q.eq("campaignId", id).eq("userId", tokenIdentifier),
            )
            .first();
          isMember = !!membership;
        }

        return {
          ...campaign,
          _id: id,
          id: id,
          postsCount: posts.length,
          collaboratorsCount: collaborators.length,
          isOwner: campaign.createdBy === tokenIdentifier,
          isMember,
          createdByName: creator?.name || "Unknown User",
          createdByAvatar:
            creator?.image ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${campaign.createdBy}`,
        };
      }),
    );

    return campaigns;
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
    // Always use a mock user ID for demo purposes
    const tokenIdentifier = "demo-user-123";

    // First check if the user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .first();

    // If user doesn't exist, create it
    if (!existingUser) {
      try {
        const userId = await ctx.db.insert("users", {
          tokenIdentifier,
          name: "Demo User",
          email: "demo@example.com",
          createdAt: Date.now(),
        });
        console.log("Created new demo user for campaign creation:", userId);
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user before campaign creation");
      }
    } else {
      console.log(
        "Using existing user for campaign creation:",
        existingUser._id,
      );
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
