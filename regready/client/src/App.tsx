import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isAuthenticated, hasActiveSubscription, isAdmin } from "./lib/auth";
import Landing from "@/pages/landing";
import Auth from "@/pages/auth";
import SubscriptionRequired from "@/pages/subscription-required";
import Dashboard from "@/pages/dashboard";
import PolicyManagement from "@/pages/policy-management";
import ComplianceFrameworks from "@/pages/compliance-frameworks";
import RiskAssessment from "@/pages/risk-assessment";
import VendorManagement from "@/pages/vendor-management";
import AuditReports from "@/pages/audit-reports";
import DocumentLibrary from "@/pages/document-library";
import TeamCollaboration from "@/pages/team-collaboration";
import PolicyDetail from "@/pages/policy-detail";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";

function ProtectedAppRouter() {
  const [, setLocation] = useLocation();
  
  // Check authentication and subscription status
  if (!isAuthenticated()) {
    setLocation("/auth");
    return null;
  }
  
  // Admin users bypass subscription requirements
  if (!isAdmin() && !hasActiveSubscription()) {
    setLocation("/subscription-required");
    return null;
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/policy-management" component={PolicyManagement} />
          <Route path="/policies/:id" component={PolicyDetail} />
          <Route path="/compliance-frameworks" component={ComplianceFrameworks} />
          <Route path="/risk-assessment" component={RiskAssessment} />
          <Route path="/vendor-management" component={VendorManagement} />
          <Route path="/audit-reports" component={AuditReports} />
          <Route path="/document-library" component={DocumentLibrary} />
          <Route path="/team-collaboration" component={TeamCollaboration} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={Auth} />
      <Route path="/subscription-required" component={SubscriptionRequired} />
      <Route path="/dashboard" component={ProtectedAppRouter} />
      <Route path="/policy-management" component={ProtectedAppRouter} />
      <Route path="/policies/:id" component={ProtectedAppRouter} />
      <Route path="/compliance-frameworks" component={ProtectedAppRouter} />
      <Route path="/risk-assessment" component={ProtectedAppRouter} />
      <Route path="/vendor-management" component={ProtectedAppRouter} />
      <Route path="/audit-reports" component={ProtectedAppRouter} />
      <Route path="/team-collaboration" component={ProtectedAppRouter} />
      <Route path="/document-library" component={ProtectedAppRouter} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Set up demo auth token if not exists (for development)
  if (!localStorage.getItem('auth_token')) {
    localStorage.setItem('auth_token', 'demo-token');
    localStorage.setItem('user_data', JSON.stringify({
      id: 1,
      email: 'admin@regready.com',
      username: 'admin_user',
      subscriptionTier: 'pro',
      subscriptionStatus: 'active',
      role: 'admin'
    }));
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
