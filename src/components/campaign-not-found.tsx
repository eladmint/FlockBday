/**
 * Shared component for displaying a campaign not found message
 */
export function CampaignNotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Campaign Not Found
      </h1>
      <p className="text-gray-600">
        The campaign you're looking for doesn't exist or you don't have access
        to it.
      </p>
    </div>
  );
}
