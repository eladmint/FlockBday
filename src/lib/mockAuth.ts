// This file provides mock authentication functionality for development

export const createMockUser = async () => {
  // Check if we're in the Convex environment
  if (typeof window === "undefined") return null;

  // Create a mock user for development purposes
  return {
    id: "user123",
    name: "Demo User",
    email: "demo@example.com",
    tokenIdentifier: "demo-user-123",
    pictureUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
  };
};

export const getMockUserIdentity = async () => {
  const user = await createMockUser();
  if (!user) return null;

  return {
    tokenIdentifier: user.tokenIdentifier,
    subject: user.tokenIdentifier,
    name: user.name,
    email: user.email,
    pictureUrl: user.pictureUrl,
  };
};
