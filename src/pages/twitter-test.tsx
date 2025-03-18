import { CampaignPageLayout } from "@/components/campaign-page-layout";
import { TwitterTestButton } from "@/components/twitter-test-button";
import { TwitterApiTester } from "@/components/twitter-api-tester";
import { TwitterConnectButton } from "@/components/twitter-connect-button";
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
import { useTwitterIntegration } from "@/hooks/useTwitterIntegration";

export default function TwitterTestPage() {
  const { isConnected, username, profileImageUrl } = useTwitterIntegration();
  const { toast } = useToast();

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
                <CardTitle>Twitter Connection Status</CardTitle>
                <CardDescription>
                  {isConnected
                    ? `Connected as @${username}`
                    : "Not connected to Twitter"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isConnected && (
                    <div className="flex items-center space-x-4">
                      {profileImageUrl && (
                        <img
                          src={profileImageUrl}
                          alt="Twitter Profile"
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium">@{username}</p>
                        <p className="text-sm text-gray-500">
                          Connected to Twitter
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <TwitterConnectButton />
                  </div>

                  <div className="mt-4">
                    <TwitterApiTester />
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
