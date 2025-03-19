# Twitter Environment Variables Configuration

## Overview
This document explains how the Twitter API credentials are configured and accessed in the application.

## Environment Variables

The Twitter API integration requires the following environment variables to be set in the Convex environment:

- `VITE_TWITTER_API_KEY` - Your Twitter API key
- `VITE_TWITTER_API_SECRET` - Your Twitter API secret
- `VITE_TWITTER_ACCESS_TOKEN` - Your Twitter access token
- `VITE_TWITTER_ACCESS_TOKEN_SECRET` - Your Twitter access token secret

## Architecture

### Server-Side Access
The Convex backend accesses these environment variables directly using `process.env.VITE_TWITTER_API_KEY`, etc.

### Client-Side Access
The client-side code does NOT directly access these environment variables. Instead, it relies on server-side status checks through Convex queries:

1. `api.twitter.getTwitterStatus` - Checks if Twitter is connected
2. `api.twitterStatus.isConfigured` - Checks if Twitter API credentials are configured

### Implementation Details

- The `useTwitterCredentials` hook fetches the Twitter configuration status from the server
- UI components like `TwitterStatusIndicator` use this hook to display the correct status
- All actual Twitter API calls are made server-side through Convex actions

## Troubleshooting

If the Twitter API credentials test shows:
- Individual credentials as `false` but
- "Credentials configured in Convex: ✅ Yes"

This is expected behavior. The individual credential checks are showing `false` because the client cannot directly access the environment variables, but the overall configuration check is showing `Yes` because the server-side check confirms the credentials exist.

## Security Benefits

- API credentials are never exposed to the client
- All Twitter API calls happen server-side
- Consistent behavior across development and production
- Graceful fallback to mock implementation when needed
