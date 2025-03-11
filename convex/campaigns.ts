import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get all campaigns for the current user (owned or collaborated)
export const getMyCampaigns = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    let tokenIdentifier;

    if (!identity) {
      // For demo purposes, use a mock user ID
      tokenIdentifier = "demo-user-123";

      // In a real app, we would create the user if it doesn't exist
      // But we can't do that in a query function, so we'll just use the ID
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
      // Note: We're just using the ID without checking if the user exists
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

// Get a single campaign by ID
export const getCampaign = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let tokenIdentifier;

    if (!identity) {
      // For demo purposes, use a mock user ID
      tokenIdentifier = "demo-user-123";
    } else {
      tokenIdentifier = identity.subject;
    }

    // Get the campaign
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Check if user is a member of the campaign
    const membership = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign_and_user", (q) =>
        q.eq("campaignId", args.campaignId).eq("userId", tokenIdentifier),
      )
      .first();

    // If not a member, check if campaign is public
    if (!membership && campaign.visibility !== "public") {
      throw new Error("Not authorized to view this campaign");
    }

    // Get post count
    const posts = await ctx.db
      .query("campaignPosts")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    // Get collaborator count
    const collaborators = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    // Get creator info
    const creator = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", campaign.createdBy))
      .first();

    return {
      ...campaign,
      _id: args.campaignId,
      id: args.campaignId,
      postsCount: posts.length,
      collaboratorsCount: collaborators.length,
      isOwner: campaign.createdBy === tokenIdentifier,
      isMember: !!membership,
      createdByName: creator?.name || "Unknown User",
      createdByAvatar:
        creator?.image ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${campaign.createdBy}`,
    };
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
      // For demo purposes, always use a mock user ID
      tokenIdentifier = "demo-user-123";
    } else {
      tokenIdentifier = identity.subject;
    }

    // Always ensure the user exists in the database
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .first();

    if (!existingUser) {
      // Create user if not exists
      await ctx.db.insert("users", {
        tokenIdentifier,
        name: identity?.name || "Demo User",
        email: identity?.email || "demo@example.com",
        image: identity?.pictureUrl,
        createdAt: Date.now(),
      });
    }

    // Check if the user has reached the free tier limit (3 campaigns)
    const userCampaigns = await ctx.db
      .query("campaignMembers")
      .withIndex("by_user", (q) => q.eq("userId", tokenIdentifier))
      .filter((q) => q.eq(q.field("role"), "owner"))
      .collect();

    // Get subscription status
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", tokenIdentifier))
      .first();

    const hasActiveSubscription = subscription?.status === "active";

    // If the user has reached the limit and doesn't have an active subscription, throw an error
    if (userCampaigns.length >= 3 && !hasActiveSubscription) {
      throw new Error(
        "Free tier limit reached. Please upgrade to create more campaigns.",
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

// Join a campaign
export const joinCampaign = mutation({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let tokenIdentifier;

    if (!identity) {
      // For demo purposes, use a mock user ID
      tokenIdentifier = "demo-user-123";
    } else {
      tokenIdentifier = identity.subject;
    }

    // Check if the campaign exists
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Check if the campaign is public
    if (campaign.visibility !== "public") {
      throw new Error("Campaign is not public");
    }

    // Check if the user is already a member
    const existingMembership = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign_and_user", (q) =>
        q.eq("campaignId", args.campaignId).eq("userId", tokenIdentifier),
      )
      .first();

    if (existingMembership) {
      throw new Error("Already a member of this campaign");
    }

    // Add the user as a member
    await ctx.db.insert("campaignMembers", {
      campaignId: args.campaignId,
      userId: tokenIdentifier,
      role: "member",
      joinedAt: Date.now(),
      status: "active",
    });

    return { success: true };
  },
});

// Request to join a campaign
export const requestToJoinCampaign = mutation({
  args: {
    campaignId: v.id("campaigns"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let tokenIdentifier;

    if (!identity) {
      // For demo purposes, use a mock user ID
      tokenIdentifier = "demo-user-123";
    } else {
      tokenIdentifier = identity.subject;
    }

    // Check if the campaign exists
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Check if the user is already a member
    const existingMembership = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign_and_user", (q) =>
        q.eq("campaignId", args.campaignId).eq("userId", tokenIdentifier),
      )
      .first();

    if (existingMembership) {
      throw new Error("Already a member of this campaign");
    }

    // Check if there's already a pending request
    const existingRequest = await ctx.db
      .query("campaignJoinRequests")
      .withIndex("by_campaign_and_status", (q) =>
        q.eq("campaignId", args.campaignId).eq("status", "pending"),
      )
      .filter((q) => q.eq(q.field("userId"), tokenIdentifier))
      .first();

    if (existingRequest) {
      throw new Error(
        "You already have a pending request to join this campaign",
      );
    }

    // Create a join request
    const requestId = await ctx.db.insert("campaignJoinRequests", {
      campaignId: args.campaignId,
      userId: tokenIdentifier,
      message: args.message,
      requestedAt: Date.now(),
      status: "pending",
    });

    // Create a notification for the campaign owner
    await ctx.db.insert("notifications", {
      userId: campaign.createdBy,
      type: "join_request",
      title: "New Join Request",
      content: `Someone has requested to join your campaign: ${campaign.title}`,
      createdAt: Date.now(),
      read: false,
      sourceId: requestId.toString(),
      sourceType: "campaignJoinRequest",
      actorId: tokenIdentifier,
    });

    return requestId;
  },
});

// Update a campaign
export const updateCampaign = mutation({
  args: {
    campaignId: v.id("campaigns"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    visibility: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    status: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let tokenIdentifier;

    if (!identity) {
      // For demo purposes, use a mock user ID
      tokenIdentifier = "demo-user-123";
    } else {
      tokenIdentifier = identity.subject;
    }

    // Check if the campaign exists
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Check if the user is the owner or an admin
    const membership = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign_and_user", (q) =>
        q.eq("campaignId", args.campaignId).eq("userId", tokenIdentifier),
      )
      .first();

    if (
      !membership ||
      (membership.role !== "owner" && membership.role !== "admin")
    ) {
      throw new Error("Not authorized to update this campaign");
    }

    // Update the campaign
    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) updateData.title = args.title;
    if (args.description !== undefined)
      updateData.description = args.description;
    if (args.visibility !== undefined) updateData.visibility = args.visibility;
    if (args.imageUrl !== undefined) updateData.imageUrl = args.imageUrl;
    if (args.status !== undefined) updateData.status = args.status;
    if (args.tags !== undefined) updateData.tags = args.tags;

    await ctx.db.patch(args.campaignId, updateData);

    return args.campaignId;
  },
});

// Delete a campaign
export const deleteCampaign = mutation({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let tokenIdentifier;

    if (!identity) {
      // For demo purposes, use a mock user ID
      tokenIdentifier = "demo-user-123";
    } else {
      tokenIdentifier = identity.subject;
    }

    // Check if the campaign exists
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Check if the user is the owner
    const membership = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign_and_user", (q) =>
        q.eq("campaignId", args.campaignId).eq("userId", tokenIdentifier),
      )
      .first();

    if (!membership || membership.role !== "owner") {
      throw new Error("Not authorized to delete this campaign");
    }

    // Delete all campaign members
    const members = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    // Delete all campaign posts
    const posts = await ctx.db
      .query("campaignPosts")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    for (const post of posts) {
      await ctx.db.delete(post._id);
    }

    // Delete all join requests
    const joinRequests = await ctx.db
      .query("campaignJoinRequests")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    for (const request of joinRequests) {
      await ctx.db.delete(request._id);
    }

    // Delete the campaign
    await ctx.db.delete(args.campaignId);

    return { success: true };
  },
});
