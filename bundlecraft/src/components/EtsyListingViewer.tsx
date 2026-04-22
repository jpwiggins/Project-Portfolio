import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, Package, Tags, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EtsyListingViewerProps {
  bundle: {
    id: number;
    name: string;
    bundlePrice: string;
    originalPrice: string;
    discountPercentage: string;
    etsyDescription: string;
    etsyListingData: string;
    productSkus: Array<{
      productId: number;
      printifyId: string;
      sku: string;
      title: string;
      price: string;
      variants: any[];
    }>;
    variantDetails: Array<{
      productId: number;
      productTitle: string;
      variantId: string;
      sku: string;
      title: string;
      price: string;
      size: string;
      color: string;
      material: string;
      availability: string;
    }>;
    seoTags: string[];
    seoTitle: string;
    seoDescription: string;
  };
}

export function EtsyListingViewer({ bundle }: EtsyListingViewerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("description");

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please manually select and copy the text",
        variant: "destructive",
      });
    }
  };

  const formatSkuCsv = () => {
    if (!bundle.variantDetails || bundle.variantDetails.length === 0) return "No variant data available";
    
    return `ETSY SKU SETUP - ${bundle.name}
Bundle Price: $${bundle.bundlePrice}

STEP 1: Create variations in Etsy
Size Options: ${Array.from(new Set(bundle.variantDetails.map(v => v.size))).join(', ')}
Color Options: ${Array.from(new Set(bundle.variantDetails.map(v => v.color))).join(', ')}

STEP 2: Copy/paste each SKU exactly as shown:
${bundle.variantDetails.map(variant => 
  `SKU: ${variant.sku} | Price: $${bundle.bundlePrice} | Qty: 999 | ${variant.size} - ${variant.color}`
).join('\n')}

STEP 3: Download mockup images from these Printify products:
${Array.from(new Set(bundle.variantDetails.map(v => v.productTitle))).map((title, i) => `${i+1}. ${title}`).join('\n')}

STEP 4: Upload images to Etsy and link to corresponding variants
⚠️  Maximum 10 images per Etsy listing`;
  };

  const formatPricingBreakdown = () => {
    const savings = parseFloat(bundle.originalPrice) - parseFloat(bundle.bundlePrice);
    const discountPercentage = bundle.discountPercentage;
    
    return `BUNDLE PRICING BREAKDOWN
Bundle Name: ${bundle.name}
Bundle Price: $${bundle.bundlePrice}
Original Total: $${bundle.originalPrice}
Your Savings: $${savings.toFixed(2)} (${discountPercentage}% OFF)
Number of Products: ${bundle.productSkus?.length || 0}
Total Variants: ${bundle.variantDetails?.length || 0}

INDIVIDUAL PRODUCT SKUS:
${bundle.productSkus?.map(product => 
  `${product.sku} - ${product.title} - $${product.price}`
).join('\n') || 'No SKU data available'}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View Etsy Listing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Complete Etsy Listing Data - {bundle.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="skus">SKUs & Variants</TabsTrigger>
            <TabsTrigger value="seo">SEO Data</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Professional Etsy Description</CardTitle>
                  <Button 
                    onClick={() => copyToClipboard(bundle.etsyDescription, "Etsy description")}
                    size="sm"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Description
                  </Button>
                </div>
                <CardDescription>Ready to paste into your Etsy listing</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border max-h-96 overflow-y-auto">
                  {bundle.etsyDescription}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skus" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Complete SKU List</CardTitle>
                    <Button 
                      onClick={() => copyToClipboard(formatSkuCsv(), "SKU data")}
                      size="sm"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy CSV
                    </Button>
                  </div>
                  <CardDescription>
                    {bundle.variantDetails?.length || 0} variants ready for Etsy inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-50 p-3 rounded border max-h-64 overflow-y-auto">
                    {formatSkuCsv()}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Complete Listing Data</CardTitle>
                    <Button 
                      onClick={() => copyToClipboard(bundle.etsyListingData || "", "complete listing")}
                      size="sm"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All
                    </Button>
                  </div>
                  <CardDescription>Full breakdown with pricing and variants</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-50 p-3 rounded border max-h-64 overflow-y-auto">
                    {bundle.etsyListingData || "No listing data available"}
                  </pre>
                </CardContent>
              </Card>
            </div>

            {bundle.variantDetails && bundle.variantDetails.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Variant Details</CardTitle>
                  <CardDescription>Individual variant information for inventory setup</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {bundle.variantDetails.slice(0, 10).map((variant, index) => (
                      <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                        <div>
                          <span className="font-medium">{variant.sku}</span>
                          <span className="ml-2 text-gray-600">{variant.title}</span>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">${variant.price}</Badge>
                          <Badge variant="secondary">{variant.size}</Badge>
                          <Badge variant="secondary">{variant.color}</Badge>
                        </div>
                      </div>
                    ))}
                    {bundle.variantDetails.length > 10 && (
                      <p className="text-sm text-gray-500 text-center">
                        + {bundle.variantDetails.length - 10} more variants...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Tags className="w-4 h-4" />
                      SEO Tags
                    </CardTitle>
                    <Button 
                      onClick={() => copyToClipboard(bundle.seoTags?.join(', ') || "", "SEO tags")}
                      size="sm"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Tags
                    </Button>
                  </div>
                  <CardDescription>Optimized for Etsy search (max 13 tags)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {bundle.seoTags?.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    )) || <p className="text-gray-500">No SEO tags available</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO Metadata</CardTitle>
                  <CardDescription>Title and description optimized for search</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">SEO Title (60 chars)</label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm bg-gray-50 p-2 rounded flex-1">
                        {bundle.seoTitle || "No SEO title"}
                      </p>
                      <Button 
                        onClick={() => copyToClipboard(bundle.seoTitle || "", "SEO title")}
                        size="sm"
                        variant="ghost"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">SEO Description (160 chars)</label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm bg-gray-50 p-2 rounded flex-1">
                        {bundle.seoDescription || "No SEO description"}
                      </p>
                      <Button 
                        onClick={() => copyToClipboard(bundle.seoDescription || "", "SEO description")}
                        size="sm"
                        variant="ghost"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Pricing Breakdown
                  </CardTitle>
                  <Button 
                    onClick={() => copyToClipboard(formatPricingBreakdown(), "pricing breakdown")}
                    size="sm"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Pricing
                  </Button>
                </div>
                <CardDescription>Complete pricing information for your records</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-50 p-4 rounded border">
                  {formatPricingBreakdown()}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}