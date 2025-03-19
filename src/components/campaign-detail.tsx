import { useParams } from "react-router-dom";
import { LoadingSpinner } from "@/components/loading-spinner";
import { TwitterIntegrationInfo } from "@/components/twitter-integration-info";
import { TwitterConnect } from "@/components/twitter-connect";
import { ScheduledPostsList } from "@/components/scheduled-posts-list";
import { useCampaignDetail } from "@/hooks/useCampaignDetail";
import { CampaignPageLayout } from "@/components/campaign-page-layout";
import { CampaignNotFound } from "@/components/campaign-not-found";
import { CampaignHeader } from "@/components/campaign-header";
import { CampaignStats } from "@/components/campaign-stats";
import { CampaignTabs } from "@/components/campaign-tabs";
import { CampaignPostsSection } from "@/components/campaign-posts-section";
import { TwitterTestButton } from "@/components/twitter-test-button";
import { TwitterMetricsChart } from "@/components/twitter-metrics-chart";
import { convexIdToString } from "@/utils/convexHelpers";
import { useToast } from "@/components/ui/use-toast";

export function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
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
    deletePost,
    publishToTwitter,
    cancelScheduledPost,
  } = useCampaignDetail(id || "");

  // Handle Twitter connection with better error handling
  const handleEnableTwitter = async () => {
    try {
      const success = await enableTwitter();
      if (success) {
        toast({
          title: "Twitter Enabled",
          description: "Twitter publishing has been enabled for this campaign",
        });
      }
    } catch (error) {
      console.error("Error enabling Twitter:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to enable Twitter",
        variant: "destructive",
      });
    }
  };

  const handleDisableTwitter = async () => {
    try {
      const success = await disableTwitter();
      if (success) {
        toast({
          title: "Twitter Disabled",
          description: "Twitter publishing has been disabled for this campaign",
        });
      }
    } catch (error) {
      console.error("Error disabling Twitter:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to disable Twitter",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!campaign) {
    return <CampaignNotFound />;
  }

  return (
    <CampaignPageLayout>
      <div className="space-y-8">
        <CampaignHeader campaign={campaign} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <CampaignStats
              postsCount={posts.length}
              scheduledCount={scheduledPosts.length}
              collaboratorsCount={campaign.collaboratorsCount || 3}
            />
          </div>

          <div>
            <TwitterIntegrationInfo />
            <div className="flex flex-col space-y-4">
              <TwitterConnect
                campaignId={id || ""}
                isConnected={twitterEnabled}
                onConnect={handleEnableTwitter}
                onDisconnect={handleDisableTwitter}
              />
              {twitterEnabled && campaign._id && (
                <div className="flex justify-end">
                  <TwitterTestButton
                    campaignId={convexIdToString(campaign._id)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <CampaignTabs
          postsTab={
            <CampaignPostsSection
              posts={posts}
              onCreatePost={createPost}
              onUpdatePost={updatePost}
              onDeletePost={deletePost}
              onPublishToTwitter={publishToTwitter}
              twitterEnabled={twitterEnabled}
              campaignId={id || ""}
            />
          }
          scheduledTab={
            <ScheduledPostsList
              posts={scheduledPosts}
              onCancelScheduled={cancelScheduledPost}
            />
          }
          metricsTab={<TwitterMetricsChart posts={posts} />}
        />
      </div>
    </CampaignPageLayout>
  );
}
