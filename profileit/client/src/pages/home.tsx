import { useState, useEffect } from "react";
import { InputForm } from "@/components/input-form";
import { BuyerProfile } from "@/components/buyer-profile";
import { DesignRecommendations } from "@/components/design-recommendations";
import { SeoOptimization } from "@/components/seo-optimization";
import { TrendingInsights } from "@/components/trending-insights";
import { ProfitAnalysis } from "@/components/profit-analysis";
import { MarketingCalendar } from "@/components/marketing-calendar";
import { DesignVariations } from "@/components/design-variations";
import { PricingModal } from "@/components/pricing-modal-new";
import { ChartLine, Lightbulb, CreditCard, Sparkles } from "lucide-react";
import profylixLogo from "@assets/Screenshot (1138)_1754275169435.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BuyerProfile as BuyerProfileType } from "@shared/schema";

export default function Home() {
  const [generatedProfile, setGeneratedProfile] = useState<BuyerProfileType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [userCredits, setUserCredits] = useState(0); // Demo credits - in production would come from user auth
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Check if user is admin on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/admin-status");
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, []);

  const handleProfileGenerated = (profile: BuyerProfileType) => {
    setGeneratedProfile(profile);
    setIsGenerating(false);
  };

  const handleGenerationStart = () => {
    setIsGenerating(true);
    setGeneratedProfile(null);
  };

  const handleGenerationError = () => {
    setIsGenerating(false);
  };

  const handlePurchaseCredits = async (credits: number, amount: number) => {
    try {
      // Create payment intent
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount,
        credits
      });
      const { clientSecret } = await response.json();

      // Simulate successful payment for demo
      await apiRequest("POST", "/api/payment-success", {
        paymentIntentId: clientSecret,
        credits
      });

      // Update user credits (in production, this would be handled by webhook)
      setUserCredits(prev => prev + credits);
      setShowPricing(false);
      
      toast({
        title: "Credits Purchased!",
        description: `Successfully added ${credits} credits to your account.`,
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/30 shadow-lg">
                <img 
                  src={profylixLogo} 
                  alt="ProFylix Logo" 
                  className="h-20 w-auto"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!isAdmin && (
                <Button 
                  onClick={() => setShowPricing(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                  size="sm"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Get Full Access
                </Button>
              )}
              {isAdmin && (
                <Badge className="bg-green-500 text-white">
                  Admin Access
                </Badge>
              )}
              <Button 
                onClick={async () => {
                  try {
                    await apiRequest("POST", "/api/logout");
                    window.location.href = '/';
                  } catch (error) {
                    console.error("Logout error:", error);
                    window.location.href = '/';
                  }
                }}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm"
              >
                Logout
              </Button>
              <div className="hidden md:flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/20">
                <span className="text-sm text-white font-medium">Powered by AI</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <InputForm 
          onProfileGenerated={handleProfileGenerated}
          onGenerationStart={handleGenerationStart}
          onGenerationError={handleGenerationError}
          isGenerating={isGenerating}
          isAdmin={isAdmin}
        />

        {(generatedProfile || isGenerating) && (
          <div className="space-y-8 mt-8">
            {isGenerating && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg border border-blue-200 p-8">
                <div className="flex items-center justify-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/30 border-t-white"></div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg">Generating your buyer profile...</p>
                    <p className="text-blue-100 text-sm">AI is analyzing market data and creating insights</p>
                  </div>
                </div>
                <div className="mt-6 bg-white/20 rounded-lg h-2 overflow-hidden">
                  <div className="bg-white h-full w-1/3 animate-pulse rounded-lg"></div>
                </div>
              </div>
            )}

            {generatedProfile && (
              <>
                <BuyerProfile profile={generatedProfile} />
                <DesignRecommendations profile={generatedProfile} />
                
                {/* SEO and Trending Features */}
                <SeoOptimization profile={generatedProfile} />
                <TrendingInsights profile={generatedProfile} />
                
                {/* Profit Analysis */}
                <ProfitAnalysis profile={generatedProfile} />
                
                {/* Marketing Calendar */}
                <MarketingCalendar profile={generatedProfile} />
                
                {/* Design Variations */}
                <DesignVariations profile={generatedProfile} />
                
                {/* Export Options */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl shadow-lg border border-emerald-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <Lightbulb className="text-emerald-500 mr-3 h-6 w-6" />
                    Export & Save Your Results
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm">Save your buyer profile and design recommendations for future reference</p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => {
                        const content = `Buyer Profile for ${generatedProfile.niche}\n\n${JSON.stringify(generatedProfile.profileData, null, 2)}\n\nDesign Recommendations:\n${JSON.stringify(generatedProfile.designRecommendations, null, 2)}`;
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `buyer-profile-${generatedProfile.niche.replace(/\s+/g, '-').toLowerCase()}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                    >
                      <span>📄</span>
                      <span>Export Text File</span>
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify({
                          niche: generatedProfile.niche,
                          productType: generatedProfile.productType,
                          profileData: generatedProfile.profileData,
                          designRecommendations: generatedProfile.designRecommendations
                        }, null, 2));
                        toast({
                          title: "Copied to clipboard!",
                          description: "Profile data copied as JSON format",
                        });
                      }}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                    >
                      <span>💾</span>
                      <span>Copy to Clipboard</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="mb-2 text-white font-medium">© 2024 DesignScout. Stop guessing, start selling.</p>
            <p className="text-slate-300 text-sm">AI-Powered POD Intelligence • Buyer Profiles • Profit Analysis • Marketing Calendar • Design Variations</p>
          </div>
        </div>
      </footer>
      
      {/* Pricing Modal */}
      <PricingModal 
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        onPurchase={handlePurchaseCredits}
      />
    </div>
  );
}
