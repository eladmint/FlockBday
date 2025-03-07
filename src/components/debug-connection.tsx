import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function DebugConnection() {
  const myCampaigns = useQuery(api.campaigns.getMyCampaigns);
  const trendingCampaigns = useQuery(api.campaigns.getTrendingCampaigns);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 border border-gray-200 rounded-lg shadow-lg z-50 text-xs">
      <h3 className="font-bold mb-2">Connection Status</h3>
      <div>
        <p>
          My Campaigns:{" "}
          {myCampaigns === undefined
            ? "Loading..."
            : myCampaigns
              ? `Loaded (${myCampaigns.length})`
              : "Error"}
        </p>
        <p>
          Trending Campaigns:{" "}
          {trendingCampaigns === undefined
            ? "Loading..."
            : trendingCampaigns
              ? `Loaded (${trendingCampaigns.length})`
              : "Error"}
        </p>
      </div>
    </div>
  );
}
