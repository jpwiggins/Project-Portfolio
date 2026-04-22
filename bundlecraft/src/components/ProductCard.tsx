import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelectionChange: (selected: boolean) => void;
}

export default function ProductCard({ product, isSelected, onSelectionChange }: ProductCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={product.imageUrl || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
          alt={product.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelectionChange}
            className="w-5 h-5"
          />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>SKU: {product.sku || "N/A"}</span>
          <Badge variant="secondary">{product.category || "General"}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span className="text-xs">Variants: {(product.variants as any[])?.length || 1}</span>
          <Badge variant="outline" className="text-xs">
            {(product.variants as any[])?.length || 1} SKUs
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${product.price}</span>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
