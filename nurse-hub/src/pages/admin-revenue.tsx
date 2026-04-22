import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, TrendingDown, UserCheck, UserX } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RevenueAnalytics {
  totalUsers: number;
  activeSubscriptions: number;
  trialUsers: number;
  monthlyRevenue: number;
  churnRate: number;
  conversionRate: number;
}

export default function AdminRevenue() {
  const [analytics, setAnalytics] = useState<RevenueAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("GET", "/api/admin/revenue");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        throw new Error("Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Analytics error:", error);
      toast({
        title: "Error",
        description: "Failed to load revenue analytics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Revenue Dashboard</h1>
              <p className="text-text-secondary">Real-time analytics for NurseHub Pro</p>
            </div>
            <Button onClick={fetchAnalytics} variant="outline">
              Refresh Data
            </Button>
          </div>
        </div>

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Monthly Revenue */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  ${analytics.monthlyRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-text-secondary">
                  Recurring revenue from active subscriptions
                </p>
              </CardContent>
            </Card>

            {/* Total Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {analytics.totalUsers.toLocaleString()}
                </div>
                <p className="text-xs text-text-secondary">
                  All registered nurses on platform
                </p>
              </CardContent>
            </Card>

            {/* Active Subscriptions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <UserCheck className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {analytics.activeSubscriptions.toLocaleString()}
                </div>
                <p className="text-xs text-text-secondary">
                  Paying customers ($29 & $49 plans)
                </p>
              </CardContent>
            </Card>

            {/* Trial Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trial Users</CardTitle>
                <UserX className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {analytics.trialUsers.toLocaleString()}
                </div>
                <p className="text-xs text-text-secondary">
                  Users in free trial period
                </p>
              </CardContent>
            </Card>

            {/* Conversion Rate */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {analytics.conversionRate}%
                </div>
                <p className="text-xs text-text-secondary">
                  Trial to paid conversion rate
                </p>
              </CardContent>
            </Card>

            {/* Churn Rate */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {analytics.churnRate}%
                </div>
                <p className="text-xs text-text-secondary">
                  Users who haven't converted to paid
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Revenue Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <div>
                    <div className="font-semibold text-success">Essential Plan</div>
                    <div className="text-sm text-text-secondary">$29/month • 14-day trial</div>
                  </div>
                  <div className="text-lg font-bold text-success">$29</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                  <div>
                    <div className="font-semibold text-primary">Professional Plan</div>
                    <div className="text-sm text-text-secondary">$49/month • 3-day trial</div>
                  </div>
                  <div className="text-lg font-bold text-primary">$49</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Current MRR:</span>
                  <span className="font-semibold">${analytics?.monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Projected Annual:</span>
                  <span className="font-semibold">${((analytics?.monthlyRevenue || 0) * 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Avg Revenue Per User:</span>
                  <span className="font-semibold">
                    ${analytics?.activeSubscriptions ? Math.round((analytics.monthlyRevenue / analytics.activeSubscriptions)) : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}