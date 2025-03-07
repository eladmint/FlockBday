import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Users, FileText, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TwitterConnect } from "@/components/twitter-connect";
import { TwitterIntegrationInfo } from "@/components/twitter-integration-info";
import { TwitterPostForm } from "@/components/twitter-post-form";
import { TwitterPost } from "@/components/twitter-post";
import { ScheduledPostsList } from "@/components/scheduled-posts-list";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCampaignDetail } from "@/hooks/useCampaignDetail";
import { Id } from "../../convex/_generated/dataModel";

export default function CampaignDetail() {
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
    cancelScheduledPost,
  } = useCampaignDetail(id as string);

  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  const handlePostCreated = async (newPost: any) => {
    try {
      // Create the post using the hook
      await createPost({
        title: newPost.title,
        content: newPost.content,
        imageUrl: newPost.imageUrl || undefined,
        status: newPost.isScheduled ? "scheduled" : "draft",
        scheduledFor: newPost.scheduledFor,
        sharedOnTwitter: newPost.sharedOnTwitter,
      });
      setIsPostFormOpen(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handlePostUpdate = async (updatedPost: any) => {
    try {
      // Update the post using the hook
      await updatePost(updatedPost.id as Id<"campaignPosts">, {
        status: updatedPost.status,
        scheduledFor: updatedPost.scheduledFor,
        sharedOnTwitter: updatedPost.sharedOnTwitter,
        twitterPostId: updatedPost.twitterPostId,
        twitterStats: updatedPost.twitterStats,
        publishedAt: updatedPost.publishedAt,
      });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleCancelScheduled = async (post: any) => {
    try {
      // Cancel the scheduled post using the hook
      await cancelScheduledPost(post.id as Id<"campaignPosts">);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Campaign Not Found
            </h1>
            <p className="text-gray-600">
              The campaign you're looking for doesn't exist or you don't have
              access to it.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Campaign Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {campaign.title}
                </h1>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span>by</span>
                  <img
                    src={campaign.createdByAvatar}
                    alt={campaign.createdByName}
                    className="w-5 h-5 rounded-full mx-1"
                  />
                  <span>{campaign.createdByName}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <Badge
                    variant={
                      campaign.visibility === "public" ? "default" : "outline"
                    }
                  >
                    {campaign.visibility === "public" ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Private
                      </>
                    )}
                  </Badge>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    <span>
                      Created{" "}
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700">{campaign.description}</p>
              </div>
              {campaign.isOwner && (
                <Button variant="outline">Edit Campaign</Button>
              )}
            </div>
          </div>

          {/* Campaign Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                <h3 className="text-lg font-semibold">Posts</h3>
              </div>
              <p className="text-3xl font-bold mt-2">{campaign.postsCount}</p>
              <p className="text-sm text-gray-600 mt-1">Total campaign posts</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                <h3 className="text-lg font-semibold">Collaborators</h3>
              </div>
              <p className="text-3xl font-bold mt-2">
                {campaign.collaboratorsCount}
              </p>
              <p className="text-sm text-gray-600 mt-1">Team members</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-indigo-600" />
                <h3 className="text-lg font-semibold">Status</h3>
              </div>
              <p className="text-3xl font-bold mt-2">
                {campaign.isOwner
                  ? "Owner"
                  : campaign.isMember
                    ? "Member"
                    : "Not Joined"}
              </p>
              <p className="text-sm text-gray-600 mt-1">Your role</p>
            </div>
          </div>

          {/* Campaign Content Tabs */}
          <div className="p-6">
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <a
                  href="#"
                  className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                >
                  Posts
                </a>
                <a
                  href="#"
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                >
                  Collaborators
                </a>
                <a
                  href="#"
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                >
                  Analytics
                </a>
                {campaign.isOwner && (
                  <a
                    href="#"
                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                  >
                    Settings
                  </a>
                )}
              </nav>
            </div>

            {/* Twitter Integration Section */}
            <div>
              <TwitterIntegrationInfo />
              <TwitterConnect
                campaignId={campaign.id}
                isConnected={twitterEnabled}
                onConnect={enableTwitter}
                onDisconnect={disableTwitter}
              />
            </div>

            {/* Create Post Button */}
            {campaign.isOwner && (
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
                      campaignId={campaign.id}
                      isTwitterConnected={twitterEnabled}
                      onPostCreated={handlePostCreated}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Scheduled Posts Section */}
            {scheduledPosts.length > 0 && (
              <ScheduledPostsList
                posts={scheduledPosts}
                onPostUpdate={handlePostUpdate}
              />
            )}

            {/* Posts Content */}
            <div className="space-y-4">
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {posts.map((post) => (
                    <TwitterPost key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    No posts yet for this campaign.
                  </p>
                  {campaign.isOwner && (
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
