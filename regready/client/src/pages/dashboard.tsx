import { useState } from "react";
import PolicyCreationModal from "@/components/policy/policy-creation-modal";
import OverviewTab from "@/components/dashboard/overview-tab";
import AnalyticsTab from "@/components/dashboard/analytics-tab";
import RecommendationsEngine from "@/components/compliance/recommendations-engine";
import ComplianceReportGenerator from "@/components/reports/compliance-report-generator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  FileDown, 
  Shield
} from "lucide-react";

export default function Dashboard() {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Compliance Dashboard
            </h1>
            <p className="text-neutral-600">Complete overview of your compliance status and key metrics</p>
          </div>

        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" data-testid="overview-tab">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="analytics-tab">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="recommendations" data-testid="recommendations-tab">
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="reports" data-testid="reports-tab">
              <FileDown className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab onNewPolicyClick={() => setIsPolicyModalOpen(true)} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="recommendations">
            <RecommendationsEngine />
          </TabsContent>

          <TabsContent value="reports">
            <ComplianceReportGenerator />
          </TabsContent>
        </Tabs>
      </main>

      <PolicyCreationModal 
        open={isPolicyModalOpen} 
        onOpenChange={setIsPolicyModalOpen} 
      />
    </div>
  );
}
