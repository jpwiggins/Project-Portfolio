import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export function PricingTiers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Starter Tier */}
      <Card className="border-2 border-slate-200 hover:border-blue-300 transition-colors bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Starter</CardTitle>
          <div className="text-3xl font-bold text-slate-900 mt-2">$9.99</div>
          <p className="text-slate-600">Per analysis</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Complete buyer profile</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Design recommendations</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">SEO optimization</span>
            </li>
          </ul>
          <div className="flex justify-center">
            <div dangerouslySetInnerHTML={{
              __html: `
                <stripe-buy-button
                  buy-button-id="buy_btn_1RlfUOBlupvf8Jxw46F96i6T"
                  publishable-key="pk_live_51RagoSBlupvf8JxwMmt3eNsJzQJZFhkIR32grr3fOj2siLuK7GYNXUf4Bj2jp5QKEMuq8L2cTmQpDPsNlVBBDx5Q00YTWgQIWg"
                >
                </stripe-buy-button>
              `
            }} />
          </div>
        </CardContent>
      </Card>

      {/* Professional Tier */}
      <Card className="border-2 border-blue-500 hover:border-blue-600 transition-colors bg-white relative">
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
          Most Popular
        </Badge>
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Professional</CardTitle>
          <div className="text-3xl font-bold text-slate-900 mt-2">$19.99</div>
          <p className="text-slate-600">Per analysis</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Everything in Starter</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Profit analysis</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Marketing calendar</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Trending insights</span>
            </li>
          </ul>
          <div className="flex justify-center">
            <div dangerouslySetInnerHTML={{
              __html: `
                <stripe-buy-button
                  buy-button-id="buy_btn_1RlfWbBlupvf8JxwMZjek0wD"
                  publishable-key="pk_live_51RagoSBlupvf8JxwMmt3eNsJzQJZFhkIR32grr3fOj2siLuK7GYNXUf4Bj2jp5QKEMuq8L2cTmQpDPsNlVBBDx5Q00YTWgQIWg"
                >
                </stripe-buy-button>
              `
            }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}