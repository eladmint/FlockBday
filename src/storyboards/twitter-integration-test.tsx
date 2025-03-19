import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTwitterIntegrationTest } from "@/utils/twitter-integration-test";
import { Twitter, CheckCircle2, XCircle } from "lucide-react";

/**
 * This storyboard demonstrates how to test the Twitter integration with a campaign.
 * It allows users to enter a campaign ID and run a series of tests to verify that
 * Twitter integration is working correctly for that campaign.
 */
export default function TwitterIntegrationTestStoryboard() {
  const [campaignId, setCampaignId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { runTest } = useTwitterIntegrationTest();

  const handleRunTest = async () => {
    if (!campaignId) return;

    setIsLoading(true);
    try {
      const results = await runTest(campaignId);
      setTestResults(results);
    } catch (error) {
      console.error("Error running test:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Twitter Campaign Integration Test
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaignId">Campaign ID</Label>
                <Input
                  id="campaignId"
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  placeholder="Enter campaign ID"
                />
                <p className="text-xs text-gray-500">
                  Enter the ID of the campaign you want to test Twitter
                  integration with.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md text-blue-800">
                <h3 className="font-medium mb-2">What This Test Does</h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>
                    Checks if Twitter credentials are configured in Convex
                  </li>
                  <li>
                    Verifies if Twitter is enabled for the specified campaign
                  </li>
                  <li>
                    Attempts to enable Twitter for the campaign if not already
                    enabled
                  </li>
                  <li>
                    Checks if scheduled posts can be retrieved for the campaign
                  </li>
                </ol>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleRunTest}
                  disabled={isLoading || !campaignId}
                  className="flex items-center"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  {isLoading ? "Running Test..." : "Run Integration Test"}
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
                  <h3 className="font-medium mb-2 flex items-center">
                    {testResults.success ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Test Passed
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 mr-2" />
                        Test Failed
                      </>
                    )}
                  </h3>
                  <p className="text-sm">
                    {testResults.success
                      ? "All Twitter integration tests passed successfully."
                      : testResults.errors[0] ||
                        "Some tests failed. See details below."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Test Details</h3>
                  {testResults.tests.map((test: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md ${test.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                    >
                      <div className="flex items-center">
                        {test.success ? (
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        <span className="font-medium">{test.name}</span>
                      </div>
                      {test.message && (
                        <p className="text-xs mt-1 ml-6">{test.message}</p>
                      )}
                    </div>
                  ))}
                </div>

                {testResults.errors.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-md text-red-800">
                    <h3 className="font-medium mb-2">Errors</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {testResults.errors.map(
                        (error: string, index: number) => (
                          <li key={index}>{error}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Next Steps</h3>
                  {testResults.success ? (
                    <p className="text-sm">
                      Twitter integration is working correctly for this
                      campaign. You can now create and schedule posts with
                      Twitter sharing enabled.
                    </p>
                  ) : (
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>
                        Check if Twitter credentials are configured in Convex
                      </li>
                      <li>Verify that the campaign ID is correct</li>
                      <li>Try enabling Twitter for the campaign manually</li>
                      <li>
                        Check the browser console for more detailed error
                        messages
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Twitter className="h-8 w-8 mb-4 text-gray-400" />
                <p className="mb-2">No test results yet</p>
                <p className="text-sm">Enter a campaign ID and run the test</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
