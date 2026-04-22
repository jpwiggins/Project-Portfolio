import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BuyerProfile as BuyerProfileType, ProfileData } from "@shared/schema";

interface BuyerProfileProps {
  profile: BuyerProfileType;
}

export function BuyerProfile({ profile }: BuyerProfileProps) {
  const { toast } = useToast();
  const profileData = profile.profileData as ProfileData;

  const copyProfile = () => {
    const profileText = `Buyer Profile: ${profile.niche}\n\nCore Demographics:\n${profileData.coreDemographics}\n\nDaily Life & Routines:\n${profileData.dailyLife}\n\nAnimal/Archetype Identity:\n${profileData.archetype}\n\nGeographic Insights:\n${profileData.geographic}\n\nCross-Niche Passions:\n${profileData.crossNiche}\n\nLanguage & Slang:\n${profileData.language}\n\nWork Life Snapshot:\n${profileData.workLife}\n\nFood & Drink Culture:\n${profileData.foodCulture}\n\nValues & Emotional Drivers:\n${profileData.values}`;
    
    navigator.clipboard.writeText(profileText);
    toast({
      title: "Profile Copied!",
      description: "Buyer profile has been copied to your clipboard.",
    });
  };

  const categories = [
    {
      title: "Core Demographics",
      content: profileData.coreDemographics,
      icon: "👤",
      color: "border-primary",
    },
    {
      title: "Daily Life & Routines", 
      content: profileData.dailyLife,
      icon: "🕐",
      color: "border-secondary",
    },
    {
      title: "Animal/Archetype Identity",
      content: profileData.archetype,
      icon: "🎭",
      color: "border-green-500",
    },
    {
      title: "Geographic Insights",
      content: profileData.geographic,
      icon: "📍",
      color: "border-purple-500",
    },
    {
      title: "Cross-Niche Passions",
      content: profileData.crossNiche,
      icon: "💖",
      color: "border-pink-500",
    },
    {
      title: "Language & Slang",
      content: profileData.language,
      icon: "💬",
      color: "border-orange-500",
    },
    {
      title: "Work Life Snapshot",
      content: profileData.workLife,
      icon: "💼",
      color: "border-teal-500",
    },
    {
      title: "Food & Drink Culture",
      content: profileData.foodCulture,
      icon: "🍽️",
      color: "border-green-500",
    },
    {
      title: "Values & Emotional Drivers",
      content: profileData.values,
      icon: "⭐",
      color: "border-red-500",
    },
  ];

  return (
    <Card className="bg-white shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-secondary px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Buyer Profile: {profile.niche}
            </h2>
            <p className="text-blue-100">Comprehensive 9-category buyer persona</p>
          </div>
          <Button 
            onClick={copyProfile}
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>
      
      <CardContent className="p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div key={index} className={`border-l-4 ${category.color} pl-6`}>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <span className="mr-2 text-xl">{category.icon}</span>
                {category.title}
              </h3>
              <div className="text-slate-700 whitespace-pre-wrap">
                {category.content}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
