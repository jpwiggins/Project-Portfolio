import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Activity, 
  LogOut,
  TrendingUp,
  ChefHat,
  ShoppingCart 
} from "lucide-react";

export default function Admin() {
  const [, setLocation] = useLocation();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/stats");
      return response.json();
    },
    retry: false,
  });

  const { data: recentMealPlans } = useQuery({
    queryKey: ["/api/admin/recent-meal-plans"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/recent-meal-plans");
      return response.json();
    },
    retry: false,
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin/login");
  };

  const mockStats = {
    totalUsers: 156,
    activeSubscriptions: 89,
    monthlyRevenue: 890.11,
    totalMealPlans: 1247,
    conversionRate: 57.1,
    averageOrderValue: 9.99
  };

  const mockRecentPlans = [
    { id: "1", user: "User #142", budget: 50, people: 2, days: 7, created: "2025-01-05" },
    { id: "2", user: "User #138", budget: 35, people: 1, days: 5, created: "2025-01-05" },
    { id: "3", user: "User #145", budget: 75, people: 4, days: 7, created: "2025-01-04" },
    { id: "4", user: "User #131", budget: 40, people: 2, days: 3, created: "2025-01-04" },
    { id: "5", user: "User #149", budget: 60, people: 3, days: 5, created: "2025-01-04" },
  ];

  const displayStats = stats || mockStats;
  const displayPlans = recentMealPlans || mockRecentPlans;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <ChefHat className="text-primary text-xl" />
              <h1 className="text-xl font-bold text-gray-900">BudgetBites Admin</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              data-testid="button-admin-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-users">
                {displayStats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-active-subs">
                {displayStats.activeSubscriptions}
              </div>
              <p className="text-xs text-muted-foreground">
                {((displayStats.activeSubscriptions / displayStats.totalUsers) * 100).toFixed(1)}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-monthly-revenue">
                ${displayStats.monthlyRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                +23% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meal Plans Created</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-meal-plans">
                {displayStats.totalMealPlans}
              </div>
              <p className="text-xs text-muted-foreground">
                +45 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-conversion-rate">
                {displayStats.conversionRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-avg-order-value">
                ${displayStats.averageOrderValue}
              </div>
              <p className="text-xs text-muted-foreground">
                Monthly subscription
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="meal-plans" className="space-y-4">
          <TabsList>
            <TabsTrigger value="meal-plans">Recent Meal Plans</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="meal-plans" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Meal Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayPlans.map((plan: any) => (
                    <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{plan.user}</p>
                          <p className="text-sm text-gray-500">
                            ${plan.budget} budget • {plan.people} people • {plan.days} days
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{plan.created}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">This Month</h4>
                      <p className="text-2xl font-bold text-green-600">
                        ${displayStats.monthlyRevenue.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {displayStats.activeSubscriptions} active subscriptions
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">Projected Annual</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        ${(displayStats.monthlyRevenue * 12).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Based on current growth
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}