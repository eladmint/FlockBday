import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";
import { useState } from "react";
import { useTwitterTest } from "@/utils/twitter-api-test";
import { useTwitterIntegrationTest } from "@/utils/twitter-integration-test";
import { useToast } from "@/components/ui/use-toast";

interface TwitterTestButtonProps {
  campaignId?: string;
}

/**
 * A button component that tests the Twitter API integration
 * and displays the result.
 */
export function TwitterTestButton({ campaignId }: TwitterTestButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { runTest: runApiTest } = useTwitterTest();
  const { runTest: runIntegrationTest } = useTwitterIntegrationTest();
  const { toast } = useToast();

  const handleTest = async () => {
    setIsLoading(true);
    try {
      console.log("Starting Twitter integration test...");

      // If campaignId is provided, run the full integration test
      if (campaignId) {
        toast({
          title: "Running Twitter Integration Test",
          description:
            "Testing Twitter integration with campaign. Check console for details.",
        });

        const results = await runIntegrationTest(campaignId);

        if (results.success) {
          toast({
            title: "Twitter Integration Test Passed",
            description:
              "All tests completed successfully. Check console for details.",
          });
        } else {
          toast({
            title: "Twitter Integration Test Failed",
            description:
              results.errors[0] ||
              "Some tests failed. Check console for details.",
            variant: "destructive",
          });
        }
      } else {
        // Otherwise run the basic API test
        toast({
          title: "Running Twitter API Test",
          description:
            "Testing Twitter API connection. Check console for details.",
        });

        await runApiTest();

        toast({
          title: "Twitter API Test Completed",
          description: "Check console for test results.",
        });
      }

      console.log("Twitter integration test completed.");
    } catch (error) {
      console.error("Twitter integration test failed:", error);
      toast({
        title: "Test Failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="text-blue-600 border-blue-600 hover:bg-blue-50"
      onClick={handleTest}
      disabled={isLoading}
    >
      <Twitter className="h-4 w-4 mr-2" />
      {isLoading
        ? "Testing..."
        : campaignId
          ? "Test Campaign Integration"
          : "Test Twitter API"}
    </Button>
  );
}
