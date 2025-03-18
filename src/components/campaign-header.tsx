import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Calendar } from "lucide-react";
import { Campaign } from "@/types/campaign";

interface CampaignHeaderProps {
  campaign: Campaign;
}

/**
 * Shared component for displaying campaign header information
 */
export function CampaignHeader({ campaign }: CampaignHeaderProps) {
  return (
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
              variant={campaign.visibility === "public" ? "default" : "outline"}
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
                Created {new Date(campaign.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <p className="text-gray-700">{campaign.description}</p>
        </div>
        {campaign.isOwner && <Button variant="outline">Edit Campaign</Button>}
      </div>
    </div>
  );
}
