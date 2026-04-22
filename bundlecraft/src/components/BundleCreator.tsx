import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import type { Product, InsertBundle } from "@shared/schema";

interface BundleCreatorProps {
  products: Product[];
  selectedProducts: number[];
  onSelectionChange: (products: number[]) => void;
}

export default function BundleCreator({ products, selectedProducts, onSelectionChange }: BundleCreatorProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discountPercentage: "15",
    bundlePrice: "",
  });
  const [localSelectedProducts, setLocalSelectedProducts] = useState<number[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createBundleMutation = useMutation({
    mutationFn: async (bundleData: Omit<InsertBundle, "userId">) => {
      const response = await apiRequest("POST", "/api/bundles", bundleData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bundles"] });
      toast({
        title: "Success",
        description: "Bundle created successfully!",
      });
      setOpen(false);
      setFormData({ name: "", description: "", discountPercentage: "15", bundlePrice: "" });
      setLocalSelectedProducts([]);
      onSelectionChange([]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productsToBundle = localSelectedProducts.length > 0 ? localSelectedProducts : selectedProducts;
    
    if (productsToBundle.length < 2 || productsToBundle.length > 10) {
      toast({
        title: "Invalid Selection",
        description: "Please select between 2 and 10 products for bundling.",
        variant: "destructive",
      });
      return;
    }

    createBundleMutation.mutate({
      ...formData,
      productIds: productsToBundle,
      discountPercentage: formData.discountPercentage || "0",
      bundlePrice: formData.bundlePrice || undefined,
      status: "active",
    });
  };

  const calculateTotalPrice = () => {
    const productsToCalculate = localSelectedProducts.length > 0 ? localSelectedProducts : selectedProducts;
    return products
      .filter(p => productsToCalculate.includes(p.id))
      .reduce((sum, product) => sum + parseFloat(product.price), 0);
  };

  const calculateBundlePrice = () => {
    const total = calculateTotalPrice();
    const discount = parseFloat(formData.discountPercentage || "0");
    return total * (1 - discount / 100);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Bundle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Bundle</DialogTitle>
          <DialogDescription>
            Select 2-10 products and set your bundle pricing to create a new bundle.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Bundle Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter bundle name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Bundle Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your bundle (optional - SEO description will be auto-generated)..."
              className="h-24"
            />
            <p className="text-sm text-muted-foreground mt-1">
              ✨ SEO title, description, and Etsy tags will be automatically generated
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount">Discount Percentage</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                placeholder="15"
              />
            </div>
            <div>
              <Label htmlFor="price">Bundle Price Override</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.bundlePrice}
                onChange={(e) => setFormData({ ...formData, bundlePrice: e.target.value })}
                placeholder={`$${calculateBundlePrice().toFixed(2)}`}
              />
            </div>
          </div>

          <div>
            <Label>Select Products (2-10)</Label>
            <ScrollArea className="h-48 border border-gray-300 rounded-lg p-3 mt-2">
              <div className="space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3">
                    <Checkbox
                      checked={localSelectedProducts.includes(product.id) || 
                               (localSelectedProducts.length === 0 && selectedProducts.includes(product.id))}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setLocalSelectedProducts([...localSelectedProducts, product.id]);
                        } else {
                          setLocalSelectedProducts(localSelectedProducts.filter(id => id !== product.id));
                        }
                      }}
                    />
                    <span className="text-sm flex-1">{product.title}</span>
                    <span className="text-sm text-gray-600">${product.price}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Smart Pricing Preview */}
            {(localSelectedProducts.length > 0 || selectedProducts.length > 0) && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Smart Pricing Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span>${calculateTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount ({formData.discountPercentage}%):</span>
                    <span className="text-green-600">
                      -${(calculateTotalPrice() - calculateBundlePrice()).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Bundle Price:</span>
                    <span>${(formData.bundlePrice ? parseFloat(formData.bundlePrice) : calculateBundlePrice()).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createBundleMutation.isPending}
            >
              {createBundleMutation.isPending ? "Creating..." : "Create Bundle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
