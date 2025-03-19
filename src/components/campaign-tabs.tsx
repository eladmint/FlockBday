import { Campaign } from "@/types/campaign";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, TrendingUp } from "lucide-react";

interface CampaignTabsProps {
  postsTab: React.ReactNode;
  scheduledTab: React.ReactNode;
  metricsTab?: React.ReactNode;
  campaign: Campaign;
}

/**
 * Shared component for displaying campaign navigation tabs
 */
export function CampaignTabs({
  postsTab,
  scheduledTab,
  metricsTab,
  campaign,
}: CampaignTabsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="posts" className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Posts
        </TabsTrigger>
        <TabsTrigger value="scheduled" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Scheduled
        </TabsTrigger>
        {metricsTab && (
          <TabsTrigger value="metrics" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="posts">{postsTab}</TabsContent>
      <TabsContent value="scheduled">{scheduledTab}</TabsContent>
      {metricsTab && <TabsContent value="metrics">{metricsTab}</TabsContent>}
    </Tabs>
  );
}
