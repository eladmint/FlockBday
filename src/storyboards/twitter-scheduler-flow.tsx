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
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Twitter,
  RefreshCw,
} from "lucide-react";

/**
 * This component visualizes the Twitter scheduling flow for documentation purposes.
 * It shows the process of scheduling posts and how they are processed.
 */
export default function TwitterSchedulerFlow() {
  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6">Twitter Scheduling Flow</h1>

      <div className="space-y-8">
        {/* Scheduling Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
              Post Scheduling Flow
            </CardTitle>
            <CardDescription>
              How posts are scheduled for future publication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-blue-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">User Creates Post</h3>
                <p className="text-sm text-gray-600 mb-2">
                  User fills out post form, enables Twitter sharing, and selects
                  "Schedule for later" with a future date and time.
                </p>
                <div className="flex items-center text-sm text-blue-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Form validation ensures valid scheduling
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Save to Database</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Post is saved to Convex database with "scheduled" status and
                  the scheduled timestamp.
                </p>
                <div className="flex items-center text-sm text-blue-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Real-time database update
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Create Scheduled Job</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Convex scheduler creates a job to run at the specified time to
                  publish the post.
                </p>
                <div className="flex items-center text-sm text-blue-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Job ID stored with post
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Execution Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 text-green-500 mr-2" />
              Execution Flow
            </CardTitle>
            <CardDescription>
              How scheduled posts are processed and published
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-green-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Scheduled Time Arrives</h3>
                <p className="text-sm text-gray-600 mb-2">
                  When the scheduled time arrives, Convex automatically triggers
                  the scheduled job.
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <Clock className="h-4 w-4 mr-1" />
                  Precise timing
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Publish to Twitter</h3>
                <p className="text-sm text-gray-600 mb-2">
                  The job calls the Twitter API to publish the post with the
                  stored content and image (if any).
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <Twitter className="h-4 w-4 mr-1" />
                  Server-side API call
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Update Post Status</h3>
                <p className="text-sm text-gray-600 mb-2">
                  After successful publication, the post status is updated to
                  "published" with Twitter metrics.
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Real-time status update
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Handling Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              Error Handling Flow
            </CardTitle>
            <CardDescription>
              How failures are handled during the publishing process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-amber-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Publication Failure</h3>
                <p className="text-sm text-gray-600 mb-2">
                  If the Twitter API call fails (rate limits, network issues,
                  etc.), the error is captured.
                </p>
                <div className="flex items-center text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Detailed error logging
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-amber-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Automatic Retry</h3>
                <p className="text-sm text-gray-600 mb-2">
                  System schedules a retry with exponential backoff (5, 15, then
                  45 minutes).
                </p>
                <div className="flex items-center text-sm text-amber-600">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Up to 3 retry attempts
                </div>
              </div>

              <ArrowRight className="hidden md:block h-6 w-6 text-gray-400 mx-2 self-center" />
              <div className="md:hidden h-6 w-6 flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
              </div>

              <div className="bg-amber-50 p-4 rounded-lg flex-1">
                <h3 className="font-medium mb-2">Final Status Update</h3>
                <p className="text-sm text-gray-600 mb-2">
                  After all retries, if still failing, post is marked as
                  "failed" with error details.
                </p>
                <div className="flex items-center text-sm text-amber-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  User can manually retry later
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 text-purple-500 mr-2" />
              Calendar Integration
            </CardTitle>
            <CardDescription>
              How the calendar view helps manage scheduled posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Visual Schedule</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Calendar view shows which days have scheduled posts with count
                  indicators.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  <li>Highlighted dates with scheduled posts</li>
                  <li>Post count badges on each day</li>
                  <li>Current day indicator</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Post Management</h3>
                <p className="text-sm text-gray-600 mb-2">
                  List view of upcoming scheduled posts with management options.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  <li>View post details and scheduled time</li>
                  <li>Cancel scheduled posts before publication</li>
                  <li>Chronological ordering by scheduled time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
