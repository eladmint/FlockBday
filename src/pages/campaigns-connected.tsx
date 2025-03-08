import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CampaignCard } from "@/components/campaign-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function CampaignDashboard() {
  const { isLoaded: isUserLoaded } = useUser();
  const { myCampaigns, trendingCampaigns, isLoading, createCampaign } =
    useCampaigns();

  // We don't need to query for the current user since it's handled in the useCampaigns hook

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public",
  });

  const { toast } = useToast();

  const createDemoUserMutation = useMutation(api.createUser.createDemoUser);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      // Ensure we have valid data
      if (!formData.title || !formData.description) {
        toast({
          title: "Error",
          description: "Title and description are required",
          variant: "destructive",
        });
        setIsCreating(false);
        return;
      }

      // First create the demo user to ensure it exists
      console.log("Creating demo user first...");
      const userResult = await createDemoUserMutation();
      console.log("User creation result:", userResult);

      // Create the campaign using the hook
      console.log("Now creating campaign...");
      await createCampaign({
        title: formData.title,
        description: formData.description,
        visibility: formData.visibility,
      });
      setIsDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        visibility: "public",
      });
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      visibility: value,
    }));
  };

  if (!isUserLoaded || isLoading) {
    return <LoadingSpinner />;
  }

  // Check if user has reached free tier limit
  const ownedCampaigns =
    myCampaigns?.filter((campaign) => campaign.isOwner) || [];
  const showUpgradePrompt = ownedCampaigns.length >= 3;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Campaign Dashboard
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleCreateCampaign}>
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new campaign.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Visibility</Label>
                    <RadioGroup
                      value={formData.visibility}
                      onValueChange={handleRadioChange}
                      className="col-span-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public">Public</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private">Private</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Campaign"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* My Campaigns Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              My Campaigns
            </h2>
            {showUpgradePrompt && (
              <Button
                variant="outline"
                className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
              >
                Upgrade for More Campaigns
              </Button>
            )}
          </div>
          {myCampaigns?.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No campaigns yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first campaign to get started
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Create Campaign
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCampaigns?.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>

        {/* Explore Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Explore Trending Campaigns
          </h2>
          {trendingCampaigns?.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No trending campaigns
              </h3>
              <p className="text-gray-600">
                Check back later for new campaigns
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingCampaigns?.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
