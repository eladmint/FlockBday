import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { TwitterService } from "@/services/twitter-service";
import { AlertCircle, CheckCircle, Twitter } from "lucide-react";

export function TwitterApiTester() {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accessTokenSecret, setAccessTokenSecret] = useState("");
  const [tweetContent, setTweetContent] = useState("");
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"credentials" | "verify" | "tweet">(
    "credentials",
  );
  const { toast } = useToast();

  const handleSaveCredentials = () => {
    if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
      toast({
        title: "Error",
        description: "All credential fields are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
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

      setStep("verify");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCredentials = async () => {
    setIsLoading(true);
    setTestResults(null);
    try {
      // Use Convex directly instead of the TwitterService
      const { api } = await import("../../convex/_generated/api");
      const verifyResult = await api.twitter.verifyTwitterCredentials.call({
        accessToken,
        accessTokenSecret,
      });

      if (verifyResult.valid) {
        // Use the profile data from the verification result
        const profile = {
          username: verifyResult.username,
          name: verifyResult.name,
          profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${verifyResult.userId}`,
        };

        setTestResults({
          success: true,
          message: "Twitter credentials verified successfully!",
          profile,
        });

        toast({
          title: "Success",
          description: `Connected as @${profile.username}`,
        });

        setStep("tweet");
      } else {
        setTestResults({
          success: false,
          message:
            "Failed to verify Twitter credentials. Please check your API keys and tokens.",
        });

        toast({
          title: "Verification Failed",
          description: "Could not verify Twitter credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      setTestResults({
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        error,
      });

      toast({
        title: "Error",
        description: "An error occurred during verification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestTweet = async () => {
    if (!tweetContent.trim()) {
      toast({
        title: "Error",
        description: "Tweet content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTestResults(null);
    try {
      // Use Convex directly instead of the TwitterService
      const { api } = await import("../../convex/_generated/api");
      const result = await api.twitter.postTweet.call({
        content: tweetContent,
        userId: "test-user",
        accessToken,
        accessTokenSecret,
      });

      setTestResults({
        success: result.success,
        message: result.success ? "Tweet posted successfully!" : result.error,
        tweet: result.success
          ? { text: result.text, id: result.tweetId }
          : null,
      });

      toast({
        title: "Success",
        description: "Test tweet posted successfully",
      });

      // Reset tweet content
      setTweetContent("");
    } catch (error) {
      setTestResults({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to post tweet",
        error,
      });

      toast({
        title: "Error",
        description: "Failed to post test tweet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Twitter className="h-5 w-5 text-blue-500 mr-2" />
          Twitter API Integration Tester
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === "credentials" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Enter your Twitter API credentials to test the integration. These
              will only be stored in memory for this session.
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
                <Label htmlFor="accessTokenSecret">Access Token Secret</Label>
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
                  isLoading ||
                  !apiKey ||
                  !apiSecret ||
                  !accessToken ||
                  !accessTokenSecret
                }
              >
                {isLoading ? "Saving..." : "Save Credentials & Continue"}
              </Button>
            </div>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Now let's verify your Twitter credentials by making an API call.
            </p>

            <Button
              onClick={verifyCredentials}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Verifying..." : "Verify Credentials"}
            </Button>

            {testResults && (
              <div
                className={`mt-4 p-4 rounded-md ${testResults.success ? "bg-green-50" : "bg-red-50"}`}
              >
                <div className="flex items-start">
                  {testResults.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${testResults.success ? "text-green-800" : "text-red-800"}`}
                    >
                      {testResults.success ? "Success" : "Error"}
                    </p>
                    <p
                      className={`text-sm ${testResults.success ? "text-green-700" : "text-red-700"}`}
                    >
                      {testResults.message}
                    </p>
                    {testResults.success && testResults.profile && (
                      <div className="mt-2 p-2 bg-white rounded border border-green-200">
                        <p className="text-sm font-medium">Connected as:</p>
                        <div className="flex items-center mt-1">
                          {testResults.profile.profile_image_url && (
                            <img
                              src={testResults.profile.profile_image_url}
                              alt="Profile"
                              className="h-8 w-8 rounded-full mr-2"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium">
                              {testResults.profile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              @{testResults.profile.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setStep("credentials")}
                disabled={isLoading}
              >
                Back to Credentials
              </Button>

              {testResults?.success && (
                <Button onClick={() => setStep("tweet")} disabled={isLoading}>
                  Continue to Test Tweet
                </Button>
              )}
            </div>
          </div>
        )}

        {step === "tweet" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Now let's post a test tweet to verify the full integration.
            </p>

            <div className="space-y-2">
              <Label htmlFor="tweetContent">Tweet Content</Label>
              <Textarea
                id="tweetContent"
                value={tweetContent}
                onChange={(e) => setTweetContent(e.target.value)}
                placeholder="What's happening?"
                rows={3}
              />
              <div className="text-xs text-right text-gray-500">
                {tweetContent.length}/280 characters
              </div>
            </div>

            <Button
              onClick={sendTestTweet}
              disabled={
                isLoading ||
                tweetContent.length === 0 ||
                tweetContent.length > 280
              }
              className="w-full"
            >
              {isLoading ? "Posting..." : "Post Test Tweet"}
            </Button>

            {testResults && (
              <div
                className={`mt-4 p-4 rounded-md ${testResults.success ? "bg-green-50" : "bg-red-50"}`}
              >
                <div className="flex items-start">
                  {testResults.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${testResults.success ? "text-green-800" : "text-red-800"}`}
                    >
                      {testResults.success ? "Success" : "Error"}
                    </p>
                    <p
                      className={`text-sm ${testResults.success ? "text-green-700" : "text-red-700"}`}
                    >
                      {testResults.message}
                    </p>
                    {testResults.success && testResults.tweet && (
                      <div className="mt-2 p-2 bg-white rounded border border-green-200">
                        <p className="text-sm font-medium">Tweet posted:</p>
                        <p className="text-sm mt-1">{testResults.tweet.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Tweet ID: {testResults.tweet.id}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setStep("verify")}
                disabled={isLoading}
              >
                Back to Verification
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
