import React from "react";
import { TwitterMetricsChart } from "@/components/twitter-metrics-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * This storyboard showcases the Twitter metrics visualization component
 * with sample data for demonstration purposes.
 */
export default function TwitterMetricsStoryboard() {
  // Sample posts with Twitter metrics
  const samplePosts = [
    {
      _id: "post1",
      title: "Product Launch Announcement",
      content:
        "We're excited to announce our new product line launching next week! #productlaunch #innovation",
      publishedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
      twitterPostId: "twitter-123456",
      twitterStats: {
        likes: 42,
        retweets: 15,
        replies: 8,
      },
    },
    {
      _id: "post2",
      title: "Customer Success Story",
      content:
        "Read how our customer achieved 200% ROI using our platform in just 3 months! #customersuccess #casestudy",
      publishedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
      twitterPostId: "twitter-234567",
      twitterStats: {
        likes: 28,
        retweets: 9,
        replies: 3,
      },
    },
    {
      _id: "post3",
      title: "Industry Insights Report",
      content:
        "Our latest industry report reveals key trends for 2023. Download now to stay ahead of the curve! #industrytrends #report",
      publishedAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
      twitterPostId: "twitter-345678",
      twitterStats: {
        likes: 76,
        retweets: 31,
        replies: 12,
      },
    },
    {
      _id: "post4",
      title: "Team Spotlight",
      content:
        "Meet our amazing engineering team who's been working hard to bring you new features! #teamspotlight #engineering",
      publishedAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
      twitterPostId: "twitter-456789",
      twitterStats: {
        likes: 53,
        retweets: 14,
        replies: 7,
      },
    },
    {
      _id: "post5",
      title: "Feature Update",
      content:
        "We've just released a major update to our platform with 5 new features you've been asking for! #productupdate #newfeatures",
      publishedAt: Date.now() - 25 * 24 * 60 * 60 * 1000, // 25 days ago
      twitterPostId: "twitter-567890",
      twitterStats: {
        likes: 89,
        retweets: 37,
        replies: 21,
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Twitter Metrics Visualization</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Twitter Metrics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-6">
              This component visualizes Twitter engagement metrics for your
              campaign posts, allowing you to track performance over time and
              identify top-performing content.
            </p>

            <TwitterMetricsChart posts={samplePosts} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Empty State Example</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-6">
              When no Twitter metrics are available, the component displays an
              empty state prompting users to publish posts to Twitter.
            </p>

            <TwitterMetricsChart posts={[]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
