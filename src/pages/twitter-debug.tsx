import { CampaignPageLayout } from "@/components/campaign-page-layout";
import { TwitterDebugPanel } from "@/components/twitter-debug-panel";
import { TwitterPostTest } from "@/components/twitter-post-test";
import { TwitterTestButton } from "@/components/twitter-test-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function TwitterDebugPage() {
  // Get server-side configuration status
  const serverConfig = useQuery(api.twitterStatus.isConfigured);
  const twitterStatus = useQuery(api.twitter.getTwitterStatus) || {
    connected: false,
  };

  return (
    <CampaignPageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Twitter API Debug Dashboard</h1>

        <Tabs defaultValue="config">
          <TabsList className="mb-4">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="test">Test Integration</TabsTrigger>
            <TabsTrigger value="post">Test Posting</TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <TwitterDebugPanel />

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Environment Variables Explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">
                      Why API Keys Show as "false"
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Even though you've configured the Twitter API keys in your
                      Convex environment variables, they show as "false" in
                      client-side code because:
                    </p>
                    <ul className="list-disc pl-5 text-sm text-gray-600 mt-2 space-y-1">
                      <li>
                        <strong>Server vs. Client:</strong> Environment
                        variables set in Convex are only accessible on the
                        server side (in Convex functions), not in your
                        client-side code.
                      </li>
                      <li>
                        <strong>Security Feature:</strong> This is by design for
                        security reasons - sensitive API keys should not be
                        exposed to the client.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium">How It Works</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      The correct flow for using Twitter API keys is:
                    </p>
                    <ol className="list-decimal pl-5 text-sm text-gray-600 mt-2 space-y-1">
                      <li>
                        Store API keys in Convex environment variables (as
                        you've done)
                      </li>
                      <li>
                        Access these keys only in server-side Convex functions
                      </li>
                      <li>
                        Create server-side actions that make the actual Twitter
                        API calls
                      </li>
                      <li>Call these actions from your client code</li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <h3 className="font-medium text-blue-800">
                      Current Status
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Server-side configuration:{" "}
                      {serverConfig?.configured
                        ? "✅ Configured"
                        : "❌ Not Configured"}
                      <br />
                      Twitter connection status:{" "}
                      {twitterStatus?.connected
                        ? "✅ Connected"
                        : "❌ Not Connected"}
                    </p>
                    <p className="text-sm text-blue-700 mt-2">
                      {serverConfig?.configured
                        ? "Your Twitter API keys are properly configured on the server. You can use the real Twitter API."
                        : "Your application is using mock Twitter data because the API keys are not configured or not accessible on the server."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Test Twitter Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Click the button below to run a series of tests on your
                    Twitter API integration. This will check if your credentials
                    are configured correctly and if the API is accessible.
                  </p>

                  <div className="flex justify-center">
                    <TwitterTestButton />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="post">
            <Card>
              <CardHeader>
                <CardTitle>Test Tweet Posting</CardTitle>
              </CardHeader>
              <CardContent>
                <TwitterPostTest />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CampaignPageLayout>
  );
}
