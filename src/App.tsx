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
import ProtectedRoute from "./components/wrappers/ProtectedRoute";
import { LoadingSpinner } from "./components/loading-spinner";

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/dashboard-paid"
            element={
              <ProtectedRoute>
                <DashboardPaid />
              </ProtectedRoute>
            }
          />
          <Route path="/campaigns" element={<CampaignDashboard />} />
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          <Route path="/form" element={<Form />} />
          <Route path="/success" element={<Success />} />
          <Route path="/not-subscribed" element={<NotSubscribed />} />
          <Route path="/settings" element={<Settings />} />
          {/* Add a catch-all route that redirects to home */}
          <Route path="*" element={<Home />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
