import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Campaign } from "@/types/campaign";
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

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  useEffect(() => {
    // Set mock Twitter connection for demo purposes
    localStorage.setItem("userTwitterConnected", "true");

    // Simulate fetching campaign data
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        // In a real app, this would be a call to your Convex API
        // For now, we'll simulate with a timeout and mock data
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get current user ID from localStorage or session
        const currentUserId =
          localStorage.getItem("currentUserId") || "user123";

        // Check if this is a user-created campaign from localStorage
        const savedCampaigns = localStorage.getItem("userCampaigns");
        let userCampaign = null;

        if (savedCampaigns && id) {
          const parsedCampaigns = JSON.parse(savedCampaigns);
          userCampaign = parsedCampaigns.find((c: Campaign) => c.id === id);
        }

        if (userCampaign) {
          // Use the saved campaign data
          setCampaign({
            ...userCampaign,
            twitterEnabled:
              localStorage.getItem("campaign-" + id + "-twitter") === "true",
          });
          setLoading(false);
          return;
        }

        // Mock campaign data based on ID
        const mockCampaign: Campaign = {
          id: id || "1",
          title:
            id === "new-1741295066188"
              ? "Spring Collection"
              : id === "1"
                ? "Summer Marketing Campaign"
                : id === "2"
                  ? "Holiday Season Promotion"
                  : id === "3"
                    ? "Black Friday Event"
                    : id === "4"
                      ? "New Product Launch"
                      : id.startsWith("new-")
                        ? "Test Campaign"
                        : "Spring Collection",
          description:
            id === "new-1741295066188"
              ? "Introducing our fresh spring collection with exclusive early-bird offers."
              : id === "1"
                ? "Boost sales during the summer season with targeted promotions and social media campaigns."
                : id === "2"
                  ? "Special offers and discounts for the holiday season to increase customer engagement."
                  : id === "3"
                    ? "Massive discounts and special offers for Black Friday shopping event."
                    : id === "4"
                      ? "Marketing campaign for the launch of our newest product line."
                      : id.startsWith("new-")
                        ? "This is a test campaign for Twitter publishing."
                        : "Introducing our fresh spring collection with exclusive early-bird offers.",
          visibility: id === "2" ? "private" : "public",
          postsCount: id.startsWith("new-") ? 0 : parseInt(id || "1") * 3 + 3,
          collaboratorsCount: id.startsWith("new-")
            ? 1
            : parseInt(id || "1") + 2,
          createdBy:
            id === "1" || id === "2" || id.startsWith("new-")
              ? "user123"
              : `user${id}`,
          createdByName:
            id === "1" || id === "2" || id.startsWith("new-")
              ? "John Doe"
              : `User ${id}`,
          createdByAvatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
          createdAt:
            Date.now() -
            (id.startsWith("new-") ? 0 : parseInt(id || "1") * 86400000),
          isOwner:
            (id === "1" || id === "2" || id.startsWith("new-")) &&
            currentUserId === "user123",
          isMember:
            id === "1" ||
            id === "2" ||
            id.startsWith("new-") ||
            currentUserId === `user${id}`,
          twitterEnabled:
            localStorage.getItem("campaign-" + id + "-twitter") === "true",
        };

        setCampaign(mockCampaign);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();

    // Fetch posts from localStorage first
    const fetchPosts = async () => {
      // Check if we have saved posts for this campaign
      const savedPostsKey = `campaign-${id}-posts`;
      const savedPosts = localStorage.getItem(savedPostsKey);

      if (savedPosts) {
        // Use saved posts if available
        setPosts(JSON.parse(savedPosts));
        return;
      }

      // Otherwise generate mock posts
      await new Promise((resolve) => setTimeout(resolve, 700));

      // Generate mock posts based on campaign ID
      if (id && id.startsWith("new-")) {
        // New campaign has no posts yet
        setPosts([]);
      } else {
        const mockPosts = Array.from({
          length: parseInt(id || "1") * 3 + 3,
        }).map((_, index) => ({
          id: `post-${index}`,
          title:
            index === 0
              ? "Campaign Launch Announcement"
              : index === 1
                ? "Weekly Update #1"
                : index === 2
                  ? "New Product Feature"
                  : index === 3
                    ? "Customer Testimonial"
                    : index === 4
                      ? "Special Promotion"
                      : `Campaign Update #${index + 1}`,
          content:
            index === 0
              ? "We're excited to announce the launch of our new campaign!"
              : index === 1
                ? "Here's our first weekly update on campaign performance."
                : index === 2
                  ? "Check out this new feature we're highlighting in our campaign."
                  : index === 3
                    ? "Here's what our customers are saying about our products."
                    : index === 4
                      ? "Limited time offer: Use code CAMPAIGN20 for 20% off!"
                      : `This is post #${index + 1} for the campaign.`,
          createdAt: Date.now() - index * 86400000 * 2,
          imageUrl:
            index % 3 === 0
              ? `https://images.unsplash.com/photo-${1570000000 + index * 1000}?w=800&q=80`
              : null,
          sharedOnTwitter: index % 2 === 0,
          twitterPostId:
            index % 2 === 0 ? `twitter-${Date.now() - index * 1000}` : null,
          isScheduled: index % 5 === 0,
          scheduledFor:
            index % 5 === 0 ? Date.now() + 86400000 * ((index % 3) + 1) : null,
          status: index % 5 === 0 ? "scheduled" : "published",
        }));
        setPosts(mockPosts);

        // Save mock posts to localStorage
        localStorage.setItem(savedPostsKey, JSON.stringify(mockPosts));
      }
    };

    fetchPosts();
  }, [id]);

  const handlePostCreated = (newPost: any) => {
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);

    // Save to localStorage
    const savedPostsKey = `campaign-${id}-posts`;
    localStorage.setItem(savedPostsKey, JSON.stringify(updatedPosts));

    setIsPostFormOpen(false);
  };

  const handlePostUpdate = (updatedPost: any) => {
    const updatedPosts = posts.map((post) =>
      post.id === updatedPost.id ? updatedPost : post,
    );

    setPosts(updatedPosts);

    // Save to localStorage
    const savedPostsKey = `campaign-${id}-posts`;
    localStorage.setItem(savedPostsKey, JSON.stringify(updatedPosts));
  };

  if (loading) {
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
                isConnected={campaign.twitterEnabled || false}
                onConnect={() =>
                  setCampaign({ ...campaign, twitterEnabled: true })
                }
                onDisconnect={() =>
                  setCampaign({ ...campaign, twitterEnabled: false })
                }
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
                      isTwitterConnected={campaign.twitterEnabled || false}
                      onPostCreated={handlePostCreated}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Scheduled Posts Section */}
            <ScheduledPostsList posts={posts} onPostUpdate={handlePostUpdate} />

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
