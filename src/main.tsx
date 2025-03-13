import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import App from "./App";
import "./index.css";
import {
  clerkPaths,
  clerkPublishableKey,
  developmentUrl,
} from "./lib/clerk-config";

// Import the dev tools and initialize them
import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Get the Convex URL from environment variables
const convexUrl = import.meta.env.VITE_CONVEX_URL;

// Create a Convex client
const convex = new ConvexReactClient(convexUrl);

// Determine if we're in Tempo environment
const isTempo = import.meta.env.VITE_TEMPO === "true";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      routing="path"
      paths={clerkPaths}
      // Add the development URL for Clerk when in Tempo environment
      frontendApi={isTempo ? developmentUrl : undefined}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>,
);
