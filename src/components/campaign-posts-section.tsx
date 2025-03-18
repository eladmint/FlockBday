import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TwitterPostForm } from "@/components/twitter-post-form";
import { TwitterPost } from "@/components/twitter-post";
import { useState } from "react";

interface CampaignPostsSectionProps {
  campaignId: string;
  isOwner: boolean;
  twitterEnabled: boolean;
  posts: any[];
  onPostCreated: (post: any) => void;
  onPostUpdate?: (post: any) => void;
}

/**
 * Shared component for displaying campaign posts section
 */
export function CampaignPostsSection({
  campaignId,
  isOwner,
  twitterEnabled,
  posts,
  onPostCreated,
  onPostUpdate,
}: CampaignPostsSectionProps) {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  const handlePostCreated = (post: any) => {
    onPostCreated(post);
    setIsPostFormOpen(false);
  };

  return (
    <div>
      {/* Create Post Button */}
      {isOwner && (
        <div className="mb-6 flex justify-end">
          <Dialog open={isPostFormOpen} onOpenChange={setIsPostFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <TwitterPostForm
                campaignId={campaignId}
                isTwitterConnected={twitterEnabled}
                onPostCreated={handlePostCreated}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Posts Content */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <TwitterPost key={post.id} post={post} onUpdate={onPostUpdate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts yet for this campaign.</p>
            {isOwner && (
              <Button
                className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setIsPostFormOpen(true)}
              >
                Create First Post
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
