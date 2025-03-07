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

// Store user data
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
