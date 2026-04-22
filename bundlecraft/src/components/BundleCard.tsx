import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import PricingOptimizer from "./PricingOptimizer";
import { EtsyListingViewer } from "./EtsyListingViewer";
import { Copy, Edit, Trash2, Eye, BarChart3, Package } from "lucide-react";
import type { Bundle, Product } from "@shared/schema";

interface BundleCardProps {
  bundle: Bundle;
  products: Product[];
}

export default function BundleCard({ bundle, products }: BundleCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showEtsyPreview, setShowEtsyPreview] = useState(false);
  const [showPricingOptimizer, setShowPricingOptimizer] = useState(false);

  const deleteBundleMutation = useMutation({
    mutationFn: async (bundleId: number) => {
      await apiRequest("DELETE", `/api/bundles/${bundleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bundles"] });
      toast({
        title: "Success",
        description: "Bundle deleted successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/";
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

  const bundleProducts = products.filter(p => bundle.productIds.includes(p.id));

  const copyToClipboard = () => {
    if (bundle.etsyDescription) {
      navigator.clipboard.writeText(bundle.etsyDescription);
      toast({
        title: "Copied!",
        description: "Bundle description copied to clipboard",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{bundle.name}</CardTitle>
            <p className="text-sm text-gray-600">
              Created {new Date(bundle.createdAt!).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={bundle.status === "active" ? "default" : "secondary"}>
              {bundle.status === "active" ? "Active" : "Draft"}
            </Badge>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost">
                <Edit className="h-4 w-4" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Pricing Analytics - {bundle.name}</DialogTitle>
                    <DialogDescription>
                      Smart pricing optimization with market trend analysis
                    </DialogDescription>
                  </DialogHeader>
                  <PricingOptimizer bundle={bundle} />
                </DialogContent>
              </Dialog>
              <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => deleteBundleMutation.mutate(bundle.id)}
                disabled={deleteBundleMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Bundle Products ({bundleProducts.length})</h4>
            <div className="space-y-2">
              {bundleProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{product.title}</span>
                  <span className="text-sm text-gray-600">${product.price}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Bundle Pricing</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Original Price:</span>
                <span className="text-sm font-medium">${bundle.originalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Discount ({bundle.discountPercentage}%):</span>
                <span className="text-sm font-medium text-green-600">
                  -${(parseFloat(bundle.originalPrice || "0") - parseFloat(bundle.bundlePrice || "0")).toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Bundle Price:</span>
                <span className="font-bold text-lg">${bundle.bundlePrice}</span>
              </div>
            </div>
          </div>
        </div>
        
        {bundle.description && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-gray-600">{bundle.description}</p>
          </div>
        )}
        
        <Separator className="my-4" />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Etsy Listing Description Ready</span>
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Etsy Listing Description Preview</DialogTitle>
                    <DialogDescription>
                      This is how your bundle description will look on Etsy. Click "Copy Description" to use it in your listing.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <pre className="whitespace-pre-wrap text-sm font-mono">{bundle.etsyDescription}</pre>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={copyToClipboard}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Description
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </Button>
              
              <EtsyListingViewer bundle={bundle as any} />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                ✅ Professional Etsy description generated with SEO keywords, pricing details, and compelling copy ready to paste into your listing!
              </p>
            </div>
            
            {bundle.priceOptimizationScore && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-blue-800">
                    🎯 Pricing optimized with {bundle.priceOptimizationScore}% market score
                  </p>
                  {bundle.suggestedPrice && parseFloat(bundle.suggestedPrice) !== parseFloat(bundle.bundlePrice || "0") && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Suggested: ${bundle.suggestedPrice}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
