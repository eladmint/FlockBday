import { CampaignCard } from "@/components/campaign-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useUser } from "@clerk/clerk-react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useCreateDemoUser } from "@/hooks/useCreateDemoUser";
import { CampaignPageLayout } from "@/components/campaign-page-layout";
import { CampaignCreateDialog } from "@/components/campaign-create-dialog";

export default function CampaignDashboard() {
  const { isLoaded: isUserLoaded } = useUser();
  const { myCampaigns, trendingCampaigns, isLoading, createCampaign } =
    useCampaigns();

  // Create demo user on component mount
  useCreateDemoUser();

  // Mock subscription status
  const subscriptionStatus = { hasActiveSubscription: false };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCampaign = async (data: {
    title: string;
    description: string;
    visibility: string;
  }) => {
    try {
      setIsCreating(true);
      // Create the campaign and update state
      await createCampaign(data);
      setIsDialogOpen(false);
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsCreating(false);
    }
  };

  if (!isUserLoaded) {
    return <LoadingSpinner />;
  }

  const hasActiveSubscription = subscriptionStatus?.hasActiveSubscription;
  const showUpgradePrompt =
    !hasActiveSubscription &&
    (myCampaigns?.filter((campaign) => campaign.isOwner).length ?? 0) >= 3;

  return (
    <CampaignPageLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Campaign Dashboard</h1>
        <CampaignCreateDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onCreateCampaign={handleCreateCampaign}
          isCreating={isCreating}
        />
      </div>

      {/* My Campaigns Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">My Campaigns</h2>
          {showUpgradePrompt && (
            <Button
              variant="outline"
              className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
            >
              Upgrade for More Campaigns
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : myCampaigns?.length === 0 ? (
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
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : trendingCampaigns?.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No trending campaigns
            </h3>
            <p className="text-gray-600">Check back later for new campaigns</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCampaigns?.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </CampaignPageLayout>
  );
}
