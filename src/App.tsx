import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MockAuthProvider } from "@/hooks/useMockAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { HealthDataProvider } from "@/hooks/useHealthData";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import PatientRegisterPage from "./pages/PatientRegisterPage";
import HealthWorkerRegisterPage from "./pages/HealthWorkerRegisterPage";
import PatientDashboard from "./pages/PatientDashboard";
import HealthWorkerDashboard from "./pages/HealthWorkerDashboard";
import MyHealthPage from "./pages/MyHealthPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import MedicationsPage from "./pages/MedicationsPage";
import ReportsPage from "./pages/ReportsPage";
import MyPatientsPage from "./pages/MyPatientsPage";
import ConsultationsPage from "./pages/ConsultationsPage";
import HelpPage from "./pages/HelpPage";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MockAuthProvider>
      <LanguageProvider>
        <HealthDataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Layout><LoginPage /></Layout>} />
              <Route path="/register" element={<Layout><PatientRegisterPage /></Layout>} />
              <Route path="/health-worker-register" element={<Layout><HealthWorkerRegisterPage /></Layout>} />
              <Route path="/patient-dashboard" element={<Layout><PatientDashboard /></Layout>} />
              <Route path="/health-worker-dashboard" element={<Layout><HealthWorkerDashboard /></Layout>} />
              
              {/* Patient Pages */}
              <Route path="/my-health" element={<Layout><MyHealthPage /></Layout>} />
              <Route path="/appointments" element={<Layout><AppointmentsPage /></Layout>} />
              <Route path="/medications" element={<Layout><MedicationsPage /></Layout>} />
              <Route path="/reports" element={<Layout><ReportsPage /></Layout>} />
              
              {/* Health Worker Pages */}
              <Route path="/patients" element={<Layout><MyPatientsPage /></Layout>} />
              <Route path="/consultations" element={<Layout><ConsultationsPage /></Layout>} />
              
              {/* General Pages */}
              <Route path="/help" element={<Layout><HelpPage /></Layout>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HealthDataProvider>
    </LanguageProvider>
  </MockAuthProvider>
</QueryClientProvider>
);

export default App;
