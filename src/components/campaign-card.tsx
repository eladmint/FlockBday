import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Campaign } from "@/types/campaign";
import { Users, FileText, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Link } from "react-router-dom";

interface CampaignCardProps {
  campaign: Campaign;
  onJoin?: () => void;
}

export function CampaignCard({ campaign, onJoin }: CampaignCardProps) {
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  // Use the Convex API hooks
  const { joinCampaign, requestToJoinCampaign } = useCampaigns();

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await joinCampaign(campaign.id);
      if (onJoin) onJoin();
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsJoining(false);
    }
  };

  const handleRequest = async () => {
    try {
      setIsJoining(true);
      await requestToJoinCampaign(campaign.id);
      if (onJoin) onJoin();
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card className="w-full bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <Link to={`/campaign/${campaign.id}`} className="block">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">
              {campaign.title}
            </CardTitle>
            <Badge
              variant={campaign.visibility === "public" ? "default" : "outline"}
              className="ml-2"
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
          </div>
          {campaign.createdByName && (
            <div className="flex items-center mt-1 mb-1">
              <img
                src={campaign.createdByAvatar}
                alt={campaign.createdByName}
                className="w-5 h-5 rounded-full mr-1"
              />
              <span className="text-xs text-gray-600">
                {campaign.createdByName}
              </span>
            </div>
          )}
          <CardDescription className="mt-2 line-clamp-2">
            {campaign.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1 text-gray-400" />
              <span>{campaign.postsCount} posts</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-gray-400" />
              <span>{campaign.collaboratorsCount} collaborators</span>
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="pt-2">
        {campaign.isOwner ? (
          <Link to={`/campaign/${campaign.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              Manage Campaign
            </Button>
          </Link>
        ) : campaign.isMember ? (
          <Link to={`/campaign/${campaign.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              View Campaign
            </Button>
          </Link>
        ) : campaign.visibility === "public" ? (
          <Button
            variant="default"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={handleJoin}
            disabled={isJoining}
          >
            {isJoining ? "Joining..." : "Join Campaign"}
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleRequest}
            disabled={isJoining}
          >
            {isJoining ? "Requesting..." : "Request to Join"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
