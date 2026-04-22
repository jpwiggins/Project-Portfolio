import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Consult from "@/pages/consult";
import Diagnostic from "@/pages/diagnostic";
import References from "@/pages/references";
import Scheduling from "@/pages/scheduling";

import Translation from "@/pages/translation";
import Wellness from "@/pages/wellness";
import Subscribe from "@/pages/subscribe";
import AuthTest from "@/pages/auth-test";
import AuthPage from "@/pages/auth-page";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/consult" component={Consult} />
          <Route path="/diagnostic" component={Diagnostic} />
          <Route path="/references" component={References} />
          <Route path="/scheduling" component={Scheduling} />

          <Route path="/translation" component={Translation} />
          <Route path="/wellness" component={Wellness} />
          <Route path="/subscribe" component={Subscribe} />
        </>
      )}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/auth-test" component={AuthTest} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Router />
              <Toaster />
            </div>
          </ThemeProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
