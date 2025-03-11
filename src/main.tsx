import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TempoDevtools } from "tempo-devtools";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "./components/ui/toaster";

// Initialize Convex client with the URL from environment variables
const convexUrl =
  import.meta.env.VITE_CONVEX_URL || "https://eager-giraffe-724.convex.cloud";
if (!convexUrl) {
  console.warn("VITE_CONVEX_URL is not set. Using fallback URL.");
}

const convex = new ConvexReactClient(convexUrl);

// We'll create the demo user when needed in the app instead of on startup

// Initialize Tempo Devtools
TempoDevtools.init();

const basename = import.meta.env.BASE_URL || "/";

// Get Clerk publishable key from environment variables
const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  "pk_test_ZmxvY2stYmRheS0xMC5jbGVyay5hY2NvdW50cy5kZXYk";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <BrowserRouter basename={basename}>
          <App />
          <Toaster />
        </BrowserRouter>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>,
);
