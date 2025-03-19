import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTwitterCredentials } from "@/hooks/useTwitterCredentials";
import { Twitter, Bug, RefreshCw, Server, Laptop } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";

/**
 * A debug panel for Twitter integration
 * This component is useful during development and testing
 */
export function TwitterDebugPanel() {
  const { isConfigured, isLoading, username, serverConfig } =
    useTwitterCredentials();
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  const twitterStatus = useQuery(api.twitter.getTwitterStatus) || {
    connected: false,
  };

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
        <div className="space-y-6">
          {/* Server-side configuration */}
          <div>
            <h3 className="text-md font-medium flex items-center mb-2">
              <Server className="h-4 w-4 mr-2" /> Server-side Configuration
            </h3>
            {serverConfig ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>VITE_TWITTER_API_KEY</span>
                  <Badge
                    variant={
                      serverConfig.credentials?.apiKeyExists
                        ? "default"
                        : "destructive"
                    }
                    className="ml-2"
                  >
                    {serverConfig.credentials?.apiKeyExists
                      ? "Configured"
                      : "Missing"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span>VITE_TWITTER_API_SECRET</span>
                  <Badge
                    variant={
                      serverConfig.credentials?.apiSecretExists
                        ? "default"
                        : "destructive"
                    }
                    className="ml-2"
                  >
                    {serverConfig.credentials?.apiSecretExists
                      ? "Configured"
                      : "Missing"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span>VITE_TWITTER_ACCESS_TOKEN</span>
                  <Badge
                    variant={
                      serverConfig.credentials?.accessTokenExists
                        ? "default"
                        : "destructive"
                    }
                    className="ml-2"
                  >
                    {serverConfig.credentials?.accessTokenExists
                      ? "Configured"
                      : "Missing"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span>VITE_TWITTER_ACCESS_TOKEN_SECRET</span>
                  <Badge
                    variant={
                      serverConfig.credentials?.accessTokenSecretExists
                        ? "default"
                        : "destructive"
                    }
                    className="ml-2"
                  >
                    {serverConfig.credentials?.accessTokenSecretExists
                      ? "Configured"
                      : "Missing"}
                  </Badge>
                </div>

                <div className="mt-2">
                  <Badge
                    variant={serverConfig.configured ? "outline" : "outline"}
                    className="bg-green-100 text-green-800"
                  >
                    {serverConfig.configured
                      ? "Twitter API Configured on Server"
                      : "Using Mock Implementation"}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Loading server configuration...
              </div>
            )}
          </div>

          {/* Client-side configuration */}
          <div>
            <h3 className="text-md font-medium flex items-center mb-2">
              <Laptop className="h-4 w-4 mr-2" /> Client-side Status
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Twitter Connection Status</span>
                <Badge
                  variant={twitterStatus.connected ? "outline" : "outline"}
                  className={
                    twitterStatus.connected ? "bg-blue-100 text-blue-800" : ""
                  }
                >
                  {twitterStatus.connected ? "Connected" : "Not Connected"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span>Twitter Username</span>
                <span className="text-sm font-medium">
                  {twitterStatus.username || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 p-3 bg-gray-50 rounded-md border">
            <p className="font-medium mb-1">Important Notes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Environment variables in Convex are only accessible on the
                server side, not in client code.
              </li>
              <li>
                The application will use the server-side configuration for
                actual Twitter API calls.
              </li>
              <li>
                If server-side credentials are missing, the application will
                fall back to using mock data.
              </li>
              <li>
                The "false" values you're seeing in client-side checks are
                expected - client code cannot access server environment
                variables.
              </li>
            </ul>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={checkTwitterStatus}
              disabled={isChecking}
            >
              <RefreshCw
                className={`h-3 w-3 mr-2 ${isChecking ? "animate-spin" : ""}`}
              />
              Refresh Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
