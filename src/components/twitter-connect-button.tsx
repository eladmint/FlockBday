import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";
import { useTwitterService } from "@/hooks/useTwitterService";

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

  const handleConnect = async () => {
    if (!accountConnected) {
      // If Twitter account is not connected, show message
      alert("Please connect your Twitter account in settings first");
      return;
    }

    await onConnect();
  };

  const handleDisconnect = async () => {
    await onDisconnect();
  };

  return (
    <div className={`flex items-center ${className}`}>
      {isConnected ? (
        <Button
          variant="outline"
          className="text-red-600 border-red-600 hover:bg-red-50"
          onClick={handleDisconnect}
        >
          <Twitter className="h-4 w-4 mr-2" />
          Disable Twitter Publishing
        </Button>
      ) : (
        <Button
          variant="outline"
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
          onClick={handleConnect}
        >
          <Twitter className="h-4 w-4 mr-2" />
          Enable Twitter Publishing
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
