import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Target, TrendingUp, Copy } from "lucide-react";
import type { BuyerProfile } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface MarketingCalendarProps {
  profile: BuyerProfile;
}

export function MarketingCalendar({ profile }: MarketingCalendarProps) {
  const { toast } = useToast();

  const getCurrentMonth = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[new Date().getMonth()];
  };

  const generateMarketingCalendar = () => {
    const currentMonth = getCurrentMonth();
    
    return [
      {
        month: "January",
        theme: "New Year, New Goals",
        campaigns: [
          { week: "Week 1", focus: "Resolution-themed designs", urgency: "High" },
          { week: "Week 2", focus: "Motivational messaging", urgency: "Medium" },
          { week: "Week 3", focus: "Health & wellness angle", urgency: "Medium" },
          { week: "Week 4", focus: "Progress tracking themes", urgency: "Low" }
        ],
        keyDates: ["New Year's Day", "MLK Day"],
        salesPotential: "High"
      },
      {
        month: "February",
        theme: "Love & Self-Care",
        campaigns: [
          { week: "Week 1", focus: "Self-love messaging", urgency: "High" },
          { week: "Week 2", focus: "Valentine's Day gifts", urgency: "High" },
          { week: "Week 3", focus: "Galentine's Day designs", urgency: "Medium" },
          { week: "Week 4", focus: "Post-Valentine recovery", urgency: "Low" }
        ],
        keyDates: ["Valentine's Day", "Presidents' Day"],
        salesPotential: "Very High"
      },
      {
        month: "March",
        theme: "Spring Renewal",
        campaigns: [
          { week: "Week 1", focus: "Spring cleaning mindset", urgency: "Medium" },
          { week: "Week 2", focus: "St. Patrick's Day themes", urgency: "High" },
          { week: "Week 3", focus: "Spring break energy", urgency: "High" },
          { week: "Week 4", focus: "Easter preparation", urgency: "Medium" }
        ],
        keyDates: ["St. Patrick's Day", "Spring Equinox"],
        salesPotential: "High"
      },
      {
        month: "April",
        theme: "Growth & Renewal",
        campaigns: [
          { week: "Week 1", focus: "April Fool's humor", urgency: "Low" },
          { week: "Week 2", focus: "Easter celebration", urgency: "High" },
          { week: "Week 3", focus: "Earth Day environmental", urgency: "Medium" },
          { week: "Week 4", focus: "Spring activity themes", urgency: "Medium" }
        ],
        keyDates: ["Easter", "Earth Day"],
        salesPotential: "Medium"
      },
      {
        month: "May",
        theme: "Mother's Day & Memorial",
        campaigns: [
          { week: "Week 1", focus: "May Day celebration", urgency: "Low" },
          { week: "Week 2", focus: "Mother's Day gifts", urgency: "Very High" },
          { week: "Week 3", focus: "Graduation season", urgency: "High" },
          { week: "Week 4", focus: "Memorial Day patriotic", urgency: "Medium" }
        ],
        keyDates: ["Mother's Day", "Memorial Day"],
        salesPotential: "Very High"
      },
      {
        month: "June",
        theme: "Summer & Graduation",
        campaigns: [
          { week: "Week 1", focus: "Summer kick-off", urgency: "High" },
          { week: "Week 2", focus: "Father's Day gifts", urgency: "Very High" },
          { week: "Week 3", focus: "Graduation celebrations", urgency: "High" },
          { week: "Week 4", focus: "Summer solstice themes", urgency: "Medium" }
        ],
        keyDates: ["Father's Day", "Summer Solstice"],
        salesPotential: "Very High"
      }
    ];
  };

  const marketingCalendar = generateMarketingCalendar();
  const currentMonth = getCurrentMonth();
  const currentMonthData = marketingCalendar.find(month => month.month === currentMonth);

  const copyMarketingCalendar = () => {
    const calendarData = {
      niche: profile.niche,
      productType: profile.productType,
      currentMonth: currentMonth,
      currentMonthStrategy: currentMonthData,
      fullYearCalendar: marketingCalendar
    };
    
    navigator.clipboard.writeText(JSON.stringify(calendarData, null, 2));
    toast({
      title: "Marketing calendar copied!",
      description: "Complete marketing strategy copied to clipboard",
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Very High": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
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

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-slate-900">
          <Calendar className="text-purple-600 mr-3 h-6 w-6" />
          Marketing Calendar & Campaign Strategy
        </CardTitle>
        <p className="text-slate-600">
          Strategic marketing calendar for {profile.niche} {profile.productType}s with seasonal campaigns and optimal timing.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Month Focus */}
        {currentMonthData && (
          <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-600" />
              {currentMonth} Strategy - "{currentMonthData.theme}"
            </h3>
            <div className="flex items-center justify-between mb-3">
              <Badge className={getSalesPotentialColor(currentMonthData.salesPotential)}>
                {currentMonthData.salesPotential} Sales Potential
              </Badge>
              <div className="text-sm text-slate-600">
                Key Dates: {currentMonthData.keyDates.join(", ")}
              </div>
            </div>
            <div className="space-y-2">
              {currentMonthData.campaigns.map((campaign, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{campaign.week}</span>
                    <span className="text-xs text-slate-600">{campaign.focus}</span>
                  </div>
                  <Badge className={getUrgencyColor(campaign.urgency)}>
                    {campaign.urgency}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6-Month Overview */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            6-Month Marketing Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketingCalendar.slice(0, 6).map((month, index) => (
              <div key={index} className={`p-3 rounded-lg border ${month.month === currentMonth ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">{month.month}</span>
                  <Badge className={getSalesPotentialColor(month.salesPotential)}>
                    {month.salesPotential}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 mb-2">"{month.theme}"</div>
                <div className="text-xs text-slate-500">
                  {month.keyDates.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-purple-600" />
            Immediate Action Items
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium text-slate-900">This Week</div>
                <div className="text-sm text-slate-600">
                  Launch designs focused on {currentMonthData?.campaigns[0]?.focus || "current seasonal themes"}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium text-slate-900">Next 2 Weeks</div>
                <div className="text-sm text-slate-600">
                  Prepare campaigns for {currentMonthData?.keyDates[0] || "upcoming holidays"} with gift-focused messaging
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium text-slate-900">Next Month</div>
                <div className="text-sm text-slate-600">
                  Research and plan designs for {marketingCalendar.find(m => m.month === currentMonth) ? marketingCalendar[marketingCalendar.findIndex(m => m.month === currentMonth) + 1]?.theme : "upcoming seasonal themes"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <div className="flex justify-center">
          <Button onClick={copyMarketingCalendar} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Copy className="h-4 w-4 mr-2" />
            Copy Marketing Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}