import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

// Import the dev tools and initialize them
import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Get the Convex URL from environment variables
const convexUrl = import.meta.env.VITE_CONVEX_URL;

// Create a Convex client
const convex = new ConvexReactClient(convexUrl);

// Get the Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ConvexProvider client={convex}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConvexProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
