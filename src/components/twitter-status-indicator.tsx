import { useTwitterCredentials } from "@/hooks/useTwitterCredentials";
import { Badge } from "@/components/ui/badge";
import { Twitter, AlertCircle, CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * A component that displays the Twitter connection status
 */
export function TwitterStatusIndicator() {
  const { isConfigured, isLoading, username } = useTwitterCredentials();

  if (isLoading) {
    return (
      <Badge variant="outline" className="text-gray-500">
        <Twitter className="h-3 w-3 mr-1" />
        Loading...
      </Badge>
    );
  }

  if (!isConfigured) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="text-red-500 border-red-200 bg-red-50"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              Twitter Not Configured
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Twitter API credentials are not configured.</p>
            <p className="text-xs mt-1">Check your environment variables.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="text-green-600 border-green-200 bg-green-50"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Twitter Connected
            {username && <span className="ml-1">(@{username})</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Twitter API is properly configured.</p>
          {username && <p className="text-xs mt-1">Connected as @{username}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
