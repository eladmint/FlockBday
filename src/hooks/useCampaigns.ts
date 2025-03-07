import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Campaign } from "@/types/campaign";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useCampaigns() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);
  const [trendingCampaigns, setTrendingCampaigns] = useState<Campaign[]>([]);

  // Load mock data on mount
  useEffect(() => {
    // Get current user ID from localStorage
    const currentUserId = localStorage.getItem("currentUserId") || "user123";

    // Check for saved campaigns in localStorage first
    const savedCampaigns = localStorage.getItem("userCampaigns");

    // Simulate fetching from database
    const fetchCampaigns = async () => {
      // In a real app, this would be a call to your Convex API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data that would come from the database
      const myDbCampaigns = [
        {
          id: "1",
          title: "Summer Marketing Campaign",
          description:
            "Boost sales during the summer season with targeted promotions and social media campaigns.",
          visibility: "public",
          postsCount: 12,
          collaboratorsCount: 5,
          createdBy: "user123",
          createdByName: "John Doe",
          createdByAvatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
          createdAt: Date.now(),
          isOwner: currentUserId === "user123",
          isMember: true,
        },
        {
          id: "2",
          title: "Holiday Season Promotion",
          description:
            "Special offers and discounts for the holiday season to increase customer engagement.",
          visibility: "private",
          postsCount: 8,
          collaboratorsCount: 3,
          createdBy: "user456",
          createdByName: "Jane Smith",
          createdByAvatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
          createdAt: Date.now() - 86400000,
          isOwner: currentUserId === "user456",
          isMember: currentUserId === "user456" || currentUserId === "user123",
        },
      ];

      const trendingDbCampaigns = [
        {
          id: "3",
          title: "Black Friday Event",
          description:
            "Massive discounts and special offers for Black Friday shopping event.",
          visibility: "public",
          postsCount: 15,
          collaboratorsCount: 8,
          createdBy: "user789",
          createdByName: "Alex Johnson",
          createdByAvatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
          createdAt: Date.now() - 172800000,
          isOwner: currentUserId === "user789",
          isMember: currentUserId === "user789",
        },
        {
          id: "4",
          title: "New Product Launch",
          description:
            "Marketing campaign for the launch of our newest product line.",
          visibility: "public",
          postsCount: 10,
          collaboratorsCount: 6,
          createdBy: "user101",
          createdByName: "Sam Wilson",
          createdByAvatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
          createdAt: Date.now() - 259200000,
          isOwner: currentUserId === "user101",
          isMember: currentUserId === "user101",
        },
        {
          id: "5",
          title: "Spring Collection",
          description:
            "Introducing our fresh spring collection with exclusive early-bird offers.",
          visibility: "public",
          postsCount: 7,
          collaboratorsCount: 4,
          createdBy: "user202",
          createdByName: "Taylor Reed",
          createdByAvatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
          createdAt: Date.now() - 345600000,
          isOwner: currentUserId === "user202",
          isMember: currentUserId === "user202",
        },
      ];

      // Filter campaigns based on current user
      let filteredMyCampaigns = myDbCampaigns.filter(
        (campaign) => campaign.createdBy === currentUserId || campaign.isMember,
      );

      // If we have saved campaigns, add them to the filtered list
      if (savedCampaigns) {
        const userCreatedCampaigns = JSON.parse(savedCampaigns);
        // Only include campaigns created by the current user
        const userCampaigns = userCreatedCampaigns.filter(
          (campaign: Campaign) => campaign.createdBy === currentUserId,
        );
        // Combine with the mock campaigns
        filteredMyCampaigns = [...userCampaigns, ...filteredMyCampaigns];
      }

      setMyCampaigns(filteredMyCampaigns);
      setTrendingCampaigns(trendingDbCampaigns);
      setIsLoading(false);
    };

    fetchCampaigns();
  }, []);

  // Create a new campaign
  const createCampaign = async (data: {
    title: string;
    description: string;
    visibility: string;
  }) => {
    try {
      // Get current user info
      const currentUserId = localStorage.getItem("currentUserId") || "user123";
      const userName = currentUserId === "user123" ? "John Doe" : "Jane Smith";
      const userAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserId === "user123" ? "John" : "Jane"}`;

      // Create a new campaign object
      const newCampaign: Campaign = {
        id: `new-${Date.now()}`,
        title: data.title,
        description: data.description,
        visibility: data.visibility,
        postsCount: 0,
        collaboratorsCount: 1,
        createdBy: currentUserId,
        createdByName: userName,
        createdByAvatar: userAvatar,
        createdAt: Date.now(),
        isOwner: true,
        isMember: true,
      };

      // Update the state with the new campaign
      setMyCampaigns((prev) => [newCampaign, ...prev]);

      // Save to localStorage for persistence
      const savedCampaigns = JSON.parse(
        localStorage.getItem("userCampaigns") || "[]",
      );
      savedCampaigns.push(newCampaign);
      localStorage.setItem("userCampaigns", JSON.stringify(savedCampaigns));

      toast({
        title: "Success",
        description: "Campaign created successfully",
      });

      return newCampaign.id;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create campaign",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Join a public campaign
  const joinCampaign = async (campaignId: string) => {
    try {
      // Find the campaign
      const campaign = trendingCampaigns.find((c) => c.id === campaignId);
      if (!campaign) {
        throw new Error("Campaign not found");
      }

      // Update the campaign
      const updatedCampaign = { ...campaign, isMember: true };

      // Update trending campaigns
      setTrendingCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? updatedCampaign : c)),
      );

      // Add to my campaigns
      setMyCampaigns((prev) => [updatedCampaign, ...prev]);

      toast({
        title: "Success",
        description: "You have joined the campaign",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to join campaign",
        variant: "destructive",
      });
      return false;
    }
  };

  // Request to join a private campaign
  const requestToJoinCampaign = async (campaignId: string) => {
    try {
      toast({
        title: "Success",
        description: "Your request to join has been sent",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to request to join campaign",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    myCampaigns,
    trendingCampaigns,
    isLoading,
    createCampaign,
    joinCampaign,
    requestToJoinCampaign,
  };
}
