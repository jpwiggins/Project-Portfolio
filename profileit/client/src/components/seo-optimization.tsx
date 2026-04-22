import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Copy, Tag, FileText, Hash } from "lucide-react";
import type { BuyerProfile } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SeoOptimizationProps {
  profile: BuyerProfile;
}

export function SeoOptimization({ profile }: SeoOptimizationProps) {
  const [selectedSlogan, setSelectedSlogan] = useState<string>("");
  const { toast } = useToast();
  
  const seoData = profile.designRecommendations.seoOptimization;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: `${type} copied successfully`,
    });
  };

  const copyAllSeoData = () => {
    const allData = {
      selectedSlogan,
      productTitles: seoData.productTitles,
      descriptions: seoData.descriptions,
      tags: seoData.tags,
      keywords: seoData.keywords
    };
    
    navigator.clipboard.writeText(JSON.stringify(allData, null, 2));
    toast({
      title: "All SEO data copied!",
      description: "Complete SEO optimization data copied to clipboard",
    });
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-slate-900">
          <Search className="text-green-600 mr-3 h-6 w-6" />
          SEO Optimization & Marketing
        </CardTitle>
        <p className="text-slate-600">
          Boost your product visibility and sales with these SEO-optimized titles, descriptions, and tags.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Slogan Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 flex items-center">
            <span className="mr-2">💡</span>
            Select Your Slogan
          </h3>
          <div className="grid gap-2">
            {profile.designRecommendations.slogans.map((slogan, index) => (
              <div
                key={index}
                onClick={() => setSelectedSlogan(slogan)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedSlogan === slogan
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-200 hover:border-green-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{slogan}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(slogan, "Slogan");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Titles */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 flex items-center">
            <FileText className="text-blue-600 mr-2 h-5 w-5" />
            SEO-Optimized Product Titles
          </h3>
          <div className="grid gap-2">
            {seoData.productTitles.map((title, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                <span className="text-slate-800">{title}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(title, "Title")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Product Descriptions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 flex items-center">
            <span className="mr-2">📝</span>
            Product Descriptions
          </h3>
          <div className="grid gap-3">
            {seoData.descriptions.map((description, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-slate-200">
                <p className="text-slate-700 mb-2">{description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(description, "Description")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Description
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 flex items-center">
            <Tag className="text-purple-600 mr-2 h-5 w-5" />
            Product Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {seoData.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer"
                onClick={() => copyToClipboard(tag, "Tag")}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(seoData.tags.join(", "), "All Tags")}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All Tags
          </Button>
        </div>

        {/* Keywords */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 flex items-center">
            <Hash className="text-orange-600 mr-2 h-5 w-5" />
            SEO Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {seoData.keywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100 cursor-pointer"
                onClick={() => copyToClipboard(keyword, "Keyword")}
              >
                {keyword}
              </Badge>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(seoData.keywords.join(", "), "All Keywords")}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All Keywords
          </Button>
        </div>

        {/* Copy All Button */}
        <div className="pt-4 border-t border-green-200">
          <Button
            onClick={copyAllSeoData}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All SEO Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}