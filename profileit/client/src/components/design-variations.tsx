import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Palette, Shuffle, Star, Copy, Zap, Heart } from "lucide-react";
import type { BuyerProfile } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface DesignVariationsProps {
  profile: BuyerProfile;
}

export function DesignVariations({ profile }: DesignVariationsProps) {
  const { toast } = useToast();

  const generateDesignVariations = () => {
    return [
      {
        category: "Text-Based Designs",
        variations: [
          {
            name: "Minimalist Quote",
            description: `Simple, clean typography with ${profile.niche} wisdom`,
            salesPotential: "High",
            difficulty: "Easy",
            example: `"${profile.niche} Life" in elegant serif font`
          },
          {
            name: "Funny Saying",
            description: `Humorous take on ${profile.niche} lifestyle`,
            salesPotential: "Very High",
            difficulty: "Easy",
            example: `"I Run on ${profile.niche} and Good Vibes"`
          },
          {
            name: "Motivational Statement",
            description: `Inspiring message for ${profile.niche} enthusiasts`,
            salesPotential: "High",
            difficulty: "Easy",
            example: `"Powered by ${profile.niche} Energy"`
          }
        ]
      },
      {
        category: "Visual + Text Combo",
        variations: [
          {
            name: "Icon + Text",
            description: `Simple icon paired with ${profile.niche} text`,
            salesPotential: "High",
            difficulty: "Medium",
            example: `Heart icon + "${profile.niche} Lover"`
          },
          {
            name: "Badge Style",
            description: `Vintage badge design with ${profile.niche} theme`,
            salesPotential: "Medium",
            difficulty: "Medium",
            example: `Circular badge: "Est. 2024 ${profile.niche} Club"`
          },
          {
            name: "Banner Design",
            description: `Ribbon banner with ${profile.niche} messaging`,
            salesPotential: "Medium",
            difficulty: "Medium",
            example: `Ribbon banner: "Proud ${profile.niche} Mom"`
          }
        ]
      },
      {
        category: "Lifestyle Designs",
        variations: [
          {
            name: "Silhouette Art",
            description: `${profile.niche} activity silhouettes`,
            salesPotential: "High",
            difficulty: "Hard",
            example: `Silhouette of ${profile.niche} activity with sunset`
          },
          {
            name: "Pattern Design",
            description: `Repeating pattern of ${profile.niche} elements`,
            salesPotential: "Medium",
            difficulty: "Hard",
            example: `Small repeating ${profile.niche} icons pattern`
          },
          {
            name: "Watercolor Style",
            description: `Artistic watercolor ${profile.niche} theme`,
            salesPotential: "Medium",
            difficulty: "Hard",
            example: `Watercolor splash with ${profile.niche} elements`
          }
        ]
      },
      {
        category: "Seasonal Variations",
        variations: [
          {
            name: "Holiday Themed",
            description: `${profile.niche} meets holiday celebrations`,
            salesPotential: "Very High",
            difficulty: "Medium",
            example: `"${profile.niche} Christmas" with festive elements`
          },
          {
            name: "Summer Vibes",
            description: `${profile.niche} with summer energy`,
            salesPotential: "High",
            difficulty: "Medium",
            example: `"Summer ${profile.niche} Vibes" with sun/beach elements`
          },
          {
            name: "Back to School",
            description: `${profile.niche} student/teacher themes`,
            salesPotential: "High",
            difficulty: "Medium",
            example: `"${profile.niche} Student Life" with school elements`
          }
        ]
      }
    ];
  };

  const designVariations = generateDesignVariations();

  const copyDesignVariations = () => {
    const variationData = {
      niche: profile.niche,
      productType: profile.productType,
      designVariations: designVariations,
      recommendedStartingPoints: [
        "Start with text-based designs (easiest to create)",
        "Focus on funny sayings for highest sales potential",
        "Create seasonal variations for holiday rushes",
        "Test minimalist quotes for broad appeal"
      ]
    };
    
    navigator.clipboard.writeText(JSON.stringify(variationData, null, 2));
    toast({
      title: "Design variations copied!",
      description: "Complete design strategy copied to clipboard",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSalesPotentialColor = (potential: string) => {
    switch (potential) {
      case "Very High": return "bg-emerald-100 text-emerald-800";
      case "High": return "bg-blue-100 text-blue-800";
      case "Medium": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSalesPotentialIcon = (potential: string) => {
    switch (potential) {
      case "Very High": return <Zap className="h-4 w-4" />;
      case "High": return <Star className="h-4 w-4" />;
      case "Medium": return <Heart className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-slate-900">
          <Palette className="text-orange-600 mr-3 h-6 w-6" />
          Design Variations & Product Ideas
        </CardTitle>
        <p className="text-slate-600">
          Expand your product line with these proven design variations for {profile.niche} {profile.productType}s.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {designVariations.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-lg p-4 border border-orange-100">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Shuffle className="h-5 w-5 mr-2 text-orange-600" />
              {category.category}
            </h3>
            <div className="space-y-3">
              {category.variations.map((variation, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 mb-1">{variation.name}</div>
                      <div className="text-sm text-slate-600 mb-2">{variation.description}</div>
                      <div className="text-xs text-slate-500 italic">
                        Example: {variation.example}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1 ml-4">
                      <Badge className={`${getSalesPotentialColor(variation.salesPotential)} flex items-center space-x-1`}>
                        {getSalesPotentialIcon(variation.salesPotential)}
                        <span>{variation.salesPotential}</span>
                      </Badge>
                      <Badge className={getDifficultyColor(variation.difficulty)}>
                        {variation.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Start Guide */}
        <div className="bg-white rounded-lg p-4 border border-orange-100">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-orange-600" />
            Quick Start Strategy
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-green-800">1</span>
              </div>
              <div>
                <div className="font-medium text-slate-900">Start with Text-Based Designs</div>
                <div className="text-sm text-slate-600">
                  Easy to create, high conversion rates. Focus on funny sayings and motivational quotes.
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-800">2</span>
              </div>
              <div>
                <div className="font-medium text-slate-900">Test Market Response</div>
                <div className="text-sm text-slate-600">
                  Launch 3-5 variations and measure which styles resonate most with your audience.
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-purple-800">3</span>
              </div>
              <div>
                <div className="font-medium text-slate-900">Scale Successful Designs</div>
                <div className="text-sm text-slate-600">
                  Once you identify winning designs, create seasonal variations and expand to other products.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <div className="flex justify-center">
          <Button onClick={copyDesignVariations} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Copy className="h-4 w-4 mr-2" />
            Copy Design Variations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}