import { Campaign } from "@/types/campaign";

interface CampaignTabsProps {
  campaign: Campaign;
}

/**
 * Shared component for displaying campaign navigation tabs
 */
export function CampaignTabs({ campaign }: CampaignTabsProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <a
          href="#"
          className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
        >
          Posts
        </a>
        <a
          href="#"
          className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
        >
          Collaborators
        </a>
        <a
          href="#"
          className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
        >
          Analytics
        </a>
        {campaign.isOwner && (
          <a
            href="#"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Settings
          </a>
        )}
      </nav>
    </div>
  );
}
