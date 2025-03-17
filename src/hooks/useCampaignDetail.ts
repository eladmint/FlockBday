import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import type { Id } from "../../convex/_generated/dataModel";

export function useCampaignDetail(campaignId: string) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Get campaign details from Convex
  // Using getMyCampaigns instead since getCampaign is not available
  const myCampaigns = useQuery(api.campaigns.getMyCampaigns);
  const campaign = myCampaigns?.find((c) => c.id === campaignId);

  // Get campaign posts
  const posts = [];

  // Get scheduled posts
  const scheduledPosts = [];

  // Get Twitter status for this campaign
  const twitterStatus = useQuery(
    api.twitter.getCampaignTwitterStatus,
    campaign ? { campaignId: campaign.id as Id<"campaigns"> } : "skip",
  );

  // Mutations
  const enableTwitterMutation = useMutation(
    api.twitter.enableTwitterForCampaign,
  );
  const disableTwitterMutation = useMutation(
    api.twitter.disableTwitterForCampaign,
  );
  const createPostMutation = useMutation(api.posts.createPost);
  const updatePostMutation = useMutation(api.posts.updatePost);
  const deletePostMutation = useMutation(api.posts.deletePost);
  const publishToTwitterMutation = useMutation(api.posts.publishToTwitter);
  const cancelScheduledPostMutation = useMutation(
    api.posts.cancelScheduledPost,
  );

  // Set loading state based on query status
  useEffect(() => {
    if (campaign !== undefined && posts !== undefined) {
      setIsLoading(false);
    }
  }, [campaign, posts]);

  // Enable Twitter for campaign
  const enableTwitter = async () => {
    if (!campaign) return false;

    try {
      // Call the actual Convex mutation
      await enableTwitterMutation({
        campaignId: campaign.id as Id<"campaigns">,
      });
      toast({
        title: "Success",
        description: "Twitter publishing enabled for this campaign",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to enable Twitter",
        variant: "destructive",
      });
      return false;
    }
  };

  // Disable Twitter for campaign
  const disableTwitter = async () => {
    if (!campaign) return false;

    try {
      // Call the actual Convex mutation
      await disableTwitterMutation({
        campaignId: campaign.id as Id<"campaigns">,
      });
      toast({
        title: "Success",
        description: "Twitter publishing disabled for this campaign",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to disable Twitter",
        variant: "destructive",
      });
      return false;
    }
  };

  // Create a new post
  const createPost = async (data: {
    title: string;
    content: string;
    imageUrl?: string;
    status: string;
    scheduledFor?: number;
    sharedOnTwitter?: boolean;
  }) => {
    if (!campaign) return null;

    try {
      // Call the actual Convex mutation
      const postId = await createPostMutation({
        campaignId: campaign.id as Id<"campaigns">,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        status: data.status,
        scheduledFor: data.scheduledFor,
        sharedOnTwitter: data.sharedOnTwitter,
      });

      toast({
        title: "Success",
        description:
          data.status === "scheduled"
            ? "Post scheduled successfully"
            : "Post created successfully",
      });

      return postId;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update a post
  const updatePost = async (postId: Id<"campaignPosts">, data: any) => {
    try {
      // Call the actual Convex mutation
      await updatePostMutation({
        postId,
        ...data,
      });

      toast({
        title: "Success",
        description: "Post updated successfully",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update post",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete a post
  const deletePost = async (postId: Id<"campaignPosts">) => {
    try {
      // Call the actual Convex mutation
      await deletePostMutation({
        postId,
      });

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      });
      return false;
    }
  };

  // Publish a post to Twitter
  const publishToTwitter = async (postId: Id<"campaignPosts">) => {
    try {
      // Call the actual Convex mutation
      await publishToTwitterMutation({
        postId,
      });

      toast({
        title: "Success",
        description: "Post published to Twitter",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to publish to Twitter",
        variant: "destructive",
      });
      return false;
    }
  };

  // Cancel a scheduled post
  const cancelScheduledPost = async (postId: Id<"campaignPosts">) => {
    try {
      // Call the actual Convex mutation
      await cancelScheduledPostMutation({
        postId,
      });

      toast({
        title: "Success",
        description: "Scheduled post cancelled",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to cancel scheduled post",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    campaign,
    posts,
    scheduledPosts,
    twitterEnabled: twitterStatus?.enabled ?? false,
    isLoading,
    enableTwitter,
    disableTwitter,
    createPost,
    updatePost,
    deletePost,
    publishToTwitter,
    cancelScheduledPost,
  };
}
