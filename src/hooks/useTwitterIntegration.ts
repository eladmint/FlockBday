import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { TwitterService } from "@/services/twitter-service";

export function useTwitterIntegration() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Get Twitter connection status from Convex
  const twitterStatus = useQuery(api.twitter.getTwitterStatus) || {
    connected: false,
  };

  // Initialize Twitter service
  const twitterService = TwitterService.getInstance();

  // Verify Twitter credentials on mount
  useEffect(() => {
    const verifyCredentials = async () => {
      if (twitterStatus.connected && !isVerifying) {
        setIsVerifying(true);
        try {
          const isValid = await twitterService.verifyAuthentication();
          if (!isValid && twitterStatus.connected) {
            console.warn("Twitter credentials are invalid or expired");
            // You might want to update the status in Convex here
          }
        } catch (error) {
          console.error("Error verifying Twitter credentials:", error);
        } finally {
          setIsVerifying(false);
        }
      }
    };

    verifyCredentials();
  }, [twitterStatus.connected]);

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
      // For demo purposes, use mock credentials if none provided
      const mockCredentials = {
        accessToken: "mock-access-token",
        accessTokenSecret: "mock-access-token-secret",
        username: "twitter_user",
        profileImageUrl:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=twitter",
      };

      const finalCredentials = credentials.accessToken
        ? credentials
        : mockCredentials;

      // Update credentials in Convex
      await connectTwitterMutation(finalCredentials);

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
