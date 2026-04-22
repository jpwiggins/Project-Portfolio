import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Palette, Quote, Camera, Layout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BuyerProfile as BuyerProfileType, DesignRecommendations as DesignRecommendationsType } from "@shared/schema";

interface DesignRecommendationsProps {
  profile: BuyerProfileType;
}

export function DesignRecommendations({ profile }: DesignRecommendationsProps) {
  const { toast } = useToast();
  const designRecs = profile.designRecommendations as DesignRecommendationsType;

  const copyDesignRecs = () => {
    const designText = `Design Recommendations for ${profile.productType}\n\nSlogans:\n${designRecs.slogans.map(s => `• ${s}`).join('\n')}\n\nVisual Ideas:\n${designRecs.visualIdeas.map(v => `• ${v.name}: ${v.description}`).join('\n')}\n\nFonts:\n• Primary: ${designRecs.fonts.primary}\n• Accent: ${designRecs.fonts.accent}\n• Body: ${designRecs.fonts.body}\n\nColors:\n${designRecs.colors.description}\nPalette: ${designRecs.colors.palette.join(', ')}\n\nLayouts:\n${designRecs.layouts.map(l => `• ${l.name}: ${l.description}`).join('\n')}\n\nMockups:\n${designRecs.mockups.map(m => `• ${m.name}: ${m.description} (${m.setting})`).join('\n')}`;
    
    navigator.clipboard.writeText(designText);
    toast({
      title: "Design Recommendations Copied!",
      description: "Design recommendations have been copied to your clipboard.",
    });
  };

  return (
    <Card className="bg-white shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-secondary to-purple-600 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Design Recommendations</h2>
            <p className="text-indigo-100">Product design insights for {profile.productType}</p>
          </div>
          <Button 
            onClick={copyDesignRecs}
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>
      
      <CardContent className="p-8 space-y-8">
        {/* Product Slogans */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Quote className="text-primary mr-3 h-5 w-5" />
            Product Slogans
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {designRecs.slogans.map((slogan, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                <p className="font-medium text-slate-800">"{slogan}"</p>
                <p className="text-sm text-slate-600 mt-1">Emotionally resonant messaging</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Ideas */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Palette className="text-secondary mr-3 h-5 w-5" />
            Visual Ideas & Icons
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {designRecs.visualIdeas.map((visual, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-primary text-xl">{visual.icon.includes('fa-') ? '🎨' : visual.icon}</span>
                </div>
                <p className="font-medium text-slate-800">{visual.name}</p>
                <p className="text-sm text-slate-600 mt-1">{visual.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Design Specifications */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <span className="text-purple-500 mr-3 text-xl">🔤</span>
              Font & Color Suggestions
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-slate-800 mb-2">Typography</p>
                <div className="space-y-1 text-sm text-slate-600">
                  <p><strong>Primary:</strong> {designRecs.fonts.primary}</p>
                  <p><strong>Accent:</strong> {designRecs.fonts.accent}</p>
                  <p><strong>Body:</strong> {designRecs.fonts.body}</p>
                </div>
              </div>
              <div>
                <p className="font-medium text-slate-800 mb-2">Color Palette</p>
                <div className="flex space-x-2 mb-2">
                  {designRecs.colors.palette.map((color, index) => (
                    <div 
                      key={index}
                      className="w-8 h-8 rounded border border-slate-300" 
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))}
                </div>
                <p className="text-sm text-slate-600">{designRecs.colors.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Layout className="text-orange-500 mr-3 h-5 w-5" />
              Design Layout
            </h3>
            <div className="space-y-3">
              {designRecs.layouts.map((layout, index) => (
                <div key={index} className="bg-white p-3 rounded border border-slate-200">
                  <p className="font-medium text-slate-800">{layout.name}</p>
                  <p className="text-sm text-slate-600">{layout.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mockup Suggestions */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Camera className="text-teal-500 mr-3 h-5 w-5" />
            Mockup Suggestions
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {designRecs.mockups.map((mockup, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded mb-3 flex items-center justify-center">
                  <span className="text-slate-400 text-2xl">📸</span>
                </div>
                <p className="font-medium text-slate-800">{mockup.name}</p>
                <p className="text-sm text-slate-600">{mockup.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
