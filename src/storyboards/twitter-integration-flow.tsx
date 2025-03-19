import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Twitter,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

/**
 * This component visualizes the Twitter integration flow for documentation purposes.
 * It shows the process of connecting Twitter, creating posts, and scheduling them.
 */
export default function TwitterIntegrationFlow() {
  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6">Twitter Integration Flow</h1>

      <div className="space-y-8">
        {/* Authentication Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Twitter className="h-5 w-5 text-blue-500 mr-2" />
              Authentication Flow
            </CardTitle>
            <CardDescription>
              How user authentication works with Twitter integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-blue-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">User Authentication</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Users authenticate with our platform using Clerk
                  authentication. This is completely separate from Twitter
                  integration.
                </p>
                <div className="flex items-center text-sm text-blue-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Handled by Clerk
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Twitter Connection</h3>
                <p className="text-sm text-gray-600 mb-2">
                  After authentication, users can connect their Twitter account
                  in settings or directly in a campaign.
                </p>
                <div className="flex items-center text-sm text-blue-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Uses Twitter API credentials
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Campaign Enablement</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Users enable Twitter publishing for specific campaigns they
                  want to share content from.
                </p>
                <div className="flex items-center text-sm text-blue-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Per-campaign setting
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publishing Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Twitter className="h-5 w-5 text-blue-500 mr-2" />
              Publishing Flow
            </CardTitle>
            <CardDescription>
              How posts are published to Twitter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-green-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Create Post</h3>
                <p className="text-sm text-gray-600 mb-2">
                  User creates a post with the "Share on Twitter" option
                  enabled.
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Content validation
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Save to Database</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Post is saved to Convex database with Twitter sharing flag.
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Real-time update
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Publish to Twitter</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Convex action calls Twitter API to publish the post.
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Server-side API call
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Update Status</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Post status and Twitter metrics are updated in database.
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Engagement tracking
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduling Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 text-purple-500 mr-2" />
              Scheduling Flow
            </CardTitle>
            <CardDescription>
              How posts are scheduled for future publishing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-purple-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Schedule Post</h3>
                <p className="text-sm text-gray-600 mb-2">
                  User creates a post with scheduling enabled and sets
                  date/time.
                </p>
                <div className="flex items-center text-sm text-purple-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Date/time validation
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-purple-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Save as Scheduled</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Post is saved with "scheduled" status and timestamp.
                </p>
                <div className="flex items-center text-sm text-purple-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Stored in database
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-purple-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Scheduled Job</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Convex scheduled job checks for due posts periodically.
                </p>
                <div className="flex items-center text-sm text-purple-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Automated processing
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-purple-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Publish at Scheduled Time</h3>
                <p className="text-sm text-gray-600 mb-2">
                  When scheduled time arrives, post is published to Twitter.
                </p>
                <div className="flex items-center text-sm text-purple-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Status updated to "published"
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Handling */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              Error Handling
            </CardTitle>
            <CardDescription>
              How errors are handled in the Twitter integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">API Errors</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Twitter API errors are caught and handled gracefully.
                </p>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Rate limiting</li>
                  <li>Authentication failures</li>
                  <li>Content validation errors</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">UI Feedback</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Users receive clear error messages and recovery options.
                </p>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Toast notifications</li>
                  <li>Inline form validation</li>
                  <li>Status indicators</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Retry Mechanism</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Failed operations can be retried automatically or manually.
                </p>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Automatic retries for transient errors</li>
                  <li>Manual retry options for user</li>
                  <li>Exponential backoff strategy</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Logging</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Detailed error logging for debugging and monitoring.
                </p>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Error boundaries in React components</li>
                  <li>Structured error logging</li>
                  <li>Context-rich error information</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
