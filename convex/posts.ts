import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get all posts for a campaign
export const getCampaignPosts = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const tokenIdentifier = identity.subject;

    // Check if user is a member of the campaign
    const membership = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign_and_user", (q) =>
        q.eq("campaignId", args.campaignId).eq("userId", tokenIdentifier),
      )
      .first();

    // Get the campaign to check visibility
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // If not a member, check if campaign is public
    if (!membership && campaign.visibility !== "public") {
      throw new Error("Not authorized to view this campaign's posts");
    }

    // Get all posts for the campaign
    const posts = await ctx.db
      .query("campaignPosts")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .order("desc")
      .collect();

    return posts.map((post) => ({
      ...post,
      id: post._id,
    }));
  },
});

// Create a new post
export const createPost = mutation({
  args: {
    campaignId: v.id("campaigns"),
    title: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    status: v.string(),
    scheduledFor: v.optional(v.number()),
    sharedOnTwitter: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const tokenIdentifier = identity.subject;

    // Check if user is a member of the campaign
    const membership = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign_and_user", (q) =>
        q.eq("campaignId", args.campaignId).eq("userId", tokenIdentifier),
      )
      .first();

    if (!membership) {
      throw new Error("Not authorized to create posts in this campaign");
    }

    // Create the post
    const postId = await ctx.db.insert("campaignPosts", {
      campaignId: args.campaignId,
      title: args.title,
      content: args.content,
      imageUrl: args.imageUrl,
      createdBy: tokenIdentifier,
      createdAt: Date.now(),
      status: args.status,
      scheduledFor: args.scheduledFor,
      sharedOnTwitter: args.sharedOnTwitter || false,
    });

    // If the post is scheduled, create a scheduled job
    if (args.status === "scheduled" && args.scheduledFor) {
      await ctx.db.insert("scheduledJobs", {
        type: "twitter_post",
        status: "pending",
        scheduledFor: args.scheduledFor,
        data: {
          postId,
          campaignId: args.campaignId,
          content: args.content,
          imageUrl: args.imageUrl,
        },
        createdBy: tokenIdentifier,
        createdAt: Date.now(),
        retryCount: 0,
      });
    }

    // Update campaign post count
    const campaign = await ctx.db.get(args.campaignId);
    if (campaign) {
      await ctx.db.patch(args.campaignId, {
        updatedAt: Date.now(),
      });
    }

    return postId;
  },
});

// Update a post
export const updatePost = mutation({
  args: {
    postId: v.id("campaignPosts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    status: v.optional(v.string()),
    scheduledFor: v.optional(v.number()),
    sharedOnTwitter: v.optional(v.boolean()),
    twitterPostId: v.optional(v.string()),
    twitterStats: v.optional(
      v.object({
        likes: v.number(),
        retweets: v.number(),
        replies: v.number(),
      }),
    ),
    publishedAt: v.optional(v.number()),
    serverJobId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const tokenIdentifier = identity.subject;

    // Get the post
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user is the creator of the post or a campaign admin
    if (post.createdBy !== tokenIdentifier) {
      // Check if user is an admin of the campaign
      const membership = await ctx.db
        .query("campaignMembers")
        .withIndex("by_campaign_and_user", (q) =>
          q.eq("campaignId", post.campaignId).eq("userId", tokenIdentifier),
        )
        .first();

      if (
        !membership ||
        (membership.role !== "owner" && membership.role !== "admin")
      ) {
        throw new Error("Not authorized to update this post");
      }
    }

    // Update the post
    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) updateData.title = args.title;
    if (args.content !== undefined) updateData.content = args.content;
    if (args.imageUrl !== undefined) updateData.imageUrl = args.imageUrl;
    if (args.status !== undefined) updateData.status = args.status;
    if (args.scheduledFor !== undefined)
      updateData.scheduledFor = args.scheduledFor;
    if (args.sharedOnTwitter !== undefined)
      updateData.sharedOnTwitter = args.sharedOnTwitter;
    if (args.twitterPostId !== undefined)
      updateData.twitterPostId = args.twitterPostId;
    if (args.twitterStats !== undefined)
      updateData.twitterStats = args.twitterStats;
    if (args.publishedAt !== undefined)
      updateData.publishedAt = args.publishedAt;
    if (args.serverJobId !== undefined)
      updateData.serverJobId = args.serverJobId;

    await ctx.db.patch(args.postId, updateData);

    // If the post status changed to scheduled, create a scheduled job
    if (
      args.status === "scheduled" &&
      args.scheduledFor &&
      (!post.status || post.status !== "scheduled")
    ) {
      await ctx.db.insert("scheduledJobs", {
        type: "twitter_post",
        status: "pending",
        scheduledFor: args.scheduledFor,
        data: {
          postId: args.postId,
          campaignId: post.campaignId,
          content: args.content || post.content,
          imageUrl: args.imageUrl || post.imageUrl,
        },
        createdBy: tokenIdentifier,
        createdAt: Date.now(),
        retryCount: 0,
      });
    }

    return args.postId;
  },
});

