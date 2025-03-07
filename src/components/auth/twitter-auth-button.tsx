import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TwitterAuthButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function TwitterAuthButton({
  onSuccess,
  onError,
  className = "",
}: TwitterAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTwitterAuth = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would redirect to Twitter OAuth
      // For demo purposes, we'll simulate a successful auth after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real implementation, this would call the Convex API to connect Twitter
      // For demo purposes, we'll simulate a successful connection

      // Call success callback if provided
      if (onSuccess) onSuccess();

      toast({
        title: "Success",
        description: "Twitter authentication successful",
      });
    } catch (error) {
      console.error("Twitter auth error:", error);

      // Call error callback if provided
      if (onError && error instanceof Error) onError(error);

      toast({
        title: "Authentication Failed",
        description: "Could not authenticate with Twitter",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={`flex items-center ${className}`}
      onClick={handleTwitterAuth}
      disabled={isLoading}
    >
      <Twitter className="h-4 w-4 mr-2 text-blue-500" />
      {isLoading ? "Connecting..." : "Continue with Twitter"}
    </Button>
  );
}
