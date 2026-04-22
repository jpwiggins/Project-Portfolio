import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PWAInstallPrompt, PWAStatusIndicator } from "@/components/pwa-install-prompt";
import Home from "@/pages/home";
import SimpleHome from "@/pages/simple-home";
import DailyWellness from "@/pages/daily-wellness";
import Subscribe from "@/pages/subscribe";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import ARPantry from "@/pages/ar-pantry";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/daily-wellness" component={DailyWellness} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/ar-pantry" component={ARPantry} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  console.log("Total Wellness App component rendering...");
  
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            <Toaster />
            <PWAStatusIndicator />
            <PWAInstallPrompt />
            <Router />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("Error in App component:", error);
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Total Wellness on a Budget</h1>
        <p>App loading error. Please refresh the page.</p>
        <p style={{ color: 'red' }}>Error: {String(error)}</p>
      </div>
    );
  }
}

export default App;
