import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Layers, DollarSign, Percent, Settings, FolderSync, Plus, Copy, Edit, Trash2, ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import BundleCreator from "@/components/BundleCreator";
import BundleCard from "@/components/BundleCard";
import { EtsyListingViewer } from "@/components/EtsyListingViewer";
import type { Product, Bundle } from "@shared/schema";
import bundleCraftLogo from "@/assets/bundlecraft-new-logo.png";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [printifyApiKey, setPrintifyApiKey] = useState("");
  
  // Simple logout handler that works for all users
  const handleLogout = () => {
    // Clear all cached data immediately
    queryClient.clear();
    
    // For admin users, try admin logout first
    if ((user as any)?.id === "admin-user") {
      fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      }).then(() => {
        window.location.href = "/";
      }).catch(() => {
        // If admin logout fails, redirect anyway
        window.location.href = "/";
      });
    } else {
      // For regular users, use standard logout
      window.location.href = "/api/logout";
    }
  };

  // Production mode - authenticated users only

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "Please login to access the dashboard",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  // Simple trial status for badge display
  const isAdmin = (user as any)?.id === "admin-user";
  const hasActiveSubscription = (user as any)?.subscriptionStatus === "active";
  
  // Calculate trial time remaining
  const getTrialHours = () => {
    if (!user || isAdmin) return 0;
    const createdAt = new Date((user as any).createdAt);
    const now = new Date();
    const hoursLeft = Math.max(0, Math.ceil((createdAt.getTime() + 24 * 60 * 60 * 1000 - now.getTime()) / (60 * 60 * 1000)));
    return hoursLeft;
  };
  
  const trialHours = getTrialHours();
  const isTrialExpired = trialHours === 0 && !hasActiveSubscription && !isAdmin;

  // Production mode - authenticated users only

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    retry: false,
  });

  // Fetch bundles
  const { data: bundles = [], isLoading: bundlesLoading } = useQuery<Bundle[]>({
    queryKey: ["/api/bundles"],
    retry: false,
  });

  // Setup Printify API key mutation
  const setupApiKeyMutation = useMutation({
    mutationFn: async (apiKey: string) => {
      await apiRequest("POST", "/api/printify/setup", { apiKey });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Printify API key saved successfully!",
      });
      setApiKeyDialogOpen(false);
      setPrintifyApiKey("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // FolderSync products mutation
  const syncProductsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/products/sync");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: `Synced ${data.count} products successfully!`,
      });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      // Handle Printify API key issues
      if (error.needsNewApiKey) {
        toast({
          title: "API Key Expired",
          description: error.helpText || "Please update your Printify API key",
          variant: "destructive",
          action: (
            <button 
              className="text-destructive-foreground underline underline-offset-4 hover:no-underline"
              onClick={() => setApiKeyDialogOpen(true)}
            >
              Update API Key
            </button>
          ),
        });
        return;
      }
      
      toast({
        title: "Sync Error",
        description: error.helpText || error.message,
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate stats
  const totalProducts = products.length;
  const totalBundles = bundles.length;
  const avgBundleValue = bundles.length > 0 
    ? bundles.reduce((sum, bundle) => sum + parseFloat(bundle.bundlePrice || "0"), 0) / bundles.length 
    : 0;
  const avgDiscount = bundles.length > 0
    ? bundles.reduce((sum, bundle) => sum + parseFloat(bundle.discountPercentage || "0"), 0) / bundles.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={bundleCraftLogo} alt="BundleCraft - The Listing Help for Smart Sellers" className="h-10 w-auto" />
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin ? (
                <Badge variant="destructive">Admin</Badge>
              ) : hasActiveSubscription ? (
                <Badge variant="default">Pro Plan</Badge>
              ) : isTrialExpired ? (
                <Badge variant="destructive">Trial Expired</Badge>
              ) : (
                <Badge variant="secondary">Free Trial ({trialHours}h left)</Badge>
              )}
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(user as any).firstName?.[0] || (user as any).email?.[0] || "U"}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Production Dashboard */}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Bundling Dashboard</h1>
          <p className="mt-2 text-gray-600">The listing help for smart sellers - Import your Printify products and create profitable bundles for Etsy</p>
          
          {/* Trial Status Warning */}
          {!isAdmin && !hasActiveSubscription && isTrialExpired && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-red-800">Free Trial Expired</h3>
                  <p className="text-red-600">Your 24-hour free trial has ended. Subscribe to continue using BundleCraft.</p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => window.open('https://buy.stripe.com/00gaG86VC8YL1aM5km', '_blank')}>
                    Subscribe Monthly ($29.99)
                  </Button>
                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Package className="text-orange-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Imported Products</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                  <p className="text-xs text-gray-500">
                    {products?.reduce((total, product) => total + ((product.variants as any[])?.length || 1), 0)} total variants
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Layers className="text-pink-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Created Bundles</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBundles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="text-purple-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Bundle Value</p>
                  <p className="text-2xl font-bold text-gray-900">${avgBundleValue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Percent className="text-pink-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Discount</p>
                  <p className="text-2xl font-bold text-gray-900">{avgDiscount.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <BundleCreator 
            products={products} 
            selectedProducts={selectedProducts}
            onSelectionChange={setSelectedProducts}
          />
          
          <Button 
            variant="outline" 
            onClick={() => syncProductsMutation.mutate()}
            disabled={syncProductsMutation.isPending}
          >
            <FolderSync className="mr-2 h-4 w-4" />
            {syncProductsMutation.isPending ? "Syncing..." : "FolderSync Products"}
          </Button>

          <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                API Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Printify API Settings</DialogTitle>
                <DialogDescription>
                  Enter your Printify API key to sync your products.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">Printify API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={printifyApiKey}
                    onChange={(e) => setPrintifyApiKey(e.target.value)}
                    placeholder="Enter your Printify API key"
                  />
                </div>
                <Button 
                  onClick={() => setupApiKeyMutation.mutate(printifyApiKey)}
                  disabled={setupApiKeyMutation.isPending || !printifyApiKey}
                  className="w-full"
                >
                  {setupApiKeyMutation.isPending ? "Saving..." : "Save API Key"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="bundles">My Bundles</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {productsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    FolderSync your Printify products to get started with bundling.
                  </p>
                  <Button onClick={() => syncProductsMutation.mutate()}>
                    <FolderSync className="mr-2 h-4 w-4" />
                    FolderSync Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSelected={selectedProducts.includes(product.id)}
                    onSelectionChange={(selected) => {
                      if (selected) {
                        setSelectedProducts([...selectedProducts, product.id]);
                      } else {
                        setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bundles" className="space-y-6">
            {bundlesLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : bundles.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bundles created yet</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first bundle by selecting products and clicking "Create Bundle".
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {bundles.map((bundle) => (
                  <BundleCard key={bundle.id} bundle={bundle} products={products} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bundle Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Analytics coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bundles.slice(0, 3).map((bundle) => (
                      <div key={bundle.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Plus className="text-white text-sm" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Created "{bundle.name}"</p>
                          <p className="text-xs text-gray-600">
                            {new Date(bundle.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Production system - demo features removed */}
      </div>
    </div>
  );
}
