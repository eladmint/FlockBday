import { FileText, Users, Eye } from "lucide-react";
import { Campaign } from "@/types/campaign";

interface CampaignStatsProps {
  campaign: Campaign;
}

/**
 * Shared component for displaying campaign statistics
 */
export function CampaignStats({ campaign }: CampaignStatsProps) {
  return (
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
        <p className="text-3xl font-bold mt-2">{campaign.collaboratorsCount}</p>
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
  );
}
