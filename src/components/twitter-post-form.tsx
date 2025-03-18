import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Twitter, Image, Link2, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCampaignDetail } from "@/hooks/useCampaignDetail";

interface TwitterPostFormProps {
  campaignId: string;
  isTwitterConnected: boolean;
  onPostCreated: (post: any) => void;
}

export function TwitterPostForm({
  campaignId,
  isTwitterConnected,
  onPostCreated,
}: TwitterPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [shareOnTwitter, setShareOnTwitter] = useState(isTwitterConnected);
  const [imageUrl, setImageUrl] = useState("");
  const [schedulePost, setSchedulePost] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const { toast } = useToast();
  const { createPost } = useCampaignDetail(campaignId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (schedulePost && (!scheduledDate || !scheduledTime)) {
      toast({
        title: "Error",
        description: "Please select a date and time for scheduled post",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate scheduled timestamp if scheduling is enabled
      const scheduledTimestamp =
        schedulePost && scheduledDate && scheduledTime
          ? new Date(`${scheduledDate}T${scheduledTime}`).getTime()
          : undefined;

      // Create post using the Convex mutation
      const postId = await createPost({
        title: postTitle,
        content: postContent,
        imageUrl: imageUrl || undefined,
        status: schedulePost ? "scheduled" : "published",
        scheduledFor: scheduledTimestamp,
        sharedOnTwitter: shareOnTwitter && isTwitterConnected,
      });

      if (postId) {
        // Create a temporary post object for the UI
        const newPost = {
          id: postId,
          title: postTitle,
          content: postContent,
          imageUrl: imageUrl || null,
          campaignId,
          createdAt: Date.now(),
          sharedOnTwitter: shareOnTwitter && isTwitterConnected,
          isScheduled: schedulePost,
          scheduledFor: scheduledTimestamp,
          status: schedulePost ? "scheduled" : "published",
        };

        onPostCreated(newPost);

        // Show success message
        toast({
          title: "Success",
          description: schedulePost
            ? `Post scheduled for ${new Date(scheduledTimestamp).toLocaleString()}`
            : shareOnTwitter && isTwitterConnected
              ? "Post created and shared on Twitter"
              : "Post created successfully",
        });

        // Reset form
        setPostTitle("");
        setPostContent("");
        setImageUrl("");
        setSchedulePost(false);
        setScheduledDate("");
        setScheduledTime("");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg border border-gray-200"
    >
      <h3 className="text-lg font-semibold mb-4">Create New Post</h3>

      <div className="space-y-2">
        <Label htmlFor="postTitle">Post Title</Label>
        <Input
          id="postTitle"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="Enter post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postContent">Post Content</Label>
        <Textarea
          id="postContent"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="What's happening with your campaign?"
          rows={4}
          required
        />
        <div className="text-xs text-gray-500 flex justify-between">
          <span>Characters: {postContent.length}</span>
          {shareOnTwitter && (
            <span className={postContent.length > 280 ? "text-red-500" : ""}>
              Twitter: {postContent.length}/280{" "}
              {postContent.length > 280 && "(too long)"}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <div className="flex">
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="ml-2"
            onClick={() =>
              setImageUrl(
                "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
              )
            }
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {isTwitterConnected && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="shareOnTwitter"
              checked={shareOnTwitter}
              onCheckedChange={(checked) =>
                setShareOnTwitter(checked as boolean)
              }
            />
            <Label
              htmlFor="shareOnTwitter"
              className="flex items-center cursor-pointer"
            >
              <Twitter className="h-4 w-4 text-blue-500 mr-1" />
              Share on Twitter
            </Label>
          </div>
        )}

        {!isTwitterConnected && (
          <div className="text-sm text-amber-600 flex items-center">
            <Link2 className="h-4 w-4 mr-1" />
            Connect Twitter in settings to share posts automatically
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="schedulePost"
            checked={schedulePost}
            onCheckedChange={(checked) => setSchedulePost(checked as boolean)}
          />
          <Label
            htmlFor="schedulePost"
            className="flex items-center cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-indigo-500 mr-1" />
            Schedule for later
          </Label>
        </div>

        {schedulePost && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required={schedulePost}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Time</Label>
              <Input
                id="scheduledTime"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required={schedulePost}
              />
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700"
        disabled={
          isSubmitting ||
          (shareOnTwitter && postContent.length > 280) ||
          (schedulePost && (!scheduledDate || !scheduledTime))
        }
      >
        {isSubmitting
          ? "Creating Post..."
          : schedulePost
            ? "Schedule Post"
            : "Create Post"}
      </Button>
    </form>
  );
}
