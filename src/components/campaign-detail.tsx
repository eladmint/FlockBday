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
import { convexIdToString } from "@/utils/convexHelpers";

export function CampaignDetail() {
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
    deletePost,
    publishToTwitter,
    cancelScheduledPost,
  } = useCampaignDetail(id || "");

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
              collaboratorsCount={3} // This would come from the campaign data
            />
          </div>

          <div>
            <TwitterIntegrationInfo />
            <div className="flex flex-col space-y-4">
              <TwitterConnect
                campaignId={id || ""}
                isConnected={twitterEnabled}
                onConnect={enableTwitter}
                onDisconnect={disableTwitter}
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
            />
          }
          scheduledTab={
            <ScheduledPostsList
              posts={scheduledPosts}
              onCancelScheduled={cancelScheduledPost}
            />
          }
        />
      </div>
    </CampaignPageLayout>
  );
}
