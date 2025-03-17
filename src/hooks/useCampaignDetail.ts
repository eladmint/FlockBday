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
  const campaign = myCampaigns?.find(
    (c) => c._id === (campaignId as Id<"campaigns">),
  );

  // Log campaign details for debugging
  useEffect(() => {
    if (campaign) {
      console.log("Found campaign:", campaign);
      console.log("Campaign ID:", campaign._id);
      console.log("Campaign ID type:", typeof campaign._id);
    }
  }, [campaign]);

  // Get campaign posts
  const posts =
    useQuery(
      api.posts.getCampaignPosts,
      campaign ? { campaignId: campaign._id as Id<"campaigns"> } : "skip",
    ) || [];

  // Get scheduled posts
  const scheduledPosts =
    useQuery(
      api.posts.getScheduledPosts,
      campaign ? { campaignId: campaign._id as Id<"campaigns"> } : "skip",
    ) || [];

  // Get Twitter status for this campaign
  const twitterStatus = useQuery(
    api.twitter.getCampaignTwitterStatus,
    campaign ? { campaignId: campaign._id as Id<"campaigns"> } : "skip",
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
    if (!campaign) {
      console.error("Cannot enable Twitter: No campaign found");
      return false;
    }

    try {
      // Make sure we have a valid campaign ID
      if (!campaign._id) {
        console.error("Cannot enable Twitter: Invalid campaign ID");
        toast({
          title: "Error",
          description: "Invalid campaign ID",
          variant: "destructive",
        });
        return false;
      }

      console.log("Enabling Twitter for campaign:", campaign._id);

      // Call the Convex mutation with the campaign ID
      const result = await enableTwitterMutation({
        campaignId: campaign._id as Id<"campaigns">,
      });

      console.log("Twitter enable result:", result);

      toast({
        title: "Success",
        description: "Twitter publishing enabled for this campaign",
      });
      return true;
    } catch (error) {
      console.error("Error enabling Twitter:", error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      toast({
        title: "Error",
        description:
          "Failed to enable Twitter. Please make sure your Twitter account is connected in settings.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Disable Twitter for campaign
  const disableTwitter = async () => {
    if (!campaign) {
      console.error("Cannot disable Twitter: No campaign found");
      return false;
    }

    try {
      // Make sure we have a valid campaign ID
      if (!campaign._id) {
        console.error("Cannot disable Twitter: Invalid campaign ID");
        toast({
          title: "Error",
          description: "Invalid campaign ID",
          variant: "destructive",
        });
        return false;
      }

      console.log("Disabling Twitter for campaign:", campaign._id);

      // Call the Convex mutation with the campaign ID
      const result = await disableTwitterMutation({
        campaignId: campaign._id as Id<"campaigns">,
      });

      console.log("Twitter disable result:", result);

      toast({
        title: "Success",
        description: "Twitter publishing disabled for this campaign",
      });
      return true;
    } catch (error) {
      console.error("Error disabling Twitter:", error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      toast({
        title: "Error",
        description: "Failed to disable Twitter",
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
    if (!campaign) {
      console.error("Cannot create post: No campaign found");
      return null;
    }

    try {
      // Make sure we have a valid campaign ID
      if (!campaign._id) {
        console.error("Cannot create post: Invalid campaign ID");
        toast({
          title: "Error",
          description: "Invalid campaign ID",
          variant: "destructive",
        });
        return null;
      }

      console.log("Creating post for campaign:", campaign._id);

      // Call the Convex mutation
      const postId = await createPostMutation({
        campaignId: campaign._id as Id<"campaigns">,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        status: data.status,
        scheduledFor: data.scheduledFor,
        sharedOnTwitter: data.sharedOnTwitter,
      });

      console.log("Post created with ID:", postId);

      toast({
        title: "Success",
        description:
          data.status === "scheduled"
            ? "Post scheduled successfully"
            : "Post created successfully",
      });

      return postId;
    } catch (error) {
      console.error("Error creating post:", error);
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
