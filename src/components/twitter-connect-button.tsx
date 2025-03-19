import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";
import { useTwitterService } from "@/hooks/useTwitterService";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface TwitterConnectButtonProps {
  campaignId: string;
  isConnected: boolean;
  onConnect: () => Promise<boolean>;
  onDisconnect: () => Promise<boolean>;
  className?: string;
}

/**
 * A button component for connecting/disconnecting Twitter integration
 * Extracted from the TwitterConnect component to reduce duplication
 */
export function TwitterConnectButton({
  campaignId,
  isConnected,
  onConnect,
  onDisconnect,
  className = "",
}: TwitterConnectButtonProps) {
  const { isConnected: accountConnected, username } = useTwitterService();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Direct mutation for enabling Twitter
  const enableTwitterMutation = useMutation(
    api.twitter.enableTwitterForCampaign,
  );

  const handleConnect = async () => {
    if (!campaignId) return;

    setIsLoading(true);
    try {
      // Try direct mutation first (this is the most reliable approach)
      const result = await enableTwitterMutation({
        campaignId: campaignId,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Twitter publishing enabled for this campaign",
        });
        await onConnect();
      } else {
        throw new Error(result.error || "Failed to enable Twitter");
      }
    } catch (error) {
      console.error("Error enabling Twitter:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to enable Twitter for this campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await onDisconnect();
    } catch (error) {
      console.error("Error disabling Twitter:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to disable Twitter for this campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {isConnected ? (
        <Button
          variant="outline"
          className="text-red-600 border-red-600 hover:bg-red-50"
          onClick={handleDisconnect}
          disabled={isLoading}
        >
          <Twitter className="h-4 w-4 mr-2" />
          {isLoading ? "Disabling..." : "Disable Twitter Publishing"}
        </Button>
      ) : (
        <Button
          variant="outline"
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
          onClick={handleConnect}
          disabled={isLoading}
        >
          <Twitter className="h-4 w-4 mr-2" />
          {isLoading ? "Enabling..." : "Enable for Campaign"}
        </Button>
      )}
      {accountConnected && (
        <span className="ml-2 text-sm text-gray-600">
          Connected as @{username}
        </span>
      )}
    </div>
  );
}
