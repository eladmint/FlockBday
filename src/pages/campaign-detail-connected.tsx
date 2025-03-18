import { useParams } from "react-router-dom";
import { LoadingSpinner } from "@/components/loading-spinner";
import { TwitterIntegrationInfo } from "@/components/twitter-integration-info";
import { TwitterConnect } from "@/components/twitter-connect";
import { ScheduledPostsList } from "@/components/scheduled-posts-list";
import { useCampaignDetail } from "@/hooks/useCampaignDetail";
import { Id } from "../../convex/_generated/dataModel";
import { CampaignPageLayout } from "@/components/campaign-page-layout";
import { CampaignNotFound } from "@/components/campaign-not-found";
import { CampaignHeader } from "@/components/campaign-header";
import { CampaignStats } from "@/components/campaign-stats";
import { CampaignTabs } from "@/components/campaign-tabs";
import { CampaignPostsSection } from "@/components/campaign-posts-section";

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    campaign,
    posts,
    scheduledPosts,
    twitterEnabled,
    isLoading,
    enableTwitter,
    disableTwitter,
    createPost,
    updatePost,
    cancelScheduledPost,
  } = useCampaignDetail(id as string);

  const handlePostCreated = async (newPost: any) => {
    try {
      // Create the post using the hook
      await createPost({
        title: newPost.title,
        content: newPost.content,
        imageUrl: newPost.imageUrl || undefined,
        status: newPost.isScheduled ? "scheduled" : "draft",
        scheduledFor: newPost.scheduledFor,
        sharedOnTwitter: newPost.sharedOnTwitter,
      });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handlePostUpdate = async (updatedPost: any) => {
    try {
      // Update the post using the hook
      await updatePost(updatedPost.id as Id<"campaignPosts">, {
        status: updatedPost.status,
        scheduledFor: updatedPost.scheduledFor,
        sharedOnTwitter: updatedPost.sharedOnTwitter,
        twitterPostId: updatedPost.twitterPostId,
        twitterStats: updatedPost.twitterStats,
        publishedAt: updatedPost.publishedAt,
      });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleCancelScheduled = async (post: any) => {
    try {
      // Cancel the scheduled post using the hook
      await cancelScheduledPost(post.id as Id<"campaignPosts">);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!campaign) {
    return (
      <CampaignPageLayout>
        <CampaignNotFound />
      </CampaignPageLayout>
    );
  }

  return (
    <CampaignPageLayout>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Campaign Header */}
        <CampaignHeader campaign={campaign} />

        {/* Campaign Stats */}
        <CampaignStats campaign={campaign} />

        {/* Campaign Content Tabs */}
        <div className="p-6">
          <CampaignTabs campaign={campaign} />

          {/* Twitter Integration Section */}
          <div>
            <TwitterIntegrationInfo />
            <TwitterConnect
              campaignId={campaign.id}
              isConnected={twitterEnabled}
              onConnect={enableTwitter}
              onDisconnect={disableTwitter}
            />
          </div>

          {/* Scheduled Posts Section */}
          {scheduledPosts.length > 0 && (
            <ScheduledPostsList
              posts={scheduledPosts}
              onPostUpdate={handlePostUpdate}
            />
          )}

          {/* Posts Content */}
          <CampaignPostsSection
            campaignId={campaign.id}
            isOwner={campaign.isOwner}
            twitterEnabled={twitterEnabled}
            posts={posts}
            onPostCreated={handlePostCreated}
            onPostUpdate={handlePostUpdate}
          />
        </div>
      </div>
    </CampaignPageLayout>
  );
}
