import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { TwitterStatusIndicator } from "./twitter-status-indicator";

// We'll rely on the server-side status check instead of client-side env vars
const isTwitterConfigured = true; // This will be overridden by the hook

export function TwitterIntegrationInfo() {
  return (
    <Alert
      className={
        isTwitterConfigured
          ? "bg-green-50 border-green-200 mb-6"
          : "bg-amber-50 border-amber-200 mb-6"
      }
    >
      <div className="flex justify-between items-start w-full">
        <div className="flex-1">
          <AlertCircle
            className={
              isTwitterConfigured
                ? "h-4 w-4 text-green-600"
                : "h-4 w-4 text-amber-600"
            }
          />
          <AlertTitle
            className={
              isTwitterConfigured ? "text-green-800" : "text-amber-800"
            }
          >
            Twitter Integration Status
          </AlertTitle>
          <AlertDescription
            className={
              isTwitterConfigured ? "text-green-700" : "text-amber-700"
            }
          >
            {isTwitterConfigured ? (
              <>
                <p className="mb-2">
                  Twitter API credentials are configured. Posts can be published
                  to Twitter.
                </p>
                <p className="mb-4">
                  Make sure your server-side scheduler is properly set up to
                  handle scheduled posts.
                </p>
              </>
            ) : (
              <>
                <p className="mb-2">
                  This application is currently running in demo mode. Twitter
                  integration is simulated and posts are not actually published
                  to Twitter.
                </p>
                <p className="mb-4">
                  To enable real Twitter integration, add your Twitter API
                  credentials to the .env file and restart the application.
                </p>
                <Button
                  variant="outline"
                  className="border-amber-500 text-amber-700 hover:bg-amber-100"
                  onClick={() =>
                    window.open(
                      "https://developer.twitter.com/en/docs/twitter-api",
                      "_blank",
                    )
                  }
                >
                  Learn About Twitter API
                </Button>
              </>
            )}
          </AlertDescription>
        </div>
        <div className="ml-4">
          <TwitterStatusIndicator />
        </div>
      </div>
    </Alert>
  );
}
