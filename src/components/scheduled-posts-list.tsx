import { useState, useEffect } from "react";
import { TwitterPost } from "@/components/twitter-post";
import { Button } from "@/components/ui/button";
import { useTwitterService } from "@/services/twitter-service";
import { Clock, AlertTriangle } from "lucide-react";

interface ScheduledPostsListProps {
  posts: any[];
  onPostUpdate: (updatedPost: any) => void;
}

export function ScheduledPostsList({
  posts,
  onPostUpdate,
}: ScheduledPostsListProps) {
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const twitterService = useTwitterService();

  useEffect(() => {
    // The posts are now coming directly from the Convex API
    // and are already filtered for scheduled posts
    setScheduledPosts(posts);
  }, [posts]);

  const handlePublishNow = async (post: any) => {
    try {
      // Cancel the scheduled post on server
      await twitterService.cancelScheduledPost(post);

      // Publish immediately
      const updatedPost = await twitterService.publishNow(post);

      // Update the post in the parent component
      onPostUpdate(updatedPost);
    } catch (error) {
      console.error("Error publishing post:", error);
    }
  };

  const handleCancelScheduled = async (post: any) => {
    try {
      // Cancel the scheduled post on server
      const cancelled = await twitterService.cancelScheduledPost(post);

      if (cancelled) {
        // Update the post status
        const updatedPost = {
          ...post,
          status: "cancelled",
          isScheduled: false,
        };

        // Update the post in the parent component
        onPostUpdate(updatedPost);
      }
    } catch (error) {
      console.error("Error canceling scheduled post:", error);
    }
  };

  if (scheduledPosts.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 text-amber-500 mr-2" />
        <h3 className="text-lg font-semibold">Scheduled Posts</h3>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
        <div className="flex items-start">
          <Clock className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <div>
            <p className="text-sm text-green-800">
              <strong>Server-side scheduling:</strong> Your posts will be
              published automatically at the scheduled time, even if you close
              this browser.
            </p>
            <p className="text-xs text-green-700 mt-1">
              Posts scheduled within 1 minute are published immediately. All
              other scheduled posts are managed by our server-side scheduler for
              reliable delivery.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {scheduledPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg border border-amber-200 overflow-hidden"
          >
            <TwitterPost post={post} />
            <div className="px-4 py-3 bg-amber-50 border-t border-amber-200 flex justify-between items-center">
              <div className="text-sm text-amber-800">
                Scheduled for:{" "}
                <strong>{new Date(post.scheduledFor).toLocaleString()}</strong>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePublishNow(post)}
                >
                  Publish Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancelScheduled(post)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
