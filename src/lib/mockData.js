// Mock data generator for campaigns

export const generateMockCampaigns = (count = 5) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: `campaign-${index + 1}`,
    title: `Campaign ${index + 1}`,
    description: `This is a description for campaign ${index + 1}. It contains some details about the campaign.`,
    visibility: index % 3 === 0 ? "private" : "public",
    postsCount: Math.floor(Math.random() * 20),
    collaboratorsCount: Math.floor(Math.random() * 10) + 1,
    createdBy: "demo-user-123",
    createdByName: "Demo User",
    createdByAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${index}`,
    createdAt:
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
    isOwner: index % 2 === 0,
    isMember: index % 4 !== 0,
  }));
};

export const insertMockCampaigns = async (db) => {
  if (!db) return;

  const mockUser = {
    tokenIdentifier: "demo-user-123",
    name: "Demo User",
    email: "demo@example.com",
    createdAt: Date.now(),
  };

  // Check if user exists
  const existingUser = await db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", mockUser.tokenIdentifier),
    )
    .first();

  if (!existingUser) {
    // Insert mock user
    await db.insert("users", mockUser);
  }

  // Create mock campaigns
  const campaigns = generateMockCampaigns(5);

  for (const campaign of campaigns) {
    // Insert campaign
    const campaignId = await db.insert("campaigns", {
      title: campaign.title,
      description: campaign.description,
      visibility: campaign.visibility,
      createdBy: mockUser.tokenIdentifier,
      createdAt: campaign.createdAt,
      status: "active",
    });

    // Add user as owner or member
    await db.insert("campaignMembers", {
      campaignId,
      userId: mockUser.tokenIdentifier,
      role: campaign.isOwner ? "owner" : "member",
      joinedAt: Date.now(),
      status: "active",
    });
  }
};
