import React from "react";
import { TwitterPostForm } from "@/components/twitter-post-form";
import { ScheduledPostsCalendar } from "@/components/scheduled-posts-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Twitter } from "lucide-react";

/**
 * This storyboard showcases the Twitter scheduling functionality
 * including the post creation form and calendar view of scheduled posts.
 */
export default function TwitterSchedulerStoryboard() {
  // Mock campaign ID for demonstration
  const mockCampaignId = "campaign-123" as any;

  // Mock function for handling post creation
  const handlePostCreated = (post: any) => {
    console.log("Post created:", post);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Twitter Scheduling Components</h1>

      <Tabs defaultValue="create">
        <TabsList className="mb-4">
          <TabsTrigger value="create">
            <Twitter className="h-4 w-4 mr-2" />
            Create & Schedule
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="flow">
            <Clock className="h-4 w-4 mr-2" />
            Scheduling Flow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create and Schedule Twitter Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <TwitterPostForm
                campaignId={mockCampaignId}
                isTwitterConnected={true}
                onPostCreated={handlePostCreated}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <ScheduledPostsCalendar campaignId={mockCampaignId} />
        </TabsContent>

        <TabsContent value="flow">
          <Card>
            <CardHeader>
              <CardTitle>Twitter Scheduling Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">How Scheduling Works</h3>
                <ol className="list-decimal pl-5 space-y-3">
                  <li className="text-sm">
                    <span className="font-medium">Create a Post</span>
                    <p className="text-gray-600 mt-1">
                      User creates a post with the "Schedule for later" option
                      enabled and sets a future date and time.
                    </p>
                  </li>

                  <li className="text-sm">
                    <span className="font-medium">Save to Database</span>
                    <p className="text-gray-600 mt-1">
                      Post is saved to the Convex database with "scheduled"
                      status and the scheduled timestamp.
                    </p>
                  </li>

                  <li className="text-sm">
                    <span className="font-medium">Create Scheduled Job</span>
                    <p className="text-gray-600 mt-1">
                      A scheduled job is created in Convex that will run at the
                      specified time to publish the post to Twitter.
                    </p>
                  </li>

                  <li className="text-sm">
                    <span className="font-medium">Job Execution</span>
                    <p className="text-gray-600 mt-1">
                      When the scheduled time arrives, the job automatically
                      runs and publishes the post to Twitter using the Twitter
                      API.
                    </p>
                  </li>

                  <li className="text-sm">
                    <span className="font-medium">Status Update</span>
                    <p className="text-gray-600 mt-1">
                      After successful publication, the post status is updated
                      to "published" and Twitter metrics begin tracking.
                    </p>
                  </li>

                  <li className="text-sm">
                    <span className="font-medium">Error Handling</span>
                    <p className="text-gray-600 mt-1">
                      If publication fails, the system automatically retries up
                      to 3 times with exponential backoff (5, 15, then 45
                      minutes).
                    </p>
                  </li>
                </ol>
              </div>

              <div className="p-4 border rounded-lg mt-4">
                <h3 className="font-medium mb-4">Calendar Integration</h3>
                <p className="text-sm text-gray-600 mb-3">
                  The calendar view provides a visual representation of all
                  scheduled posts, allowing users to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-sm text-gray-600">
                    See which days have scheduled posts
                  </li>
                  <li className="text-sm text-gray-600">
                    View details of upcoming scheduled posts
                  </li>
                  <li className="text-sm text-gray-600">
                    Cancel scheduled posts before they're published
                  </li>
                  <li className="text-sm text-gray-600">
                    Plan content calendar for optimal engagement
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
