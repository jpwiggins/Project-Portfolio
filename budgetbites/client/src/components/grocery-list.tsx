import { useState } from "react";
import { ShoppingCart, List, FileText, Mail, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type GroceryCategory } from "@shared/schema";

interface GroceryListProps {
  groceryList: GroceryCategory[];
  totalCost: number;
  onDownloadPDF: () => void;
  onEmailList: () => void;
  onShareList: () => void;
}

export function GroceryList({ 
  groceryList, 
  totalCost, 
  onDownloadPDF, 
  onEmailList, 
  onShareList 
}: GroceryListProps) {
  const [viewMode, setViewMode] = useState<'category' | 'list'>('category');

  const iconMap: { [key: string]: string } = {
    'apple-alt': '🍎',
    'drumstick-bite': '🍗',
    'cheese': '🧀',
    'box': '📦',
    'snowflake': '❄️',
  };

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            <ShoppingCart className="inline mr-2 h-5 w-5 text-primary" />
            Grocery List
          </h3>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              Total: <span className="font-semibold" data-testid="text-grocery-total">
                ${totalCost.toFixed(2)}
              </span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'category' ? 'list' : 'category')}
              data-testid="button-toggle-view"
            >
              <List className="mr-1 h-4 w-4" />
              Toggle View
            </Button>
          </div>
        </div>

        {viewMode === 'category' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groceryList.map((category, index) => (
              <GroceryCategoryCard key={index} category={category} iconMap={iconMap} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {groceryList.flatMap(category => 
              category.items.map((item, index) => (
                <div key={`${category.name}-${index}`} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">{item.name} ({item.quantity})</span>
                  <span className="font-medium">${item.cost.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button
            onClick={onDownloadPDF}
            className="flex-1 bg-primary text-white hover:bg-primary/90"
            data-testid="button-download-pdf"
          >
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={onEmailList}
            className="flex-1"
            data-testid="button-email-list"
          >
            <Mail className="mr-2 h-4 w-4" />
            Email List
          </Button>
          <Button
            variant="outline"
            onClick={onShareList}
            className="flex-1"
            data-testid="button-share-list"
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function GroceryCategoryCard({ 
  category, 
  iconMap 
}: { 
  category: GroceryCategory; 
  iconMap: { [key: string]: string }; 
}) {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
        <span className="mr-2">{iconMap[category.icon] || '📦'}</span>
        {category.name}
      </h4>
      <ul className="space-y-2 text-sm">
        {category.items.map((item, index) => (
          <li key={index} className="flex justify-between items-center">
            <span className="text-gray-700" data-testid={`text-item-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
              {item.name} ({item.quantity})
            </span>
            <span className="font-medium" data-testid={`text-cost-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
              ${item.cost.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
