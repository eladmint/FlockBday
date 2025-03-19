# Twitter Integration Troubleshooting Guide

## Common Issues and Solutions

### 1. "Enable for Campaign" Button Not Working

If the "Enable for Campaign" button doesn't work, it could be due to several reasons:

#### Possible Causes:

- **Missing Twitter Integration**: The user hasn't connected their Twitter account at the account level.
- **Authentication Issues**: The user is not properly authenticated.
- **Database Connectivity**: Problems with the Convex database connection.
- **Error Handling**: Errors are occurring but not being properly displayed to the user.

#### Solutions:

- **Use the TwitterConnectButton Component**: This component directly calls the `enableTwitterForCampaign` mutation and includes proper error handling.
- **Mock Integration for Demo**: For demo purposes, the system now creates a mock Twitter integration if none exists.
- **Check Console for Errors**: Look at the browser console for any error messages.
- **Verify Authentication**: Ensure the user is properly authenticated before attempting to enable Twitter.

### 2. Scheduled Posts Not Publishing

If scheduled posts are not being published at the specified time:

#### Possible Causes:

- **Scheduler Issues**: The Convex scheduler might not be running correctly.
- **Twitter API Errors**: The Twitter API might be returning errors.
- **Missing Credentials**: Twitter credentials might be missing or invalid.

#### Solutions:

- **Check Scheduler Logs**: Look at the Convex logs to see if the scheduler is running.
- **Verify Twitter API Status**: Check if the Twitter API is operational.
- **Update Credentials**: Ensure the Twitter credentials are valid and up-to-date.
- **Implement Retry Logic**: The system includes retry logic with exponential backoff for failed publications.

### 3. Twitter Metrics Not Updating

If Twitter metrics are not updating:

#### Possible Causes:

- **Rate Limiting**: Twitter API rate limits might be exceeded.
- **Scheduler Issues**: The metrics update scheduler might not be running.
- **Database Updates**: The metrics might be fetched but not properly saved to the database.

#### Solutions:

- **Implement Rate Limiting**: Ensure the system respects Twitter API rate limits.
- **Check Scheduler**: Verify the metrics update scheduler is running correctly.
- **Debug Database Updates**: Check if metrics are being properly saved to the database.

## Implementation Details

### Twitter Integration Flow

1. **User Connects Twitter Account**: The user connects their Twitter account at the account level using `useTwitterIntegration` hook.
2. **Enable Twitter for Campaign**: The user enables Twitter for a specific campaign using the `enableTwitterForCampaign` mutation.
3. **Create and Schedule Posts**: The user creates posts and optionally schedules them for future publication.
4. **Publish to Twitter**: Posts are published to Twitter either immediately or at the scheduled time.
5. **Track Metrics**: Twitter metrics are tracked and updated periodically.

### Key Components

- **TwitterConnectButton**: A button component that directly calls the `enableTwitterForCampaign` mutation.
- **TwitterPostForm**: A form for creating and scheduling Twitter posts.
- **ScheduledPostsCalendar**: A calendar view of scheduled posts.
- **TwitterMetricsChart**: A component for visualizing Twitter metrics.

### Error Handling

The system includes robust error handling with:

- **Toast Notifications**: User-friendly error messages using toast notifications.
- **Console Logging**: Detailed error logging to the console for debugging.
- **Retry Logic**: Automatic retry with exponential backoff for failed operations.
- **Fallback Mechanisms**: Fallback mechanisms for handling edge cases.

## Development Notes

### Mock Implementation

For development and testing purposes, the system includes a mock implementation that:

- Creates mock Twitter integrations if none exist.
- Simulates Twitter API responses without making actual API calls.
- Provides realistic-looking metrics for demonstration purposes.

### Testing

To test the Twitter integration:

1. Connect a Twitter account (or use the mock implementation).
2. Enable Twitter for a campaign using the "Enable for Campaign" button.
3. Create a post with Twitter sharing enabled.
4. Verify the post appears in the campaign posts list.
5. Schedule a post for future publication.
6. Verify the post appears in the scheduled posts calendar.
