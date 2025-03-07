import { Badge } from "@/components/ui/badge";
import { Twitter, MessageSquare, Heart, Repeat, Clock } from "lucide-react";

interface TwitterPostProps {
  post: {
    title: string;
    content: string;
    createdAt: number;
    imageUrl?: string | null;
    sharedOnTwitter?: boolean;
    twitterPostId?: string | null;
    isScheduled?: boolean;
    scheduledFor?: number | null;
    status?: "scheduled" | "published" | "failed";
    twitterStats?: {
      likes: number;
      retweets: number;
      replies: number;
    };
  };
}

export function TwitterPost({ post }: TwitterPostProps) {
  // Generate random Twitter stats if not provided
  const twitterStats = post.twitterStats || {
    likes: Math.floor(Math.random() * 50),
    retweets: Math.floor(Math.random() * 20),
    replies: Math.floor(Math.random() * 10),
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-900">{post.title}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {post.isScheduled && post.scheduledFor
              ? new Date(post.scheduledFor).toLocaleString()
              : new Date(post.createdAt).toLocaleDateString()}
          </span>
          {post.isScheduled && post.status === "scheduled" && (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-600 border-amber-200"
            >
              <Clock className="h-3 w-3 mr-1" />
              Scheduled
            </Badge>
          )}
          {post.sharedOnTwitter && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-600 border-blue-200"
            >
              <Twitter className="h-3 w-3 mr-1" />
              Shared
            </Badge>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3">{post.content}</p>

      {post.imageUrl && (
        <div className="mb-3">
          <img
            src={post.imageUrl}
            alt="Post image"
            className="rounded-lg w-full max-h-64 object-cover"
          />
        </div>
      )}

      {post.sharedOnTwitter && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center">
              <Heart className="h-3 w-3 mr-1 text-red-400" />
              <span>{twitterStats.likes} likes</span>
            </div>
            <div className="flex items-center">
              <Repeat className="h-3 w-3 mr-1 text-green-400" />
              <span>{twitterStats.retweets} retweets</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1 text-blue-400" />
              <span>{twitterStats.replies} replies</span>
            </div>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline ml-auto"
            >
              View on Twitter
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
