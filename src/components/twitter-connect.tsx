import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Twitter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TwitterConnectProps {
  campaignId: string;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function TwitterConnect({
  campaignId,
  isConnected,
  onConnect,
  onDisconnect,
}: TwitterConnectProps) {
  // Check if user has Twitter connected at account level
  const [userHasTwitter, setUserHasTwitter] = useState(true); // Default to true for demo
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check Twitter status on mount
  useEffect(() => {
    // No need to check localStorage anymore as the isConnected prop
    // is now coming directly from the Convex API via the parent component
  }, [campaignId, isConnected, onConnect]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Call the onConnect function which now uses the Convex API
      await onConnect();
      toast({
        title: "Success",
        description: "Twitter publishing enabled for this campaign",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable Twitter for this campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      // Call the onDisconnect function which now uses the Convex API
      await onDisconnect();
      toast({
        title: "Success",
        description: "Twitter publishing disabled for this campaign",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable Twitter for this campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user has Twitter connected at account level, show campaign-specific connection
  // Otherwise, show message to connect Twitter in account settings
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Twitter className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold">Twitter Integration</h3>
        </div>
        <Badge
          variant={isConnected ? "default" : "outline"}
          className={isConnected ? "bg-blue-100 text-blue-800" : ""}
        >
          {isConnected ? "Connected" : "Not Connected"}
        </Badge>
      </div>
      {userHasTwitter ? (
        <>
          <p className="text-gray-600 mb-4">
            {isConnected
              ? "Your Twitter account is connected. Campaign posts can be automatically published to your Twitter profile."
              : "Enable Twitter publishing for this campaign to automatically share posts to your Twitter profile."}
          </p>
          <div className="flex space-x-4">
            {isConnected ? (
              <>
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  onClick={handleDisconnect}
                  disabled={isLoading}
                >
                  {isLoading ? "Disconnecting..." : "Disable for Campaign"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/settings")}
                >
                  Configure Settings
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={handleConnect}
                disabled={isLoading}
              >
                {isLoading ? "Enabling..." : "Enable for Campaign"}
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            You need to connect your Twitter account in your profile settings
            before enabling Twitter for this campaign.
          </p>
          <Button
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
            onClick={() => (window.location.href = "/settings")}
          >
            Go to Account Settings
          </Button>
        </>
      )}
    </div>
  );
}
