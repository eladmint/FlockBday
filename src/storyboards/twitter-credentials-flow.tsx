import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TwitterStatusIndicator } from "@/components/twitter-status-indicator";

/**
 * This storyboard explains the flow of Twitter credentials in the application.
 * It shows how the application checks for Twitter credentials and how it handles
 * different credential states.
 */
export default function TwitterCredentialsFlow() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Twitter Credentials Flow</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Twitter Credentials Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <TwitterStatusIndicator />
              </div>

              <div className="bg-blue-50 p-4 rounded-md text-blue-800">
                <h3 className="font-medium mb-2">Key Principles</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    <strong>Server-Side Credentials:</strong> Twitter API
                    credentials are stored securely on the server in Convex
                    environment variables.
                  </li>
                  <li>
                    <strong>Client-Side Verification:</strong> The client checks
                    if credentials are configured using server-side queries, not
                    by directly accessing environment variables.
                  </li>
                  <li>
                    <strong>Graceful Fallback:</strong> If credentials are not
                    configured, the application falls back to using mock data
                    for development and testing.
                  </li>
                  <li>
                    <strong>Separation of Concerns:</strong> The application
                    separates credential checking from Twitter API operations.
                  </li>
                </ul>
              </div>

              <div className="border p-4 rounded-md">
                <h3 className="font-medium mb-4">Credential Flow Diagram</h3>
                <div className="bg-white p-4 rounded-md border text-xs font-mono overflow-auto">
                  {`
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client         │     │  Convex         │     │  Twitter API    │
│  Application    │     │  Backend        │     │                 │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         │  1. Check if Twitter  │                       │
         │  credentials are      │                       │
         │  configured           │                       │
         │─────────────────────>│                       │
         │                       │                       │
         │                       │  2. Check environment │
         │                       │  variables            │
         │                       │───────────────────────│
         │                       │                       │
         │  3. Return credential │                       │
         │  status               │                       │
         │<─────────────────────│                       │
         │                       │                       │
         │  4. If credentials    │                       │
         │  are configured,      │                       │
         │  make API request     │                       │
         │─────────────────────>│                       │
         │                       │                       │
         │                       │  5. Make Twitter      │
         │                       │  API call             │
         │                       │───────────────────────│
         │                       │                       │
         │                       │  6. Return API        │
         │                       │  response             │
         │                       │<──────────────────────│
         │                       │                       │
         │  7. Return API        │                       │
         │  response to client   │                       │
         │<─────────────────────│                       │
         │                       │                       │
         │  8. If credentials    │                       │
         │  are not configured,  │                       │
         │  use mock data        │                       │
         │                       │                       │
                  `}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Key Files</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm font-mono">
                    <li>convex/twitter-status.ts</li>
                    <li>convex/twitter-config.ts</li>
                    <li>src/hooks/useTwitterCredentials.ts</li>
                    <li>src/services/twitter-api-browser.ts</li>
                    <li>src/utils/twitter-api-test.ts</li>
                  </ul>
                </div>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Environment Variables</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm font-mono">
                    <li>VITE_TWITTER_API_KEY</li>
                    <li>VITE_TWITTER_API_SECRET</li>
                    <li>VITE_TWITTER_ACCESS_TOKEN</li>
                    <li>VITE_TWITTER_ACCESS_TOKEN_SECRET</li>
                  </ul>
                  <p className="text-xs mt-2 text-gray-600">
                    These must be set in the Convex environment, not in
                    client-side .env files.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-md text-amber-800">
                <h3 className="font-medium mb-2">Common Issues</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    <strong>Client-Side Environment Variables:</strong>{" "}
                    Environment variables with the VITE_ prefix are exposed to
                    the client, but they should not be used for sensitive
                    credentials.
                  </li>
                  <li>
                    <strong>Require Not Defined:</strong> The 'require' function
                    is not available in browser environments when using Vite/ESM
                    modules. Use dynamic imports instead.
                  </li>
                  <li>
                    <strong>Credentials Show as False:</strong> This is expected
                    behavior when checking credentials in the browser. The
                    client cannot directly access server environment variables.
                  </li>
                  <li>
                    <strong>Mock Data in Development:</strong> The application
                    uses mock data for Twitter integration in development. This
                    is by design and allows for testing without real
                    credentials.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
