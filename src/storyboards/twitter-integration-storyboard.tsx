import React from "react";
import { TwitterConnect } from "@/components/twitter-connect";
import { TwitterPostForm } from "@/components/twitter-post-form";
import { TwitterPost } from "@/components/twitter-post";
import { TwitterStatusIndicator } from "@/components/twitter-status-indicator";
import { TwitterIntegrationInfo } from "@/components/twitter-integration-info";
import { TwitterTestButton } from "@/components/twitter-test-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * This storyboard showcases all the Twitter integration components
 * for documentation and testing purposes.
 */
export default function TwitterIntegrationStoryboard() {
  // Mock data for demonstration
  const mockCampaignId = "campaign-123";
  const mockPost = {
    title: "Sample Twitter Post",
    content:
      "This is a sample Twitter post for demonstration purposes. #testing #demo",
    createdAt: Date.now(),
    imageUrl:
      "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&q=80",
    sharedOnTwitter: true,
    twitterPostId: "1234567890",
    twitterStats: {
      likes: 42,
      retweets: 12,
      replies: 5,
    },
  };

  const mockScheduledPost = {
    title: "Scheduled Twitter Post",
    content:
      "This is a scheduled Twitter post for demonstration purposes. #scheduled #demo",
    createdAt: Date.now(),
    imageUrl: null,
    isScheduled: true,
    scheduledFor: Date.now() + 86400000, // 24 hours from now
    status: "scheduled",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Twitter Integration Components
      </h1>

      <Tabs defaultValue="components">
        <TabsList className="mb-4">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="flow">Integration Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-6">
          {/* Status Components */}
          <Card>
            <CardHeader>
              <CardTitle>Status Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-2">
                  TwitterStatusIndicator
                </h3>
                <TwitterStatusIndicator />
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-2">
                  TwitterIntegrationInfo
                </h3>
                <TwitterIntegrationInfo />
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-2">TwitterTestButton</h3>
                <TwitterTestButton />
              </div>
            </CardContent>
          </Card>

          {/* Connection Components */}
          <Card>
            <CardHeader>
              <CardTitle>Connection Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-2">TwitterConnect</h3>
                <TwitterConnect
                  campaignId={mockCampaignId}
                  isConnected={true}
                  onConnect={() => Promise.resolve()}
                  onDisconnect={() => Promise.resolve()}
                />

                <div className="mt-4">
                  <h4 className="text-xs font-medium mb-1">
                    Not Connected State:
                  </h4>
                  <TwitterConnect
                    campaignId={mockCampaignId}
                    isConnected={false}
                    onConnect={() => Promise.resolve()}
                    onDisconnect={() => Promise.resolve()}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post Components */}
          <Card>
            <CardHeader>
              <CardTitle>Post Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-2">TwitterPostForm</h3>
                <TwitterPostForm
                  campaignId={mockCampaignId}
                  isTwitterConnected={true}
                  onPostCreated={() => {}}
                />
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-2">
                  TwitterPost (Published)
                </h3>
                <TwitterPost post={mockPost} />
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-2">
                  TwitterPost (Scheduled)
                </h3>
                <TwitterPost post={mockScheduledPost} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flow">
          <Card>
            <CardHeader>
              <CardTitle>Twitter Integration Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Publishing Flow</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li className="text-sm">
                    User connects Twitter account in settings
                  </li>
                  <li className="text-sm">
                    User enables Twitter for a specific campaign
                  </li>
                  <li className="text-sm">
                    User creates a post with "Share on Twitter" option
                  </li>
                  <li className="text-sm">
                    Post is saved to database and published to Twitter
                  </li>
                  <li className="text-sm">
                    Twitter metrics are displayed on the post
                  </li>
                </ol>
              </div>

              <div className="p-4 border rounded-lg mt-4">
                <h3 className="font-medium mb-4">Scheduling Flow</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li className="text-sm">
                    User creates a post with scheduling enabled
                  </li>
                  <li className="text-sm">
                    User sets date and time for publication
                  </li>
                  <li className="text-sm">
                    Post is saved with "scheduled" status
                  </li>
                  <li className="text-sm">
                    Scheduled job processes the post at the designated time
                  </li>
                  <li className="text-sm">
                    Post is published to Twitter and status is updated
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
