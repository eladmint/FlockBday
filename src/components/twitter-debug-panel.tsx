import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTwitterCredentials } from "@/hooks/useTwitterCredentials";
import {
  Twitter,
  Bug,
  RefreshCw,
  Server,
  Laptop,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "convex/react";

/**
 * A debug panel for Twitter integration
 * This component is useful during development and testing
 * It relies on server-side status checks rather than client-side environment variables
 */
export function TwitterDebugPanel() {
  const { isConfigured, isConnected, isLoading, username, serverConfig } =
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
      const serverStatus = await api.twitterStatus.isConfigured.query();

      toast({
        title: "Twitter Status Updated",
        description: `Server config: ${serverStatus.configured ? "✅" : "❌"}, Account connected: ${status.connected ? "✅" : "❌"}${status.username ? ` as @${status.username}` : ""}`,
      });

      console.log("Twitter status:", status);
      console.log("Server configuration:", serverStatus);
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
          {/* Status summary */}
          <div className="p-4 rounded-md border border-blue-200 bg-blue-50">
            <h3 className="text-md font-medium flex items-center mb-3">
              <CheckCircle2 className="h-4 w-4 mr-2 text-blue-600" /> Status
              Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-slate-600" />
                <span>Server Configuration:</span>
                <Badge
                  variant={isConfigured ? "outline" : "outline"}
                  className={
                    isConfigured
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {isConfigured ? "Configured" : "Not Configured"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Twitter className="h-4 w-4 text-blue-500" />
                <span>Account Connection:</span>
                <Badge
                  variant={isConnected ? "outline" : "outline"}
                  className={
                    isConnected
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }
                >
                  {isConnected ? "Connected" : "Not Connected"}
                </Badge>
              </div>
            </div>
          </div>

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
                    className={
                      serverConfig.configured
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }
                  >
                    {serverConfig.configured
                      ? "Twitter API Configured on Server"
                      : "Using Mock Implementation"}
                  </Badge>
                  {serverConfig.environment && (
                    <Badge variant="outline" className="ml-2">
                      Environment: {serverConfig.environment}
                    </Badge>
                  )}
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

          <div className="mt-4 text-sm text-gray-500 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="font-medium mb-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-blue-600" />
              Important Notes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Environment variables in Convex are only accessible on the
                server side, not in client code.
              </li>
              <li>
                <strong>
                  The client now relies on server-side status checks
                </strong>{" "}
                to determine if Twitter is configured.
              </li>
              <li>
                If server-side credentials are missing, the application will
                fall back to using mock data.
              </li>
              <li>
                The "false" values you might see in client-side environment
                checks are expected - client code cannot access server
                environment variables.
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
