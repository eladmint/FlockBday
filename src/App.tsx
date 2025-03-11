import { Suspense } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Dashboard from "./pages/dashboard";
import DashboardPaid from "./pages/dashboard-paid";
import Form from "./pages/form";
import Home from "./pages/home";
import NotSubscribed from "./pages/not-subscribed";
import Success from "./pages/success";
import CampaignDashboard from "./pages/campaigns-connected";
import CampaignDetail from "./pages/campaign-detail-connected";
import Settings from "./pages/settings";
import TermsOfUse from "./pages/terms";
import PrivacyPolicy from "./pages/privacy";
import ProtectedRoute from "./components/wrappers/ProtectedRoute";
import { LoadingSpinner } from "./components/loading-spinner";

function App() {
  // For Tempo routes
  if (import.meta.env.VITE_TEMPO) {
    useRoutes(routes);
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-paid"
          element={
            <ProtectedRoute>
              <DashboardPaid />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <CampaignDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaign/:id"
          element={
            <ProtectedRoute>
              <CampaignDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/not-subscribed" element={<NotSubscribed />} />
        <Route path="/success" element={<Success />} />
        <Route path="/form" element={<Form />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* Add Tempo routes before the catch-all */}
        {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
        {/* Add a catch-all route that redirects to home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}

export default App;
