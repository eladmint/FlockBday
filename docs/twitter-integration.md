# Twitter Integration Documentation

## Overview
This document explains how the Twitter API integration works in our campaign platform. The integration allows users to publish and schedule posts directly to Twitter from their campaigns.

## Architecture

### Components

1. **Frontend Components**
   - `TwitterConnect`: UI component for enabling/disabling Twitter for a campaign
   - `TwitterConnectButton`: Reusable button component for Twitter connection actions
   - `TwitterPostForm`: Form for creating posts with Twitter publishing option
   - `TwitterPost`: Display component for posts with Twitter metrics
   - `TwitterStatusIndicator`: Shows Twitter connection status
   - `TwitterIntegrationInfo`: Information about Twitter integration status
   - `TwitterTestButton`: Utility for testing Twitter integration

2. **Hooks**
   - `useTwitterService`: Main hook for Twitter functionality (publishing, scheduling)
   - `useTwitterIntegration`: Hook for managing Twitter account connection
   - `useTwitterCredentials`: Hook for checking Twitter credentials status

3. **Services**
   - `TwitterService`: Singleton service that handles all Twitter API interactions
   - `twitter-api-browser.ts`: Browser-safe Twitter API client
   - `mock-twitter-service.ts`: Mock implementation for development/testing

4. **Convex Backend**
   - `twitter.ts`: Convex mutations and queries for Twitter integration
   - `twitter-api.ts`: Server-side actions for Twitter API calls
   - `internal.ts`: Internal functions for post management

### Data Flow

1. **Connecting Twitter Account**
   - User connects Twitter account in settings
   - Credentials are verified and stored in Convex
   - Connection status is updated in UI

2. **Enabling Twitter for Campaign**
   - User enables Twitter for a specific campaign
   - Campaign settings are updated in Convex
   - Campaign-specific Twitter integration is created

3. **Publishing a Post**
   - User creates post with "Share on Twitter" option
   - Post is saved to Convex database
   - If immediate publishing:
     - Convex action calls Twitter API
     - Post status and Twitter metrics are updated
   - If scheduled:
     - Post is marked as "scheduled" with timestamp
     - Convex scheduled job processes at designated time

## Implementation Details

### Twitter Credentials
Twitter API credentials are stored securely in Convex and not exposed to the client. The following environment variables are used:

- `VITE_TWITTER_API_KEY`: Twitter API key
- `VITE_TWITTER_API_SECRET`: Twitter API secret
- `VITE_TWITTER_ACCESS_TOKEN`: Twitter access token
- `VITE_TWITTER_ACCESS_TOKEN_SECRET`: Twitter access token secret

### Mock Implementation
For development and testing, a mock implementation is provided that simulates Twitter API responses without making actual API calls.

### Error Handling
The integration includes robust error handling with:

- Error boundaries for UI components
- Detailed error logging
- User-friendly error messages
- Automatic retry for failed operations

## Usage Examples

### Enabling Twitter for a Campaign
```tsx
const { enableTwitter } = useCampaignDetail(campaignId);

const handleEnableTwitter = async () => {
  try {
    await enableTwitter();
    // Success handling
  } catch (error) {
    // Error handling
  }
};
```

### Creating and Publishing a Post
```tsx
const { createPost } = useCampaignDetail(campaignId);

const handleCreatePost = async (postData) => {
  try {
    await createPost({
      ...postData,
      sharedOnTwitter: true
    });
    // Success handling
  } catch (error) {
    // Error handling
  }
};
```

### Scheduling a Post
```tsx
const { createPost } = useCampaignDetail(campaignId);

const handleSchedulePost = async (postData, scheduledTime) => {
  try {
    await createPost({
      ...postData,
      status: "scheduled",
      scheduledFor: scheduledTime.getTime(),
      sharedOnTwitter: true
    });
    // Success handling
  } catch (error) {
    // Error handling
  }
};
```

## Troubleshooting

### Common Issues

1. **Twitter Connection Fails**
   - Check that Twitter API credentials are correctly configured
   - Verify user has connected their Twitter account
   - Check for rate limiting issues

2. **Posts Not Publishing**
   - Verify campaign has Twitter enabled
   - Check post content meets Twitter requirements
   - Look for API errors in console logs

3. **Scheduled Posts Not Processing**
   - Verify scheduled job is running correctly
   - Check for timezone issues in scheduled time
   - Verify post status is correctly set to "scheduled"

### Testing
Use the `TwitterTestButton` component to run integration tests that verify:

- Twitter credentials are configured
- Authentication is working
- Post creation and publishing works
- Scheduled posts are properly queued

## Future Improvements

1. **Analytics Integration**
   - Add Twitter engagement metrics tracking
   - Implement post performance analytics

2. **Advanced Scheduling**
   - Add recurring post scheduling
   - Implement optimal time scheduling based on audience activity

3. **Content Optimization**
   - Add hashtag suggestions
   - Implement content optimization recommendations
