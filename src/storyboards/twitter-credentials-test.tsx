import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TwitterStatusIndicator } from "@/components/twitter-status-indicator";
import { useTwitterCredentials } from "@/hooks/useTwitterCredentials";
import { useTwitterTest } from "@/utils/twitter-api-test";

/**
 * This storyboard demonstrates how the Twitter API credentials are checked
 * and how the Twitter API integration is tested.
 *
 * It shows the flow of checking credentials from the client to the server
 * and how the application handles different credential states.
 */
export default function TwitterCredentialsTest() {
  const { isConfigured, isConnected, serverConfig } = useTwitterCredentials();
  const { runTest } = useTwitterTest();
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunTest = async () => {
    setIsLoading(true);
    try {
      const result = await runTest();
      setTestResults({
        success: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Twitter Credentials Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Twitter Credentials Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <TwitterStatusIndicator />
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium mb-2">Client-Side Status</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="font-medium">Credentials Configured:</span>{" "}
                    {isConfigured ? "✅ Yes" : "❌ No"}
                  </li>
                  <li>
                    <span className="font-medium">Twitter Connected:</span>{" "}
                    {isConnected ? "✅ Yes" : "❌ No"}
                  </li>
                </ul>
              </div>

              {serverConfig && (
                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Server-Side Status</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <span className="font-medium">API Key:</span>{" "}
                      {serverConfig.credentials?.apiKeyExists ? "✅" : "❌"}
                    </li>
                    <li>
                      <span className="font-medium">API Secret:</span>{" "}
                      {serverConfig.credentials?.apiSecretExists ? "✅" : "❌"}
                    </li>
                    <li>
                      <span className="font-medium">Access Token:</span>{" "}
                      {serverConfig.credentials?.accessTokenExists
                        ? "✅"
                        : "❌"}
                    </li>
                    <li>
                      <span className="font-medium">Access Token Secret:</span>{" "}
                      {serverConfig.credentials?.accessTokenSecretExists
                        ? "✅"
                        : "❌"}
                    </li>
                    <li>
                      <span className="font-medium">Environment:</span>{" "}
                      {serverConfig.environment}
                    </li>
                  </ul>
                </div>
              )}

              <div className="flex justify-center">
                <Button onClick={handleRunTest} disabled={isLoading}>
                  {isLoading ? "Running Test..." : "Run Credentials Test"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {testResults ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-md ${testResults.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  <h3 className="font-medium mb-2">
                    {testResults.success ? "✅ Test Passed" : "❌ Test Failed"}
                  </h3>
                  <p className="text-sm">
                    {testResults.success
                      ? "Twitter API credentials are properly configured and working."
                      : testResults.error ||
                        "Twitter API credentials are not properly configured."}
                  </p>
                  <p className="text-xs mt-2">
                    Tested at: {testResults.timestamp}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-medium mb-2">How It Works</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>
                      The test first checks if Twitter credentials are
                      configured on the server using the{" "}
                      <code>isConfigured</code> query.
                    </li>
                    <li>
                      It then checks if the user has connected their Twitter
                      account using the <code>getTwitterStatus</code> query.
                    </li>
                    <li>
                      If credentials are configured, it attempts to retrieve the
                      user's Twitter profile.
                    </li>
                    <li>
                      The test succeeds if all steps complete successfully, even
                      if using mock data.
                    </li>
                  </ol>
                </div>

                <div className="bg-blue-50 p-4 rounded-md text-blue-800">
                  <h3 className="font-medium mb-2">Important Notes</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      The client-side environment variables will always show as
                      "false" because they are not accessible in the browser.
                    </li>
                    <li>
                      The application relies on server-side checks to determine
                      if Twitter is configured.
                    </li>
                    <li>
                      If server-side credentials are missing, the application
                      will fall back to using mock data.
                    </li>
                    <li>
                      To use real Twitter API credentials, they must be
                      configured in the Convex environment variables.
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="mb-4">No test results yet</p>
                <p className="text-sm">Run the test to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
