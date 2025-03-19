import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function TwitterPostTest() {
  const [tweetContent, setTweetContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const postTweet = useMutation(api.twitter.postTweet);
  const twitterStatus = useQuery(api.twitter.getTwitterStatus);
  const serverConfig = useQuery(api.twitterStatus.isConfigured);
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // If we have a connected Twitter account, get the user ID
    if (twitterStatus?.connected) {
      // In a real app, you'd get this from auth
      setUserId("mock-user-id");
    }
  }, [twitterStatus]);

  const handlePostTweet = async () => {
    if (!tweetContent.trim()) {
      toast({
        title: "Error",
        description: "Tweet content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    setResult(null);

    try {
      if (!userId) {
        throw new Error(
          "User ID is not available. Please ensure you're connected to Twitter.",
        );
      }

      // Use the userId from state
      const response = await postTweet({
        content: tweetContent,
        userId: userId,
      });

      setResult({
        success: true,
        message: `Tweet posted successfully! Tweet ID: ${response.tweetId || "mock-tweet-id"}`,
      });
      toast({
        title: "Success",
        description: "Tweet posted successfully!",
        variant: "default",
      });
      setTweetContent("");
    } catch (error) {
      console.error("Error posting tweet:", error);
      setResult({
        success: false,
        message: `Error posting tweet: ${error instanceof Error ? error.message : String(error)}`,
      });
      toast({
        title: "Error",
        description: `Failed to post tweet: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-md bg-white">
      <h3 className="font-medium text-lg">Test Tweet Posting</h3>
      <p className="text-sm text-gray-600">
        Enter a tweet message below and click "Post Tweet" to test if the
        Twitter posting functionality works.
      </p>

      {twitterStatus && !twitterStatus.connected && (
        <Alert
          variant="destructive"
          className="bg-amber-50 text-amber-800 border-amber-200"
        >
          <AlertDescription>
            You need to connect to Twitter before testing the posting
            functionality. Please check your Convex configuration and ensure you
            have the proper credentials set up.
          </AlertDescription>
        </Alert>
      )}

      {/* Force display the tweet form for testing purposes */}
      <div>
        <Textarea
          value={tweetContent}
          onChange={(e) => setTweetContent(e.target.value)}
          placeholder="What's happening?"
          className="min-h-[100px]"
          maxLength={280}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {tweetContent.length}/280 characters
          </span>
          <Button
            onClick={handlePostTweet}
            disabled={isPosting || !tweetContent.trim()}
          >
            {isPosting ? "Posting..." : "Post Test Tweet"}
          </Button>
        </div>

        {result && (
          <div
            className={`mt-4 p-3 rounded-md ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
          >
            <p className="text-sm">{result.message}</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 border rounded-md bg-gray-50">
        <h4 className="font-medium">Debug Information</h4>
        <p className="text-sm text-gray-600 mb-2">
          This section shows the current Twitter integration status from Convex.
        </p>
        <div className="text-xs font-mono bg-gray-100 p-2 rounded">
          <p>
            Twitter Connection Status:{" "}
            {twitterStatus?.connected ? "✅ Connected" : "❌ Not Connected"}
          </p>
          <p>Username: {twitterStatus?.username || "N/A"}</p>
          <p>User ID: {userId || "N/A"}</p>
          <p>
            Server Configuration:{" "}
            {serverConfig?.configured ? "✅ Configured" : "❌ Not Configured"}
          </p>
          {serverConfig?.credentials && (
            <p>
              Server Credentials: API Key{" "}
              {serverConfig.credentials.apiKeyExists ? "✅" : "❌"}, API Secret{" "}
              {serverConfig.credentials.apiSecretExists ? "✅" : "❌"}, Access
              Token {serverConfig.credentials.accessTokenExists ? "✅" : "❌"},
              Access Secret{" "}
              {serverConfig.credentials.accessTokenSecretExists ? "✅" : "❌"}
            </p>
          )}
          <p className="text-amber-600 mt-2">
            {serverConfig?.configured
              ? "Your Twitter API keys are properly configured on the server. The application is using real Twitter API credentials."
              : "The application is using mock Twitter data because the API keys are not configured or not accessible on the server."}
          </p>
        </div>
      </div>
    </div>
  );
}
