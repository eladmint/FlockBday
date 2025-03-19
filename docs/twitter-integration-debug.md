# Twitter Integration Debugging Guide

## Common Issues

### "Enable for Campaign" Button Not Working

If the "Enable for Campaign" button is not working, here are some steps to diagnose and fix the issue:

#### 1. Check Console Logs

Open your browser's developer console (F12 or right-click > Inspect > Console) and look for error messages. The application has been updated with extensive logging to help diagnose issues.

#### 2. Verify Campaign ID Format

The most common issue is an invalid campaign ID format. The `enableTwitterForCampaign` mutation now accepts a string ID and converts it to a Convex ID internally. Make sure the campaign ID is being properly converted using `convexIdToString` before being passed to the mutation.

#### 3. Check Authentication

Ensure that the user is properly authenticated. The `enableTwitterForCampaign` mutation requires a valid user identity. If you're testing in development mode, make sure you're logged in.

#### 4. Verify Database Access

The mutation needs to access both the `campaigns` and `twitterIntegrations` tables. Make sure the Convex function has the necessary permissions to read and write to these tables.

#### 5. Check Twitter Integration Status

The user needs to have Twitter connected at the account level before enabling Twitter for a campaign. The updated code now automatically creates a mock Twitter integration if none exists, but you should still verify that this is working correctly.

### Debugging Steps

1. **Enable Verbose Logging**: The application now includes extensive logging in both the client and server code. Check the console for detailed logs.

2. **Inspect Network Requests**: Use the browser's network tab to inspect the request to the `enableTwitterForCampaign` mutation. Look for any errors in the response.

3. **Check Convex Dashboard**: If you have access to the Convex dashboard, check the logs for the `enableTwitterForCampaign` mutation. This will provide more detailed information about any errors that occur on the server.

4. **Test with Mock Data**: The application now includes a mock implementation for Twitter integration. Try using this to test the functionality without requiring real Twitter credentials.

5. **Verify Schema**: Make sure the `twitterIntegrations` table has the correct schema and indexes defined in `convex/schema.ts`.

## Implementation Details

### Changes Made to Fix the Issue

1. **Modified `enableTwitterForCampaign` Mutation**:
   - Now accepts a string ID instead of a Convex ID
   - Converts the string ID to a Convex ID internally
   - Includes extensive error handling and logging
   - Automatically creates a mock Twitter integration if none exists

2. **Updated `TwitterConnectButton` Component**:
   - Now checks if the user has Twitter connected at the account level
   - Automatically connects Twitter at the account level if needed
   - Includes more robust error handling and logging

3. **Enhanced Error Handling**:
   - Added more specific error messages for different types of errors
   - Improved error logging to help diagnose issues
   - Added fallback mechanisms for handling edge cases

### Testing the Fix

To test if the fix is working:

1. Navigate to a campaign detail page
2. Open the browser console to view logs
3. Click the "Enable for Campaign" button
4. Check the console for logs and any error messages
5. Verify that the Twitter integration is enabled for the campaign

If you encounter any issues, please refer to the logs for more detailed information.
