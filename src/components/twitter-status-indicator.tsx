import { useTwitterCredentials } from "@/hooks/useTwitterCredentials";
import { Badge } from "@/components/ui/badge";
import { Twitter, AlertCircle, CheckCircle, Server } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * A component that displays the Twitter connection status
 * This component relies on server-side status checks rather than client-side environment variables
 */
export function TwitterStatusIndicator() {
  const { isConfigured, isConnected, isLoading, username, serverConfig } =
    useTwitterCredentials();

  if (isLoading) {
    return (
      <Badge variant="outline" className="text-gray-500">
        <Twitter className="h-3 w-3 mr-1" />
        Loading...
      </Badge>
    );
  }

  // Not configured at all
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
            <p>Twitter API credentials are not configured on the server.</p>
            <p className="text-xs mt-1">
              Check your Convex environment variables.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Configured but not connected
  if (isConfigured && !isConnected) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="text-amber-600 border-amber-200 bg-amber-50"
            >
              <Server className="h-3 w-3 mr-1" />
              API Configured (Not Connected)
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Twitter API is configured on the server but not connected to an
              account.
            </p>
            <p className="text-xs mt-1">
              Connect a Twitter account to use the API.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Fully configured and connected
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
          <p>Twitter API is properly configured on the server.</p>
          {username && <p className="text-xs mt-1">Connected as @{username}</p>}
          {serverConfig?.environment && (
            <p className="text-xs mt-1">
              Environment: {serverConfig.environment}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
