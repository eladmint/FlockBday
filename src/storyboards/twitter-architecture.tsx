import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * This component visualizes the Twitter integration architecture for documentation purposes.
 * It shows the relationship between different components and services.
 */
export default function TwitterArchitecture() {
  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6">
        Twitter Integration Architecture
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Frontend Layer */}
        <Card className="md:col-span-3">
          <CardHeader className="bg-blue-50">
            <CardTitle>Frontend Layer</CardTitle>
            <CardDescription>
              React components and hooks that provide the user interface for
              Twitter integration
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-blue-700">
                  UI Components
                </h3>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• TwitterConnect</li>
                  <li>• TwitterConnectButton</li>
                  <li>• TwitterPostForm</li>
                  <li>• TwitterPost</li>
                  <li>• TwitterStatusIndicator</li>
                  <li>• TwitterIntegrationInfo</li>
                  <li>• TwitterTestButton</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-blue-700">
                  React Hooks
                </h3>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• useTwitterService</li>
                  <li>• useTwitterIntegration</li>
                  <li>• useTwitterCredentials</li>
                  <li>• useCampaignDetail</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-blue-700">
                  Utilities
                </h3>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• Error Boundaries</li>
                  <li>• Error Logging</li>
                  <li>• Twitter Error Handler</li>
                  <li>• Integration Tests</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Layer */}
        <Card className="md:col-span-3">
          <CardHeader className="bg-green-50">
            <CardTitle>Service Layer</CardTitle>
            <CardDescription>
              Browser-safe services that handle Twitter API interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-green-700">
                  TwitterService
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Singleton service that provides a unified interface for all
                  Twitter operations.
                </p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• publishPost()</li>
                  <li>• schedulePost()</li>
                  <li>• cancelScheduledPost()</li>
                  <li>• verifyAuthentication()</li>
                  <li>• getUserProfile()</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-green-700">
                  Twitter API Client
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Browser-safe implementation that redirects API calls to Convex
                  backend.
                </p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• twitter-api-browser.ts</li>
                  <li>• createTwitterClient()</li>
                  <li>• TwitterApiBrowser class</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-green-700">
                  Mock Implementation
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Mock Twitter API client for development and testing.
                </p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• mock-twitter-service.ts</li>
                  <li>• MockTwitterApi class</li>
                  <li>• Simulated responses</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backend Layer */}
        <Card className="md:col-span-3">
          <CardHeader className="bg-purple-50">
            <CardTitle>Backend Layer (Convex)</CardTitle>
            <CardDescription>
              Server-side functions that interact with the Twitter API
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-purple-700">
                  Mutations
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Functions that modify Twitter integration data.
                </p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• connectTwitterAccount</li>
                  <li>• disconnectTwitterAccount</li>
                  <li>• enableTwitterForCampaign</li>
                  <li>• disableTwitterForCampaign</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-purple-700">
                  Queries
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Functions that retrieve Twitter integration data.
                </p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• getTwitterStatus</li>
                  <li>• getCampaignTwitterStatus</li>
                  <li>• getTwitterIntegrationInternal</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-purple-700">
                  Actions
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Server-side functions that call the Twitter API.
                </p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• publishTweet</li>
                  <li>• verifyTwitterCredentials</li>
                  <li>• getTweetDetails</li>
                  <li>• getUserByUsername</li>
                  <li>• publishPostTweet</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-purple-700">
                  Scheduled Jobs
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Background processes that handle scheduled posts.
                </p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• processScheduledJobs</li>
                  <li>• Job queue management</li>
                  <li>• Error handling and retries</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Model */}
        <Card className="md:col-span-3">
          <CardHeader className="bg-yellow-50">
            <CardTitle>Data Model</CardTitle>
            <CardDescription>
              Database schema for Twitter integration
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-yellow-700">
                  twitterIntegrations
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Stores Twitter connection information.
                </p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• userId: string</li>
                  <li>• campaignId?: Id</li>
                  <li>• accessToken: string</li>
                  <li>• accessTokenSecret: string</li>
                  <li>• username: string</li>
                  <li>• profileImageUrl?: string</li>
                  <li>• status: string</li>
                  <li>• connectedAt: number</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-yellow-700">
                  campaignPosts
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Stores post data including Twitter-specific fields.
                </p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• campaignId: Id</li>
                  <li>• title: string</li>
                  <li>• content: string</li>
                  <li>• imageUrl?: string</li>
                  <li>• status: string</li>
                  <li>• scheduledFor?: number</li>
                  <li>• sharedOnTwitter: boolean</li>
                  <li>• twitterPostId?: string</li>
                  <li>• twitterStats?: object</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-yellow-700">
                  scheduledJobs
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Stores information about scheduled Twitter posts.
                </p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• type: string</li>
                  <li>• status: string</li>
                  <li>• scheduledFor: number</li>
                  <li>• data: object</li>
                  <li>• createdAt: number</li>
                  <li>• processedAt?: number</li>
                  <li>• result?: object</li>
                  <li>• error?: string</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* External Integration */}
        <Card className="md:col-span-3">
          <CardHeader className="bg-red-50">
            <CardTitle>External Integration</CardTitle>
            <CardDescription>Integration with Twitter API</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-red-700">
                  Twitter API v2
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Server-side integration with Twitter API v2 endpoints.
                </p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• tweet() - Post new tweets</li>
                  <li>• me() - Get authenticated user</li>
                  <li>• singleTweet() - Get tweet details</li>
                  <li>• userByUsername() - Get user profile</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-sm mb-2 text-red-700">
                  Environment Configuration
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Environment variables for Twitter API credentials.
                </p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• VITE_TWITTER_API_KEY</li>
                  <li>• VITE_TWITTER_API_SECRET</li>
                  <li>• VITE_TWITTER_ACCESS_TOKEN</li>
                  <li>• VITE_TWITTER_ACCESS_TOKEN_SECRET</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
