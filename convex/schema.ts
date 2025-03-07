import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User accounts
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    tokenIdentifier: v.string(),
    twitterConnected: v.optional(v.boolean()),
    twitterUsername: v.optional(v.string()),
    createdAt: v.number(), // timestamp
    lastLoginAt: v.optional(v.number()), // timestamp
  }).index("by_token", ["tokenIdentifier"]),

  // Campaign management
  campaigns: defineTable({
    title: v.string(),
    description: v.string(),
    visibility: v.string(), // 'public' or 'private'
    createdBy: v.string(), // tokenIdentifier of the creator
    createdAt: v.number(), // timestamp
    updatedAt: v.optional(v.number()), // timestamp
    twitterEnabled: v.optional(v.boolean()), // Whether Twitter integration is enabled for this campaign
    imageUrl: v.optional(v.string()), // Campaign cover image
    status: v.optional(v.string()), // 'active', 'archived', 'draft'
    tags: v.optional(v.array(v.string())), // Campaign tags for categorization
  })
    .index("by_creator", ["createdBy"])
    .index("by_visibility", ["visibility"])
    .index("by_status", ["status"])
    .index("by_creator_and_status", ["createdBy", "status"]),

  // Campaign membership
  campaignMembers: defineTable({
    campaignId: v.id("campaigns"),
    userId: v.string(), // tokenIdentifier
    role: v.string(), // 'owner', 'admin', 'member'
    joinedAt: v.number(), // timestamp
    invitedBy: v.optional(v.string()), // tokenIdentifier of who invited them
    status: v.optional(v.string()), // 'active', 'pending', 'declined'
  })
    .index("by_campaign", ["campaignId"])
    .index("by_user", ["userId"])
    .index("by_campaign_and_user", ["campaignId", "userId"])
    .index("by_status", ["status"]),

  // Campaign join requests
  campaignJoinRequests: defineTable({
    campaignId: v.id("campaigns"),
    userId: v.string(), // tokenIdentifier of requester
    message: v.optional(v.string()), // Optional message from requester
    requestedAt: v.number(), // timestamp
    status: v.string(), // 'pending', 'approved', 'rejected'
    respondedBy: v.optional(v.string()), // tokenIdentifier of responder
    respondedAt: v.optional(v.number()), // timestamp
  })
    .index("by_campaign", ["campaignId"])
    .index("by_user", ["userId"])
    .index("by_campaign_and_status", ["campaignId", "status"])
    .index("by_user_and_status", ["userId", "status"]),

  // Campaign posts
  campaignPosts: defineTable({
    campaignId: v.id("campaigns"),
    title: v.string(),
    content: v.string(),
    createdBy: v.string(), // tokenIdentifier
    createdAt: v.number(), // timestamp
    updatedAt: v.optional(v.number()), // timestamp
    imageUrl: v.optional(v.string()), // Optional image URL
    status: v.string(), // 'draft', 'published', 'scheduled', 'failed'
    publishedAt: v.optional(v.number()), // When the post was published
    scheduledFor: v.optional(v.number()), // When the post is scheduled to be published
    sharedOnTwitter: v.optional(v.boolean()), // Whether the post was shared on Twitter
    twitterPostId: v.optional(v.string()), // Twitter post ID if shared
    twitterStats: v.optional(
      v.object({
        likes: v.number(),
        retweets: v.number(),
        replies: v.number(),
      }),
    ), // Twitter engagement stats
    serverJobId: v.optional(v.string()), // ID of the server job for scheduled posts
  })
    .index("by_campaign", ["campaignId"])
    .index("by_creator", ["createdBy"])
    .index("by_status", ["status"])
    .index("by_campaign_and_status", ["campaignId", "status"])
    .index("by_scheduled_time", ["scheduledFor"])
    .index("by_twitter_post_id", ["twitterPostId"]),

  // Post comments
  postComments: defineTable({
    postId: v.id("campaignPosts"),
    content: v.string(),
    createdBy: v.string(), // tokenIdentifier
    createdAt: v.number(), // timestamp
    updatedAt: v.optional(v.number()), // timestamp
    parentCommentId: v.optional(v.id("postComments")), // For threaded comments
  })
    .index("by_post", ["postId"])
    .index("by_creator", ["createdBy"])
    .index("by_parent", ["parentCommentId"]),

  // User notifications
  notifications: defineTable({
    userId: v.string(), // tokenIdentifier of recipient
    type: v.string(), // 'mention', 'comment', 'invite', 'join_request', etc.
    title: v.string(),
    content: v.string(),
    createdAt: v.number(), // timestamp
    read: v.boolean(),
    readAt: v.optional(v.number()), // timestamp
    sourceId: v.optional(v.string()), // ID of the source object (post, comment, etc.)
    sourceType: v.optional(v.string()), // Type of the source ('post', 'comment', etc.)
    actorId: v.optional(v.string()), // tokenIdentifier of the user who triggered the notification
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "read"])
    .index("by_source", ["sourceType", "sourceId"]),

  // Twitter integration
  twitterIntegrations: defineTable({
    userId: v.string(), // tokenIdentifier
    campaignId: v.optional(v.id("campaigns")), // Optional, for campaign-specific integrations
    accessToken: v.string(),
    accessTokenSecret: v.string(),
    username: v.string(),
    profileImageUrl: v.optional(v.string()),
    connectedAt: v.number(), // timestamp
    lastUsedAt: v.optional(v.number()), // timestamp
    status: v.string(), // 'active', 'revoked', 'expired'
  })
    .index("by_user", ["userId"])
    .index("by_campaign", ["campaignId"])
    .index("by_user_and_campaign", ["userId", "campaignId"]),

  // Scheduled jobs
  scheduledJobs: defineTable({
    type: v.string(), // 'twitter_post', 'email_campaign', etc.
    status: v.string(), // 'pending', 'processing', 'completed', 'failed'
    scheduledFor: v.number(), // timestamp
    data: v.any(), // Job data
    createdBy: v.string(), // tokenIdentifier
    createdAt: v.number(), // timestamp
    processedAt: v.optional(v.number()), // timestamp
    result: v.optional(v.any()), // Job result
    error: v.optional(v.string()), // Error message if failed
    retryCount: v.optional(v.number()), // Number of retry attempts
    nextRetryAt: v.optional(v.number()), // timestamp
  })
    .index("by_status", ["status"])
    .index("by_scheduled_time", ["scheduledFor"])
    .index("by_type_and_status", ["type", "status"])
    .index("by_creator", ["createdBy"]),

  // Analytics events
  analyticsEvents: defineTable({
    type: v.string(), // 'post_view', 'post_engagement', 'campaign_view', etc.
    userId: v.optional(v.string()), // tokenIdentifier if authenticated
    anonymousId: v.optional(v.string()), // For unauthenticated users
    campaignId: v.optional(v.id("campaigns")),
    postId: v.optional(v.id("campaignPosts")),
    properties: v.optional(v.any()), // Event properties
    timestamp: v.number(), // timestamp
    sessionId: v.optional(v.string()), // For tracking user sessions
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  })
    .index("by_type", ["type"])
    .index("by_user", ["userId"])
    .index("by_campaign", ["campaignId"])
    .index("by_post", ["postId"])
    .index("by_timestamp", ["timestamp"]),

  // Subscription management
  subscriptions: defineTable({
    userId: v.optional(v.string()),
    stripeId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    currency: v.optional(v.string()),
    interval: v.optional(v.string()),
    status: v.optional(v.string()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    amount: v.optional(v.number()),
    startedAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
    canceledAt: v.optional(v.number()),
    customerCancellationReason: v.optional(v.string()),
    customerCancellationComment: v.optional(v.string()),
    metadata: v.optional(v.any()),
    customFieldData: v.optional(v.any()),
    customerId: v.optional(v.string()),
    planType: v.optional(v.string()), // 'free', 'pro', 'enterprise'
    features: v.optional(v.array(v.string())), // List of enabled features
    maxCampaigns: v.optional(v.number()), // Maximum number of campaigns allowed
  })
    .index("userId", ["userId"])
    .index("stripeId", ["stripeId"]),

  // Webhook events
  webhookEvents: defineTable({
    type: v.string(),
    stripeEventId: v.string(),
    createdAt: v.string(),
    modifiedAt: v.string(),
    data: v.any(),
    processed: v.optional(v.boolean()),
    processedAt: v.optional(v.number()),
    error: v.optional(v.string()),
  })
    .index("type", ["type"])
    .index("stripeEventId", ["stripeEventId"])
    .index("by_processed", ["processed"]),

  // Invoices
  invoices: defineTable({
    createdTime: v.optional(v.number()), // Timestamp as number
    invoiceId: v.string(),
    subscriptionId: v.string(),
    amountPaid: v.string(),
    amountDue: v.string(),
    currency: v.string(),
    status: v.string(),
    email: v.string(),
    userId: v.optional(v.string()),
    items: v.optional(v.array(v.any())), // Line items
    pdf: v.optional(v.string()), // URL to PDF invoice
  })
    .index("by_userId", ["userId"])
    .index("by_invoiceId", ["invoiceId"])
    .index("by_subscriptionId", ["subscriptionId"]),

  // User settings
  userSettings: defineTable({
    userId: v.string(), // tokenIdentifier
    notifyEmails: v.optional(v.boolean()),
    notifyPosts: v.optional(v.boolean()),
    notifyMentions: v.optional(v.boolean()),
    theme: v.optional(v.string()), // 'light', 'dark', 'system'
    timezone: v.optional(v.string()),
    language: v.optional(v.string()),
    emailFrequency: v.optional(v.string()), // 'daily', 'weekly', 'never'
  }).index("by_user", ["userId"]),

  // Form submissions
  formSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.number(), // timestamp
  }),
});
