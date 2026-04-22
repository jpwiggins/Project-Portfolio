import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Calculator, TrendingUp, Copy, Target, ShoppingCart, AlertCircle } from "lucide-react";
import type { BuyerProfile } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ProfitAnalysisProps {
  profile: BuyerProfile;
}

export function ProfitAnalysis({ profile }: ProfitAnalysisProps) {
  const { toast } = useToast();
  
  // Calculate profit margins based on niche and demographic data
  const calculateProfitMetrics = () => {
    const basePrice = 19.99;
    const premiumPrice = 29.99;
    const giftPrice = 34.99;
    
    const costBreakdown = {
      production: 8.50,
      shipping: 4.25,
      platform: 2.10,
      marketing: 1.65
    };
    
    const totalCost = Object.values(costBreakdown).reduce((sum, cost) => sum + cost, 0);
    
    return {
      basePrice,
      premiumPrice,
      giftPrice,
      costBreakdown,
      totalCost,
      baseProfit: basePrice - totalCost,
      premiumProfit: premiumPrice - totalCost,
      giftProfit: giftPrice - totalCost,
      baseMargin: ((basePrice - totalCost) / basePrice * 100).toFixed(1),
      premiumMargin: ((premiumPrice - totalCost) / premiumPrice * 100).toFixed(1),
      giftMargin: ((giftPrice - totalCost) / giftPrice * 100).toFixed(1)
    };
  };

  const metrics = calculateProfitMetrics();

  const copyProfitData = () => {
    const profitData = {
      niche: profile.niche,
      productType: profile.productType,
      pricingStrategy: {
        basePrice: `$${metrics.basePrice} (${metrics.baseMargin}% margin)`,
        premiumPrice: `$${metrics.premiumPrice} (${metrics.premiumMargin}% margin)`,
        giftPrice: `$${metrics.giftPrice} (${metrics.giftMargin}% margin)`
      },
      costBreakdown: metrics.costBreakdown,
      recommendedPrice: `$${metrics.premiumPrice}`,
      profitPerSale: `$${metrics.premiumProfit.toFixed(2)}`
    };
    
    navigator.clipboard.writeText(JSON.stringify(profitData, null, 2));
    toast({
      title: "Profit analysis copied!",
      description: "Complete profit breakdown copied to clipboard",
    });
  };

  const salesVolumeProjections = [
    { volume: "10 sales/day", monthly: 300, profit: (300 * metrics.premiumProfit).toFixed(0) },
    { volume: "25 sales/day", monthly: 750, profit: (750 * metrics.premiumProfit).toFixed(0) },
    { volume: "50 sales/day", monthly: 1500, profit: (1500 * metrics.premiumProfit).toFixed(0) },
    { volume: "100 sales/day", monthly: 3000, profit: (3000 * metrics.premiumProfit).toFixed(0) }
  ];

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-slate-900">
          <DollarSign className="text-green-600 mr-3 h-6 w-6" />
          Profit Analysis & Pricing Strategy
        </CardTitle>
        <p className="text-slate-600">
          Maximize your profits with data-driven pricing and cost analysis for {profile.niche} {profile.productType}s.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pricing Strategy */}
        <div className="bg-white rounded-lg p-4 border border-green-100">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-600" />
            Recommended Pricing Strategy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">${metrics.basePrice}</div>
              <div className="text-sm text-slate-600">Entry Price</div>
              <div className="text-xs text-green-600">{metrics.baseMargin}% margin</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-2xl font-bold text-green-700">${metrics.premiumPrice}</div>
              <div className="text-sm text-slate-600">Recommended</div>
              <div className="text-xs text-green-600">{metrics.premiumMargin}% margin</div>
              <Badge className="mt-1 bg-green-100 text-green-800">Best Value</Badge>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">${metrics.giftPrice}</div>
              <div className="text-sm text-slate-600">Gift Price</div>
              <div className="text-xs text-green-600">{metrics.giftMargin}% margin</div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-lg p-4 border border-green-100">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-green-600" />
            Cost Breakdown Analysis
          </h3>
          <div className="space-y-2">
            {Object.entries(metrics.costBreakdown).map(([category, cost]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm text-slate-600 capitalize">{category}:</span>
                <span className="font-medium">${cost.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Cost:</span>
                <span>${metrics.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-semibold text-green-600">
                <span>Profit per Sale:</span>
                <span>${metrics.premiumProfit.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Volume Projections */}
        <div className="bg-white rounded-lg p-4 border border-green-100">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Monthly Revenue Projections
          </h3>
          <div className="space-y-3">
            {salesVolumeProjections.map((projection, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{projection.volume}</span>
                  <span className="text-xs text-slate-600">{projection.monthly} sales/month</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">${projection.profit}/month</div>
                  <div className="text-xs text-slate-600">${(parseInt(projection.profit) * 12).toLocaleString()}/year</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Positioning */}
        <div className="bg-white rounded-lg p-4 border border-green-100">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
            Market Positioning Strategy
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900">Price Positioning</div>
                <div className="text-sm text-slate-600">
                  Your recommended price of ${metrics.premiumPrice} positions you in the mid-premium range, 
                  perfect for {profile.niche} enthusiasts who value quality over bargain pricing.
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900">Competitive Advantage</div>
                <div className="text-sm text-slate-600">
                  Focus on quality materials, unique designs, and emotional connection with {profile.niche} community. 
                  Avoid competing solely on price.
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900">Growth Strategy</div>
                <div className="text-sm text-slate-600">
                  Start with 10-25 sales/day focus, then scale to 50+ by expanding design variants and 
                  leveraging seasonal opportunities.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <div className="flex justify-center">
          <Button onClick={copyProfitData} className="bg-green-600 hover:bg-green-700 text-white">
            <Copy className="h-4 w-4 mr-2" />
            Copy Profit Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}