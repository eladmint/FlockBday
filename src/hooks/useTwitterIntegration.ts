import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export function useTwitterIntegration() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  // Get Twitter connection status
  const twitterStatus = useQuery(api.twitter.getTwitterStatus) || {
    connected: false,
  };

  // Mutations
  const connectTwitterMutation = useMutation(api.twitter.connectTwitterAccount);
  const disconnectTwitterMutation = useMutation(
    api.twitter.disconnectTwitterAccount,
  );

  // Connect Twitter account
  const connectTwitter = async (credentials: {
    accessToken: string;
    accessTokenSecret: string;
    username: string;
    profileImageUrl?: string;
  }) => {
    setIsConnecting(true);
    try {
      await connectTwitterMutation(credentials);
      toast({
        title: "Success",
        description: "Twitter account connected successfully",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to connect Twitter account",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect Twitter account
  const disconnectTwitter = async () => {
    setIsConnecting(true);
    try {
      await disconnectTwitterMutation({});
      toast({
        title: "Success",
        description: "Twitter account disconnected successfully",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to disconnect Twitter account",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    isConnected: twitterStatus.connected,
    username: twitterStatus.username,
    profileImageUrl: twitterStatus.profileImageUrl,
    isConnecting,
    connectTwitter,
    disconnectTwitter,
  };
}