// Delete a post
export const deletePost = mutation({
  args: {
    postId: v.id("campaignPosts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const tokenIdentifier = identity.subject;

    // Get the post
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user is the creator of the post or a campaign admin
    if (post.createdBy !== tokenIdentifier) {
      // Check if user is an admin of the campaign
      const membership = await ctx.db
        .query("campaignMembers")
        .withIndex("by_campaign_and_user", (q) =>
          q.eq("campaignId", post.campaignId).eq("userId", tokenIdentifier),
        )
        .first();

      if (
        !membership ||
        (membership.role !== "owner" && membership.role !== "admin")
      ) {
        throw new Error("Not authorized to delete this post");
      }
    }

    // Delete the post
    await ctx.db.delete(args.postId);

    // Delete any scheduled jobs for this post
    const scheduledJobs = await ctx.db
      .query("scheduledJobs")
      .withIndex("by_type_and_status", (q) =>
        q.eq("type", "twitter_post").eq("status", "pending"),
      )
      .collect();

    for (const job of scheduledJobs) {
      if (job.data.postId === args.postId) {
        await ctx.db.delete(job._id);
      }
    }

    return { success: true };
  },
});

// Get a single post by ID
export const getPost = query({
  args: { postId: v.id("campaignPosts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const tokenIdentifier = identity.subject;

    // Get the post
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Get the campaign to check visibility
    const campaign = await ctx.db.get(post.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Check if user is a member of the campaign
    const membership = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign_and_user", (q) =>
        q.eq("campaignId", post.campaignId).eq("userId", tokenIdentifier),
      )
      .first();

    // If not a member, check if campaign is public
    if (!membership && campaign.visibility !== "public") {
      throw new Error("Not authorized to view this post");
    }

    // Get the creator's information
    const creator = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", post.createdBy))
      .first();

    return {
      ...post,
      id: post._id,
      creatorName: creator?.name || "Unknown User",
      creatorImage: creator?.image || null,
    };
  },
});

// Get scheduled posts
export const getScheduledPosts = query({
  args: { campaignId: v.optional(v.id("campaigns")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const tokenIdentifier = identity.subject;

    let scheduledPosts;

    if (args.campaignId) {
      // Check if user is a member of the campaign
      const membership = await ctx.db
        .query("campaignMembers")
        .withIndex("by_campaign_and_user", (q) =>
          q.eq("campaignId", args.campaignId).eq("userId", tokenIdentifier),
        )
        .first();

      if (!membership) {
        throw new Error(
          "Not authorized to view this campaign's scheduled posts",
        );
      }

      // Get scheduled posts for the campaign
      scheduledPosts = await ctx.db
        .query("campaignPosts")
        .withIndex("by_campaign_and_status", (q) =>
          q.eq("campaignId", args.campaignId).eq("status", "scheduled"),
        )
        .collect();
    } else {
      // Get all campaigns the user is a member of
      const memberships = await ctx.db
        .query("campaignMembers")
        .withIndex("by_user", (q) => q.eq("userId", tokenIdentifier))
        .collect();

      const campaignIds = memberships.map((m) => m.campaignId);

      // Get scheduled posts for all campaigns the user is a member of
      scheduledPosts = [];
      for (const campaignId of campaignIds) {
        const posts = await ctx.db
          .query("campaignPosts")
          .withIndex("by_campaign_and_status", (q) =>
            q.eq("campaignId", campaignId).eq("status", "scheduled"),
          )
          .collect();

        scheduledPosts.push(...posts);
      }
    }

    // Sort by scheduled time
    scheduledPosts.sort((a, b) => {
      if (!a.scheduledFor || !b.scheduledFor) return 0;
      return a.scheduledFor - b.scheduledFor;
    });

    return scheduledPosts.map((post) => ({
      ...post,
      id: post._id,
    }));
  },
});

// Publish a post to Twitter
export const publishToTwitter = mutation({
  args: {
    postId: v.id("campaignPosts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const tokenIdentifier = identity.subject;

    // Get the post
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user is a member of the campaign
    const membership = await ctx.db
      .query("campaignMembers")
      .withIndex("by_campaign_and_user", (q) =>
        q.eq("campaignId", post.campaignId).eq("userId", tokenIdentifier),
      )
      .first();

    if (!membership) {
      throw new Error("Not authorized to publish posts in this campaign");
    }

    // Get the campaign to check if Twitter is enabled
    const campaign = await ctx.db.get(post.campaignId);
    if (!campaign || !campaign.twitterEnabled) {
      throw new Error("Twitter is not enabled for this campaign");
    }

    // In a real implementation, this would call the Twitter API
    // For now, we'll just update the post status
    await ctx.db.patch(args.postId, {
      status: "published",
      publishedAt: Date.now(),
      sharedOnTwitter: true,
      twitterPostId: `twitter-${Date.now()}`,
      twitterStats: {
        likes: 0,
        retweets: 0,
        replies: 0,
      },
    });

    return { success: true };
  },
});

// Cancel a scheduled post
export const cancelScheduledPost = mutation({
  args: {
    postId: v.id("campaignPosts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const tokenIdentifier = identity.subject;

    // Get the post
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if the post is scheduled
    if (post.status !== "scheduled") {
      throw new Error("Post is not scheduled");
    }

    // Check if user is the creator of the post or a campaign admin
    if (post.createdBy !== tokenIdentifier) {
      // Check if user is an admin of the campaign
      const membership = await ctx.db
        .query("campaignMembers")
        .withIndex("by_campaign_and_user", (q) =>
          q.eq("campaignId", post.campaignId).eq("userId", tokenIdentifier),
        )
        .first();

      if (
        !membership ||
        (membership.role !== "owner" && membership.role !== "admin")
      ) {
        throw new Error("Not authorized to cancel this scheduled post");
      }
    }

    // Update the post status
    await ctx.db.patch(args.postId, {
      status: "draft",
      scheduledFor: null,
      updatedAt: Date.now(),
    });

    // Delete any scheduled jobs for this post
    const scheduledJobs = await ctx.db
      .query("scheduledJobs")
      .withIndex("by_type_and_status", (q) =>
        q.eq("type", "twitter_post").eq("status", "pending"),
      )
      .collect();

    for (const job of scheduledJobs) {
      if (job.data.postId === args.postId) {
        await ctx.db.delete(job._id);
      }
    }

    return { success: true };
  },
});
