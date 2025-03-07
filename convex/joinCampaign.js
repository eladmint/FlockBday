import { v } from "convex/values";
import { mutation } from "./_generated/server";

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
