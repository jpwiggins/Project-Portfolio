import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, DollarSign, Target, Copy } from "lucide-react";
import type { BuyerProfile } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface TrendingInsightsProps {
  profile: BuyerProfile;
}

export function TrendingInsights({ profile }: TrendingInsightsProps) {
  const { toast } = useToast();
  const trendingData = profile.designRecommendations.trendingInsights;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: `${type} copied successfully`,
    });
  };

  const getPotentialColor = (potential: 'High' | 'Medium' | 'Low') => {
    switch (potential) {
      case 'High':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const copyAllTrendingData = () => {
    const allData = JSON.stringify(trendingData, null, 2);
    navigator.clipboard.writeText(allData);
    toast({
      title: "All trending data copied!",
      description: "Complete trending insights copied to clipboard",
    });
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-slate-900">
          <TrendingUp className="text-blue-600 mr-3 h-6 w-6" />
          Trending Insights & Market Intelligence
        </CardTitle>
        <p className="text-slate-600">
          Stay ahead of the competition with current trends, seasonal opportunities, and market analysis.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Trends */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center">
            <TrendingUp className="text-blue-600 mr-2 h-5 w-5" />
            Current Trends
          </h3>
          <div className="grid gap-4">
            {trendingData.currentTrends.map((trend, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-900">{trend.trend}</h4>
                  <Badge className={getPotentialColor(trend.salesPotential)}>
                    {trend.salesPotential} Sales Potential
                  </Badge>
                </div>
                <p className="text-slate-600 text-sm mb-3">{trend.relevance}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(`${trend.trend}: ${trend.relevance}`, "Trend")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Trend
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Opportunities */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center">
            <Calendar className="text-purple-600 mr-2 h-5 w-5" />
            Seasonal Opportunities
          </h3>
          <div className="grid gap-4">
            {trendingData.seasonalOpportunities.map((opportunity, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-900">{opportunity.season}</h4>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                    {opportunity.timing}
                  </Badge>
                </div>
                <p className="text-slate-600 text-sm mb-3">{opportunity.opportunity}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(`${opportunity.season} (${opportunity.timing}): ${opportunity.opportunity}`, "Seasonal Opportunity")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Opportunity
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Analysis */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center">
            <Target className="text-red-600 mr-2 h-5 w-5" />
            Competitor Analysis
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Top Selling Styles */}
            <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
              <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                <span className="mr-2">🎨</span>
                Top Selling Styles
              </h4>
              <div className="space-y-2">
                {trendingData.competitorAnalysis.topSellingStyles.map((style, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{style}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(style, "Style")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Ranges */}
            <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
              <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                <DollarSign className="text-green-600 mr-2 h-4 w-4" />
                Price Ranges
              </h4>
              <div className="space-y-2">
                {trendingData.competitorAnalysis.priceRanges.map((range, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{range}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(range, "Price Range")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Gaps */}
            <div className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm">
              <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                Market Gaps
              </h4>
              <div className="space-y-2">
                {trendingData.competitorAnalysis.marketGaps.map((gap, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{gap}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(gap, "Market Gap")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sales Strategy Summary */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
            <span className="mr-2">💡</span>
            Key Sales Strategy Recommendations
          </h4>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>• Focus on high-potential trends for maximum sales impact</li>
            <li>• Plan seasonal campaigns around identified opportunities</li>
            <li>• Fill market gaps to differentiate from competitors</li>
            <li>• Price competitively within identified ranges</li>
            <li>• Leverage trending styles while maintaining uniqueness</li>
          </ul>
        </div>

        {/* Copy All Button */}
        <div className="pt-4 border-t border-blue-200">
          <Button
            onClick={copyAllTrendingData}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All Trending Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}