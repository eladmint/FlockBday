import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { useTwitterTest } from "@/utils/twitter-api-test";
import { useTwitterCredentials } from "@/hooks/useTwitterCredentials";

export default function TwitterTestInstructions() {
  const { runTest } = useTwitterTest();
  const { isConfigured, isConnected, serverConfig } = useTwitterCredentials();

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Twitter API Integration Setup</CardTitle>
        <CardDescription>
          Follow these steps to configure Twitter API credentials in your Convex
          deployment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConfigured && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Twitter API Not Configured</AlertTitle>
            <AlertDescription>
              Your Twitter API credentials are not properly configured in
              Convex.
            </AlertDescription>
          </Alert>
        )}

        {isConfigured && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <Info className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">
              Twitter API Configured
            </AlertTitle>
            <AlertDescription>
              Your Twitter API credentials are properly configured in Convex.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-medium">Configuration Steps:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Create a Twitter Developer Account</strong> - Visit the{" "}
              <a
                href="https://developer.twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Twitter Developer Portal
              </a>
            </li>
            <li>
              <strong>Create a Project and App</strong> - Set up a new project
              and app in the Twitter Developer Portal
            </li>
            <li>
              <strong>Generate API Keys and Tokens</strong> - Create the
              necessary API keys, secrets, and access tokens
            </li>
            <li>
              <strong>Add Environment Variables to Convex</strong> - Add the
              following environment variables to your Convex deployment:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <code>TWITTER_API_KEY</code> - Your Twitter API key
                </li>
                <li>
                  <code>TWITTER_API_SECRET</code> - Your Twitter API secret
                </li>
                <li>
                  <code>TWITTER_ACCESS_TOKEN</code> - Your Twitter access token
                </li>
                <li>
                  <code>TWITTER_ACCESS_TOKEN_SECRET</code> - Your Twitter access
                  token secret
                </li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-md font-medium mb-2">
            Current Configuration Status:
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>API Key:</div>
            <div>
              {serverConfig?.credentials?.apiKeyExists
                ? "✅ Configured"
                : "❌ Missing"}
            </div>
            <div>API Secret:</div>
            <div>
              {serverConfig?.credentials?.apiSecretExists
                ? "✅ Configured"
                : "❌ Missing"}
            </div>
            <div>Access Token:</div>
            <div>
              {serverConfig?.credentials?.accessTokenExists
                ? "✅ Configured"
                : "❌ Missing"}
            </div>
            <div>Access Token Secret:</div>
            <div>
              {serverConfig?.credentials?.accessTokenSecretExists
                ? "✅ Configured"
                : "❌ Missing"}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Status
        </Button>
        <Button onClick={runTest}>Run Twitter API Test</Button>
      </CardFooter>
    </Card>
  );
}
