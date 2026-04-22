import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatsGrid from "@/components/dashboard/stats-grid";
import QuickAccessGrid from "@/components/dashboard/quick-access-grid";
import AIChatbot from "@/components/chat/ai-chatbot";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // The router handles authentication redirect, no need for manual redirect here

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      
      <div className="lg:ml-72 min-h-screen">
        <Header 
          title="Dashboard"
          subtitle="Welcome back. Here's your clinical overview."
        />
        
        <main className="p-4 lg:p-6 space-y-6">
          <StatsGrid />
          <QuickAccessGrid />
        </main>
      </div>

      <AIChatbot />
    </div>
  );
}
