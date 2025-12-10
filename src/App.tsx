import { Navigate, Route, Routes } from "react-router";

import { AuthProtection } from "./components/auth-protection";
import DashboardLayout from "./components/layout/dashboard/dashboard.layout";
import NestedLayout from "./components/layout/nested-layout";
import PersonaStudioLayout from "./components/layout/person-studio/person-studio-layout";
import SimulationLayout from "./components/layout/simulation/simulation-layout";
import { ProtectedRoute } from "./components/protected-route";
import { abTestingTabs, mediaSimulationTabs } from "./constants";
import ABTestHistoryDetailsPage from "./features/ABTESTING-HISTORY/ab-test-history-detail.page";
import { MediaHistoryPage } from "./features/media-simulation";
import {
  SimulationDetailsPage,
  SimulationHistoryPage,
} from "./features/simulation-history";
import { useAuthInit } from "./hooks/use-auth-init";
import ABTestingHistoryOverviewPage from "./pages/ab-testing-history-overview.page";
import ABTestingOverviewPage from "./pages/ab-testing-overview.page";
import BlogsPage from "./pages/blogs.page";
import HomePage from "./pages/home";
import LoginPage from "./pages/login.page";
import SignupPage from "./pages/signup.page";
import MarketFitSimulationResultPage from "./pages/marketfit-simulation-result.page";
import MediaSimulationPage from "./pages/media-simulation.page";
import MediaSimulationDetailsPage from "./pages/media-simulation/media-simulation-detailed.page";
import MediaSimulationResultPage from "./pages/media-simulation/media-simulation-result.page";
import PersonaChatPage from "./pages/persona-chat-page";
import PersonaChatSessionCreatePage from "./pages/persona-chat-session-create";
import PersonaGeneratorPage from "./pages/persona-engine.page";
import PersonaLibPage from "./pages/persona-lib.page";
import PersonaManagementPage from "./pages/persona-management.page";
import PersonaStudioPage from "./pages/persona-studio.page";
import { ProductVariantsPage } from "./pages/product-variants.page";
import { ProductPage } from "./pages/product.page";
import SimulationHistoryOverviewPage from "./pages/simulation-history-overview.page";
import SimulationOverviewPage from "./pages/simulation-overview.page";

const App = () => {
  useAuthInit();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard-redirect"
        element={<Navigate to="/dashboard" replace />}
      />
      <Route
        path="/login"
        element={
          <AuthProtection>
            <LoginPage />
          </AuthProtection>
        }
      />

      {/* Protected routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* Default route - redirect to Persona Studio */}
        <Route
          index
          element={<Navigate to="/dashboard/persona-studio" replace />}
        />

        <Route
          path="/dashboard/persona-studio"
          element={
            <ProtectedRoute>
              <PersonaStudioLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PersonaStudioPage />} />
          <Route
            path="engine"
            element={
              <ProtectedRoute>
                <PersonaGeneratorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="management"
            element={
              <ProtectedRoute>
                <PersonaManagementPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/dashboard/persona-studio/chat"
          element={
            <ProtectedRoute>
              <PersonaChatSessionCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/persona-studio/chat/:id"
          element={
            <ProtectedRoute>
              <PersonaChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/product"
          element={
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/product/variants/:productId"
          element={
            <ProtectedRoute>
              <ProductVariantsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/persona-lib"
          element={
            <ProtectedRoute>
              <PersonaLibPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/simulation"
          element={
            <ProtectedRoute>
              <SimulationLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SimulationOverviewPage />} />
          <Route
            path="history"
            element={
              <ProtectedRoute>
                <SimulationHistoryOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="history/result/:jobId"
            element={
              <ProtectedRoute>
                <MarketFitSimulationResultPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/dashboard/simulation-history"
          element={
            <ProtectedRoute>
              <SimulationHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/simulation-history/:id"
          element={
            <ProtectedRoute>
              <SimulationDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/ab-testing"
          element={
            <ProtectedRoute>
              <NestedLayout items={abTestingTabs} />
            </ProtectedRoute>
          }
        >
          <Route index element={<ABTestingOverviewPage />} />
          <Route
            path="history"
            element={
              <ProtectedRoute>
                <ABTestingHistoryOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="history/:id"
            element={
              <ProtectedRoute>
                <ABTestHistoryDetailsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/dashboard/media-simulation"
          element={
            <ProtectedRoute>
              <NestedLayout items={mediaSimulationTabs} />
            </ProtectedRoute>
          }
        >
          <Route index element={<MediaSimulationPage />} />

          <Route
            path="history"
            element={
              <ProtectedRoute>
                <MediaHistoryPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/dashboard/media-simulation/:id"
          element={
            <ProtectedRoute>
              <MediaSimulationDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/media-simulation/history/result/:id"
          element={
            <ProtectedRoute>
              <MediaSimulationResultPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
