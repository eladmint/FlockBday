import { CampaignPageLayout } from "@/components/campaign-page-layout";
import { TwitterTestButton } from "@/components/twitter-test-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TwitterService } from "@/services/twitter-service";
import { useToast } from "@/components/ui/use-toast";

export default function TwitterTestPage() {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accessTokenSecret, setAccessTokenSecret] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveCredentials = () => {
    setIsSaving(true);
    try {
      const twitterService = TwitterService.getInstance();
      twitterService.setCredentials({
        apiKey,
        apiSecret,
        accessToken,
        accessTokenSecret,
      });

      toast({
        title: "Credentials Saved",
        description:
          "Twitter API credentials have been saved for this session.",
      });

      // Clear the form for security
      setApiKey("");
      setApiSecret("");
      setAccessToken("");
      setAccessTokenSecret("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save credentials.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CampaignPageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Twitter API Integration Test
        </h1>

        <Tabs defaultValue="test">
          <TabsList className="mb-4">
            <TabsTrigger value="test">Run Tests</TabsTrigger>
            <TabsTrigger value="credentials">Configure Credentials</TabsTrigger>
            <TabsTrigger value="info">Integration Info</TabsTrigger>
          </TabsList>

          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Test Twitter Integration</CardTitle>
                <CardDescription>
                  Run tests to verify your Twitter API integration is working
                  correctly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Click the button below to run a series of tests on your
                    Twitter API integration. The tests will check if your
                    credentials are configured correctly and if the API is
                    accessible. Results will be displayed in the browser
                    console.
                  </p>

                  <div className="flex justify-center">
                    <TwitterTestButton />
                  </div>

                  <div className="bg-gray-100 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Test Results</h3>
                    <p className="text-sm text-gray-600">
                      Open your browser console (F12 or Cmd+Option+I) to view
                      detailed test results.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credentials">
            <Card>
              <CardHeader>
                <CardTitle>Configure Twitter API Credentials</CardTitle>
                <CardDescription>
                  Enter your Twitter API credentials to test the integration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    These credentials will only be stored in memory for the
                    current session and will not be saved permanently. For
                    production use, you should set these as environment
                    variables.
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input
                        id="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Twitter API key"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apiSecret">API Secret</Label>
                      <Input
                        id="apiSecret"
                        type="password"
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                        placeholder="Enter your Twitter API secret"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accessToken">Access Token</Label>
                      <Input
                        id="accessToken"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        placeholder="Enter your Twitter access token"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accessTokenSecret">
                        Access Token Secret
                      </Label>
                      <Input
                        id="accessTokenSecret"
                        type="password"
                        value={accessTokenSecret}
                        onChange={(e) => setAccessTokenSecret(e.target.value)}
                        placeholder="Enter your Twitter access token secret"
                      />
                    </div>

                    <Button
                      onClick={handleSaveCredentials}
                      disabled={
                        isSaving ||
                        !apiKey ||
                        !apiSecret ||
                        !accessToken ||
                        !accessTokenSecret
                      }
                    >
                      {isSaving ? "Saving..." : "Save Credentials"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Twitter API Integration Information</CardTitle>
                <CardDescription>
                  Learn about the Twitter API integration and alternatives.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">
                      Direct Twitter API Integration
                    </h3>
                    <p className="text-sm text-gray-600">
                      The current implementation attempts to use Twitter's API
                      directly. This requires valid API credentials from the
                      Twitter Developer Portal. Twitter has strict rate limits
                      and requires a developer account with approved access.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">
                      Alternative: Third-Party Services
                    </h3>
                    <p className="text-sm text-gray-600">
                      Consider using third-party services like SocialBee,
                      Buffer, or Make.com to handle Twitter posting. These
                      services provide reliable APIs, scheduling capabilities,
                      and often include content review features.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Environment Variables</h3>
                    <p className="text-sm text-gray-600">
                      For production use, set the following environment
                      variables:
                    </p>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      <li>VITE_TWITTER_API_KEY</li>
                      <li>VITE_TWITTER_API_SECRET</li>
                      <li>VITE_TWITTER_ACCESS_TOKEN</li>
                      <li>VITE_TWITTER_ACCESS_TOKEN_SECRET</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CampaignPageLayout>
  );
}
