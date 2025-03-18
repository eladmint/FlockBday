import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTwitterCredentials } from "@/hooks/useTwitterCredentials";
import { Twitter, Bug, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "../../convex/_generated/api";

/**
 * A debug panel for Twitter integration
 * This component is useful during development and testing
 */
export function TwitterDebugPanel() {
  const { isConfigured, isLoading, username } = useTwitterCredentials();
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const checkTwitterStatus = async () => {
    setIsChecking(true);
    try {
      // Check Twitter status using Convex
      const status = await api.twitter.getTwitterStatus.query();

      toast({
        title: "Twitter Status",
        description: status.connected
          ? `Connected as @${status.username}`
          : "Not connected",
      });

      console.log("Twitter status:", status);
    } catch (error) {
      console.error("Error checking Twitter status:", error);
      toast({
        title: "Error",
        description: "Failed to check Twitter status",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="bg-slate-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Bug className="h-4 w-4 mr-2 text-slate-500" />
          Twitter Debug Panel
        </CardTitle>
        <CardDescription>
          Tools for debugging Twitter integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-xs text-slate-500">
                {isLoading
                  ? "Checking..."
                  : isConfigured
                    ? `Connected as @${username}`
                    : "Not connected"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkTwitterStatus}
              disabled={isChecking}
            >
              <RefreshCw
                className={`h-3 w-3 mr-2 ${isChecking ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          <div className="pt-2">
            <p className="text-xs text-slate-500 mb-2">
              Environment Variables Status:
            </p>
            <ul className="text-xs space-y-1">
              <li>
                VITE_TWITTER_API_KEY:{" "}
                {import.meta.env.VITE_TWITTER_API_KEY ? "✅" : "❌"}
              </li>
              <li>
                VITE_TWITTER_API_SECRET:{" "}
                {import.meta.env.VITE_TWITTER_API_SECRET ? "✅" : "❌"}
              </li>
              <li>
                VITE_TWITTER_ACCESS_TOKEN:{" "}
                {import.meta.env.VITE_TWITTER_ACCESS_TOKEN ? "✅" : "❌"}
              </li>
              <li>
                VITE_TWITTER_ACCESS_TOKEN_SECRET:{" "}
                {import.meta.env.VITE_TWITTER_ACCESS_TOKEN_SECRET ? "✅" : "❌"}
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
