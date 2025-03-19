import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Twitter } from "lucide-react";
import { useTwitterService } from "@/hooks/useTwitterService";
import { Id } from "../../convex/_generated/dataModel";
import { format } from "date-fns";
import { useToast } from "./ui/use-toast";

interface ScheduledPostsCalendarProps {
  campaignId: Id<"campaigns">;
}

/**
 * ScheduledPostsCalendar Component
 *
 * This component displays a calendar view of scheduled Twitter posts for a campaign.
 * It allows users to see when posts are scheduled and manage them.
 */
export function ScheduledPostsCalendar({
  campaignId,
}: ScheduledPostsCalendarProps) {
  const { useScheduledPosts, cancelScheduledPost } = useTwitterService();
  const scheduledPosts = useScheduledPosts(campaignId);
  const { toast } = useToast();

  // Group posts by date for the calendar
  const postsByDate = React.useMemo(() => {
    const grouped: Record<string, any[]> = {};

    if (scheduledPosts) {
      scheduledPosts.forEach((post) => {
        if (post.scheduledFor) {
          const date = format(new Date(post.scheduledFor), "yyyy-MM-dd");
          if (!grouped[date]) {
            grouped[date] = [];
          }
          grouped[date].push(post);
        }
      });
    }

    return grouped;
  }, [scheduledPosts]);

  // Create calendar day render function
  const renderDay = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const postsForDay = postsByDate[dateStr] || [];

    return (
      <div className="relative w-full h-full">
        <time dateTime={dateStr}>{format(day, "d")}</time>
        {postsForDay.length > 0 && (
          <Badge
            variant="secondary"
            className="absolute bottom-0 right-0 text-xs"
          >
            {postsForDay.length}
          </Badge>
        )}
      </div>
    );
  };

  // Handle post cancellation
  const handleCancelPost = async (post: any) => {
    try {
      await cancelScheduledPost(post);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel scheduled post",
        variant: "destructive",
      });
    }
  };

  // Get dates with scheduled posts for highlighting in calendar
  const datesWithPosts = React.useMemo(() => {
    return Object.keys(postsByDate).map((dateStr) => new Date(dateStr));
  }, [postsByDate]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
          Scheduled Posts Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={new Date()}
              className="rounded-md border"
              components={{
                Day: ({ day }) => renderDay(day),
              }}
              modifiers={{
                scheduled: datesWithPosts,
              }}
              modifiersClassNames={{
                scheduled: "bg-blue-50 font-medium text-blue-700",
              }}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Upcoming Scheduled Posts</h3>

            {scheduledPosts && scheduledPosts.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {scheduledPosts
                  .sort((a, b) => (a.scheduledFor || 0) - (b.scheduledFor || 0))
                  .map((post) => (
                    <Card key={post._id} className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium">{post.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                            {post.content}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {post.scheduledFor &&
                              format(
                                new Date(post.scheduledFor),
                                "MMM d, yyyy h:mm a",
                              )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Twitter className="h-4 w-4 text-blue-500 mr-2" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelPost(post)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No scheduled posts</p>
                <p className="text-xs mt-1">Schedule posts to see them here</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
