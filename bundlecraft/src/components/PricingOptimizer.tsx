import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, Target, BarChart3, DollarSign, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Bundle } from "@shared/schema";

interface PricingOptimizerProps {
  bundle: Bundle;
  onPriceUpdate?: () => void;
}

export default function PricingOptimizer({ bundle, onPriceUpdate }: PricingOptimizerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  const { data: pricingData, isLoading } = useQuery({
    queryKey: [`/api/bundles/${bundle.id}/pricing-analytics`],
    retry: false,
  });

  const analyzePricingMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/bundles/${bundle.id}/analyze-pricing`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/bundles/${bundle.id}/pricing-analytics`] });
      queryClient.invalidateQueries({ queryKey: ["/api/bundles"] });
      toast({
        title: "Pricing Analysis Complete",
        description: "Your bundle pricing has been optimized based on market trends!",
      });
      onPriceUpdate?.();
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Pricing Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentPrice = parseFloat(bundle.bundlePrice || "0");
  const suggestedPrice = parseFloat(bundle.suggestedPrice || "0");
  const optimizationScore = parseFloat(bundle.priceOptimizationScore || "0");
  const hasOptimization = !!(bundle.suggestedPrice && bundle.priceOptimizationScore);

  const getOptimizationColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getOptimizationIcon = (score: number) => {
    if (score >= 90) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  const marketTrends = bundle.marketTrends as any;
  const competitorAnalysis = bundle.competitorAnalysis as any;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Smart Pricing Optimizer
            </CardTitle>
            <CardDescription>
              AI-powered market analysis and pricing recommendations
            </CardDescription>
          </div>
          <Button 
            onClick={() => analyzePricingMutation.mutate()}
            disabled={analyzePricingMutation.isPending}
            size="sm"
          >
            <Zap className="mr-2 h-4 w-4" />
            {analyzePricingMutation.isPending ? "Analyzing..." : "Analyze Pricing"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {hasOptimization ? (
          <>
            {/* Optimization Score */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getOptimizationIcon(optimizationScore)}
                <div>
                  <p className="font-medium">Optimization Score</p>
                  <p className="text-sm text-gray-600">Based on market analysis</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${getOptimizationColor(optimizationScore)}`}>
                  {optimizationScore.toFixed(0)}%
                </p>
                <Progress value={optimizationScore} className="w-20" />
              </div>
            </div>

            {/* Current vs Suggested Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Current Price</span>
                </div>
                <p className="text-2xl font-bold">${currentPrice.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Your current bundle price</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Suggested Price</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">${suggestedPrice.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {suggestedPrice > currentPrice ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        +${(suggestedPrice - currentPrice).toFixed(2)} increase
                      </span>
                    </>
                  ) : suggestedPrice < currentPrice ? (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">
                        -${(currentPrice - suggestedPrice).toFixed(2)} decrease
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-600">Optimal pricing</span>
                  )}
                </div>
              </div>
            </div>

            {/* Market Insights */}
            {marketTrends && (
              <div className="space-y-3">
                <h4 className="font-medium">Market Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Demand Level</p>
                    <Badge variant={marketTrends.demandLevel === "high" ? "default" : "secondary"}>
                      {marketTrends.demandLevel}
                    </Badge>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Market Position</p>
                    <Badge variant={competitorAnalysis?.marketPosition === "below_market" ? "default" : "secondary"}>
                      {competitorAnalysis?.marketPosition?.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Seasonal Factor</p>
                    <span className="text-sm font-medium">
                      {marketTrends.seasonalMultiplier > 1 ? "⬆️ High Season" : "📊 Normal Season"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Trending Tags */}
            {marketTrends?.trendingTags && marketTrends.trendingTags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Trending Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {marketTrends.trendingTags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />
            
            {/* Detailed Analysis Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  View Detailed Market Analysis
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Detailed Pricing Analysis</DialogTitle>
                  <DialogDescription>
                    Complete market analysis and competitive positioning for your bundle
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  <div>
                    <h4 className="font-medium mb-3">Competitive Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Market Position:</strong> {competitorAnalysis?.marketPosition?.replace("_", " ")}</p>
                      <p><strong>Competitive Advantage:</strong> {competitorAnalysis?.competitiveAdvantage?.replace("_", " ")}</p>
                      <p><strong>Market Gap:</strong> ${Math.abs(competitorAnalysis?.marketGap || 0).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Market Trends</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Demand Level:</strong> {marketTrends?.demandLevel}</p>
                      <p><strong>Price Direction:</strong> {marketTrends?.priceDirection}</p>
                      <p><strong>Seasonal Multiplier:</strong> {marketTrends?.seasonalMultiplier}x</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Recommendation</h4>
                    <p className="text-sm text-blue-800">
                      Based on current market conditions, we recommend pricing your bundle at 
                      <strong> ${suggestedPrice.toFixed(2)}</strong> to maximize both competitiveness and profitability.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No Pricing Analysis Yet</h3>
            <p className="text-gray-600 mb-4">
              Get AI-powered pricing recommendations based on market trends and competitor analysis.
            </p>
            <Button 
              onClick={() => analyzePricingMutation.mutate()}
              disabled={analyzePricingMutation.isPending}
            >
              <Zap className="mr-2 h-4 w-4" />
              {analyzePricingMutation.isPending ? "Analyzing..." : "Analyze Pricing"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}