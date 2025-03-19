import React from "react";
import { TwitterMetricsChart } from "@/components/twitter-metrics-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calendar, Clock } from "lucide-react";

/**
 * This storyboard showcases a comprehensive Twitter metrics dashboard
 * with various visualization options and timeframes.
 */
export default function TwitterMetricsDashboard() {
  // Generate sample data with a range of dates and metrics
  const generateSampleData = () => {
    const posts = [];
    const now = Date.now();

    // Create 20 sample posts over the last 60 days
    for (let i = 0; i < 20; i++) {
      const daysAgo = Math.floor(Math.random() * 60);
      const publishedAt = now - daysAgo * 24 * 60 * 60 * 1000;

      // Generate random metrics with some correlation to recency
      // (more recent posts tend to have fewer engagements)
      const engagementFactor = Math.max(0.2, Math.min(1, daysAgo / 30));
      const baseLikes = Math.floor(Math.random() * 100) * engagementFactor;

      posts.push({
        _id: `post-${i}`,
        title: `Sample Twitter Post ${i + 1}`,
        content: `This is sample content for Twitter post #${i + 1}. It contains hashtags and engaging content. #sample #twitter #metrics`,
        publishedAt,
        twitterPostId: `twitter-${i}`,
        twitterStats: {
          likes: Math.floor(baseLikes),
          retweets: Math.floor(baseLikes * 0.4),
          replies: Math.floor(baseLikes * 0.2),
        },
      });
    }

    return posts;
  };

  const samplePosts = generateSampleData();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Twitter Metrics Dashboard</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            <TrendingUp className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="timeframes">
            <Calendar className="h-4 w-4 mr-2" />
            Timeframes
          </TabsTrigger>
          <TabsTrigger value="realtime">
            <Clock className="h-4 w-4 mr-2" />
            Real-time Updates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Twitter Engagement Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-6">
                This dashboard provides a comprehensive view of your Twitter
                engagement metrics, helping you understand which content
                resonates with your audience.
              </p>

              <TwitterMetricsChart posts={samplePosts} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeframes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Last 7 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <TwitterMetricsChart
                  posts={samplePosts.filter(
                    (post) =>
                      post.publishedAt &&
                      post.publishedAt > Date.now() - 7 * 24 * 60 * 60 * 1000,
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Last 30 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <TwitterMetricsChart
                  posts={samplePosts.filter(
                    (post) =>
                      post.publishedAt &&
                      post.publishedAt > Date.now() - 30 * 24 * 60 * 60 * 1000,
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Metrics Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-6">
                In a production environment, this dashboard would update in
                real-time as new engagement metrics are fetched from Twitter.
                The metrics update service runs periodically to refresh data for
                all published posts.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">How Real-time Updates Work</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>
                    The <code>twitter-metrics.ts</code> module runs periodic
                    jobs to fetch fresh metrics from Twitter for all published
                    posts
                  </li>
                  <li>
                    Metrics are updated in the database with timestamps to track
                    when they were last refreshed
                  </li>
                  <li>
                    The UI components automatically reflect these updates
                    through Convex's real-time data synchronization
                  </li>
                  <li>
                    Posts are prioritized for updates based on recency and
                    engagement levels
                  </li>
                </ol>
              </div>

              <TwitterMetricsChart posts={samplePosts.slice(0, 5)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
