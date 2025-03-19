import React from "react";
import { TwitterDebugPanel } from "@/components/twitter-debug-panel";
import { TwitterStatusIndicator } from "@/components/twitter-status-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, Laptop, RefreshCw } from "lucide-react";

/**
 * This storyboard demonstrates how the client-side code relies on server-side status checks
 * for Twitter API configuration rather than directly accessing environment variables.
 */
export default function TwitterServerStatusCheck() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Twitter Server Status Check</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            <RefreshCw className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="server">
            <Server className="h-4 w-4 mr-2" />
            Server-side
          </TabsTrigger>
          <TabsTrigger value="client">
            <Laptop className="h-4 w-4 mr-2" />
            Client-side
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Twitter Integration Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  This application uses a server-side approach to Twitter API
                  integration. The client-side code relies on server-side status
                  checks to determine if Twitter is configured, rather than
                  directly accessing environment variables.
                </p>

                <div className="flex items-center justify-center my-4">
                  <TwitterStatusIndicator />
                </div>

                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <h3 className="font-medium mb-2">How It Works</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>
                      <strong>Server-side Configuration:</strong> Twitter API
                      credentials are stored as environment variables in Convex.
                    </li>
                    <li>
                      <strong>Status Check API:</strong> Convex provides a query
                      endpoint that checks if these credentials are configured.
                    </li>
                    <li>
                      <strong>Client-side Hook:</strong> The{" "}
                      <code>useTwitterCredentials</code> hook fetches this
                      status from the server.
                    </li>
                    <li>
                      <strong>UI Components:</strong> Components like{" "}
                      <code>TwitterStatusIndicator</code> use this hook to
                      display the correct status.
                    </li>
                  </ol>
                </div>

                <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                  <h3 className="font-medium mb-2">Security Benefits</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>API credentials are never exposed to the client</li>
                    <li>All Twitter API calls happen server-side</li>
                    <li>
                      Consistent behavior across development and production
                    </li>
                    <li>
                      Graceful fallback to mock implementation when needed
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server">
          <Card>
            <CardHeader>
              <CardTitle>Server-side Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  The server-side implementation includes Convex queries that
                  check if Twitter API credentials are configured.
                </p>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Key Files</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm font-mono">
                    <li>convex/twitter-status.ts</li>
                    <li>convex/twitter-config.ts</li>
                    <li>convex/twitter.ts</li>
                  </ul>
                </div>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-medium mb-2">
                    Example: isConfigured Query
                  </h3>
                  <pre className="text-xs overflow-auto p-2 bg-gray-800 text-gray-100 rounded">
                    {`export const isConfigured = query({
  args: {},
  handler: async (ctx) => {
    try {
      // Check if Twitter API credentials are configured
      const TWITTER_API_KEY = process.env.VITE_TWITTER_API_KEY;
      const TWITTER_API_SECRET = process.env.VITE_TWITTER_API_SECRET;
      // ...

      const configured = !!(
        TWITTER_API_KEY &&
        TWITTER_API_SECRET &&
        // ...
      );

      return {
        configured,
        environment: process.env.NODE_ENV || "unknown",
        credentials: {
          apiKeyExists: !!TWITTER_API_KEY,
          // ...
        },
      };
    } catch (error) {
      return {
        configured: false,
        error: String(error),
      };
    }
  },
});`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="client">
          <Card>
            <CardHeader>
              <CardTitle>Client-side Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  The client-side implementation uses hooks and components that
                  rely on server-side status checks.
                </p>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Key Files</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm font-mono">
                    <li>src/hooks/useTwitterCredentials.ts</li>
                    <li>src/components/twitter-status-indicator.tsx</li>
                    <li>src/components/twitter-debug-panel.tsx</li>
                  </ul>
                </div>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-medium mb-2">
                    Example: useTwitterCredentials Hook
                  </h3>
                  <pre className="text-xs overflow-auto p-2 bg-gray-800 text-gray-100 rounded">
                    {`export function useTwitterCredentials() {
  // Query Twitter status from Convex
  const twitterStatus = useQuery(api.twitter.getTwitterStatus);
  const serverConfig = useQuery(api.twitterStatus.isConfigured);

  // ...

  // IMPORTANT: Rely primarily on the server-side configuration check
  const isServerConfigured = serverConfig?.configured || false;

  return {
    // Prioritize server-side configuration status
    isConfigured: isServerConfigured,
    // ...
  };
}`}
                  </pre>
                </div>

                <TwitterDebugPanel />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
