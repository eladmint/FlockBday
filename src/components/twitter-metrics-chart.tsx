import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Repeat, MessageSquare, TrendingUp } from "lucide-react";

interface TwitterMetricsChartProps {
  posts: Array<{
    _id: string;
    title: string;
    content: string;
    publishedAt?: number;
    twitterPostId?: string;
    twitterStats?: {
      likes: number;
      retweets: number;
      replies: number;
    };
  }>;
}

/**
 * TwitterMetricsChart Component
 *
 * This component displays Twitter engagement metrics for published posts
 * in a visual format, allowing users to track performance over time.
 */
export function TwitterMetricsChart({ posts }: TwitterMetricsChartProps) {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("week");

  // Filter posts with Twitter stats and sort by publish date
  const postsWithStats = posts
    .filter(
      (post) => post.twitterPostId && post.twitterStats && post.publishedAt,
    )
    .sort((a, b) => (a.publishedAt || 0) - (b.publishedAt || 0));

  // Filter posts based on selected timeframe
  const filteredPosts = React.useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

    if (timeframe === "week") {
      return postsWithStats.filter(
        (post) => (post.publishedAt || 0) >= weekAgo,
      );
    } else if (timeframe === "month") {
      return postsWithStats.filter(
        (post) => (post.publishedAt || 0) >= monthAgo,
      );
    }
    return postsWithStats;
  }, [postsWithStats, timeframe]);

  // Calculate total metrics
  const totalMetrics = filteredPosts.reduce(
    (acc, post) => {
      if (post.twitterStats) {
        acc.likes += post.twitterStats.likes || 0;
        acc.retweets += post.twitterStats.retweets || 0;
        acc.replies += post.twitterStats.replies || 0;
      }
      return acc;
    },
    { likes: 0, retweets: 0, replies: 0 },
  );

  // Find top performing post
  const topPost = React.useMemo(() => {
    if (filteredPosts.length === 0) return null;

    return filteredPosts.reduce((top, post) => {
      const currentTotal =
        (post.twitterStats?.likes || 0) +
        (post.twitterStats?.retweets || 0) +
        (post.twitterStats?.replies || 0);

      const topTotal =
        (top.twitterStats?.likes || 0) +
        (top.twitterStats?.retweets || 0) +
        (top.twitterStats?.replies || 0);

      return currentTotal > topTotal ? post : top;
    }, filteredPosts[0]);
  }, [filteredPosts]);

  if (postsWithStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Twitter Metrics
          </CardTitle>
          <CardDescription>
            Track engagement metrics for your Twitter posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No Twitter metrics available</p>
            <p className="text-xs mt-1">
              Publish posts to Twitter to see metrics
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          Twitter Metrics
        </CardTitle>
        <CardDescription>
          Track engagement metrics for your Twitter posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>

          <div className="mb-4">
            <TabsList className="w-full justify-start">
              <TabsTrigger
                value="week"
                onClick={() => setTimeframe("week")}
                className={timeframe === "week" ? "bg-blue-50" : ""}
              >
                Last 7 days
              </TabsTrigger>
              <TabsTrigger
                value="month"
                onClick={() => setTimeframe("month")}
                className={timeframe === "month" ? "bg-blue-50" : ""}
              >
                Last 30 days
              </TabsTrigger>
              <TabsTrigger
                value="all"
                onClick={() => setTimeframe("all")}
                className={timeframe === "all" ? "bg-blue-50" : ""}
              >
                All time
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="font-medium">Likes</h3>
                </div>
                <p className="text-2xl font-bold">{totalMetrics.likes}</p>
                <p className="text-sm text-gray-500">
                  {filteredPosts.length} posts,{" "}
                  {timeframe === "week"
                    ? "7"
                    : timeframe === "month"
                      ? "30"
                      : "all"}{" "}
                  days
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Repeat className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="font-medium">Retweets</h3>
                </div>
                <p className="text-2xl font-bold">{totalMetrics.retweets}</p>
                <p className="text-sm text-gray-500">
                  {filteredPosts.length} posts,{" "}
                  {timeframe === "week"
                    ? "7"
                    : timeframe === "month"
                      ? "30"
                      : "all"}{" "}
                  days
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="font-medium">Replies</h3>
                </div>
                <p className="text-2xl font-bold">{totalMetrics.replies}</p>
                <p className="text-sm text-gray-500">
                  {filteredPosts.length} posts,{" "}
                  {timeframe === "week"
                    ? "7"
                    : timeframe === "month"
                      ? "30"
                      : "all"}{" "}
                  days
                </p>
              </div>
            </div>

            {topPost && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Top Performing Post</h3>
                <p className="text-sm font-medium">{topPost.title}</p>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {topPost.content}
                </p>
                <div className="flex space-x-4 text-xs">
                  <div className="flex items-center">
                    <Heart className="h-3 w-3 text-red-500 mr-1" />
                    <span>{topPost.twitterStats?.likes || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Repeat className="h-3 w-3 text-green-500 mr-1" />
                    <span>{topPost.twitterStats?.retweets || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 text-blue-500 mr-1" />
                    <span>{topPost.twitterStats?.replies || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="posts">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div key={post._id} className="border rounded-lg p-4">
                    <p className="text-sm font-medium">{post.title}</p>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4 text-xs">
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 text-red-500 mr-1" />
                          <span>{post.twitterStats?.likes || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Repeat className="h-3 w-3 text-green-500 mr-1" />
                          <span>{post.twitterStats?.retweets || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 text-blue-500 mr-1" />
                          <span>{post.twitterStats?.replies || 0}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : "Unknown date"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No posts in selected timeframe</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
