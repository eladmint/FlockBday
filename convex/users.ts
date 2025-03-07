import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserByToken = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier),
      )
      .unique();
  },
});

// Get the current user
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const tokenIdentifier = identity.subject;

    // Find the user in the database
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .first();

    if (!user) {
      // Create the user if they don't exist
      const userId = await ctx.db.insert("users", {
        tokenIdentifier,
        name: identity.name,
        email: identity.email,
        image: identity.pictureUrl,
        createdAt: Date.now(),
      });

      return {
        _id: userId,
        tokenIdentifier,
        name: identity.name,
        email: identity.email,
        image: identity.pictureUrl,
        createdAt: Date.now(),
      };
    }

    return user;
  },
});

// Get user settings
export const getUserSettings = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const tokenIdentifier = identity.subject;

    // Find the user settings
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", tokenIdentifier))
      .first();

    return (
      settings || {
        userId: tokenIdentifier,
        notifyEmails: true,
        notifyPosts: true,
        notifyMentions: true,
      }
    );
  },
});

// Update user settings
export const updateUserSettings = mutation({
  args: {
    bio: v.optional(v.string()),
    notifyEmails: v.optional(v.boolean()),
    notifyPosts: v.optional(v.boolean()),
    notifyMentions: v.optional(v.boolean()),
    theme: v.optional(v.string()),
    timezone: v.optional(v.string()),
    language: v.optional(v.string()),
    emailFrequency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const tokenIdentifier = identity.subject;

    // Find the user in the database
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .first();

    if (!user) {
      // Create the user if they don't exist
      await ctx.db.insert("users", {
        tokenIdentifier,
        name: identity.name,
        email: identity.email,
        image: identity.pictureUrl,
        createdAt: Date.now(),
      });
    }

    // Find existing settings
    const existingSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", tokenIdentifier))
      .first();

    // Prepare update data
    const updateData: any = {};
    if (args.bio !== undefined) updateData.bio = args.bio;
    if (args.notifyEmails !== undefined)
      updateData.notifyEmails = args.notifyEmails;
    if (args.notifyPosts !== undefined)
      updateData.notifyPosts = args.notifyPosts;
    if (args.notifyMentions !== undefined)
      updateData.notifyMentions = args.notifyMentions;
    if (args.theme !== undefined) updateData.theme = args.theme;
    if (args.timezone !== undefined) updateData.timezone = args.timezone;
    if (args.language !== undefined) updateData.language = args.language;
    if (args.emailFrequency !== undefined)
      updateData.emailFrequency = args.emailFrequency;

    if (existingSettings) {
      // Update existing settings
      await ctx.db.patch(existingSettings._id, updateData);
      return existingSettings._id;
    } else {
      // Create new settings
      return await ctx.db.insert("userSettings", {
        userId: tokenIdentifier,
        ...updateData,
      });
    }
  },
});

// Get user by ID
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Find the user in the database
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.userId))
      .first();

    return user;
  },
});

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, {
          name: identity.name,
          email: identity.email,
        });
      }
      return user._id;
    }

    // If it's a new identity, create a new User
    return await ctx.db.insert("users", {
      name: identity.name,
      email: identity.email,
      tokenIdentifier: identity.subject,
      createdAt: Date.now(),
    });
  },
});
