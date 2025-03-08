import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Campaign } from "@/types/campaign";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function useCampaigns() {
  const { toast } = useToast();

  // Use Convex queries to fetch campaigns
  const myCampaignsQuery = useQuery(api.campaigns.getMyCampaigns) || [];
  const trendingCampaignsQuery =
    useQuery(api.campaigns.getTrendingCampaigns) || [];

  // Use Convex mutations
  const createCampaignMutation = useMutation(api.campaigns.createCampaign);
  const joinCampaignMutation = useMutation(api.campaigns.joinCampaign);
  const requestToJoinCampaignMutation = useMutation(
    api.campaigns.requestToJoinCampaign,
  );

  // Create a new campaign
  const createCampaign = async (data: {
    title: string;
    description: string;
    visibility: string;
  }) => {
    try {
      console.log("Creating campaign with data:", data);

      // Call the Convex mutation to create a campaign
      const campaignId = await createCampaignMutation({
        title: data.title,
        description: data.description,
        visibility: data.visibility,
      });

      toast({
        title: "Success",
        description: "Campaign created successfully",
      });

      return campaignId;
    } catch (error) {
      console.error("Campaign creation error:", error);
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
      // Call the Convex mutation to join a campaign
      await joinCampaignMutation({
        campaignId: campaignId as Id<"campaigns">,
      });

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
      // Call the Convex mutation to request to join a campaign
      await requestToJoinCampaignMutation({
        campaignId: campaignId as Id<"campaigns">,
        message: "I would like to join your campaign",
      });

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

  // Check if data is still loading
  const isLoading =
    myCampaignsQuery === undefined || trendingCampaignsQuery === undefined;

  return {
    myCampaigns: myCampaignsQuery || [],
    trendingCampaigns: trendingCampaignsQuery || [],
    isLoading,
    createCampaign,
    joinCampaign,
    requestToJoinCampaign,
  };
}
