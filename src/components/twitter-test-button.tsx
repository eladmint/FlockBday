import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";
import { useState } from "react";
import { useTwitterTest } from "@/utils/twitter-api-test";

/**
 * A button component that tests the Twitter API integration
 * and displays the result.
 */
export function TwitterTestButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { runTest } = useTwitterTest();

  const handleTest = async () => {
    setIsLoading(true);
    try {
      console.log("Starting Twitter integration test...");
      await runTest();
      console.log("Twitter integration test completed.");
    } catch (error) {
      console.error("Twitter integration test failed:", error);
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
      {isLoading ? "Testing..." : "Test Twitter Integration"}
    </Button>
  );
}
