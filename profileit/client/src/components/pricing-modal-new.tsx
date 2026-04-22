import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle } from "lucide-react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (credits: number, amount: number) => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            <Sparkles className="h-6 w-6 inline mr-2 text-primary" />
            Choose Your Plan
          </DialogTitle>
          <p className="text-center text-slate-600">
            Transform your POD business with AI-powered buyer insights
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Starter Plan */}
          <Card className="border-2 border-slate-200 hover:border-blue-300 transition-colors">
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

          {/* Professional Plan */}
          <Card className="border-2 border-blue-500 hover:border-blue-600 transition-colors relative">
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

          {/* Enterprise Plan */}
          <Card className="border-2 border-purple-500 hover:border-purple-600 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Enterprise</CardTitle>
              <div className="text-3xl font-bold text-slate-900 mt-2">$39.99</div>
              <p className="text-slate-600">Per analysis</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Everything in Professional</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Design variations (16+ concepts)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Sales volume projections</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>
              <div className="flex justify-center">
                <div dangerouslySetInnerHTML={{
                  __html: `
                    <stripe-buy-button
                      buy-button-id="buy_btn_1RlfY4Blupvf8JxwrpHfY6jn"
                      publishable-key="pk_live_51RagoSBlupvf8JxwMmt3eNsJzQJZFhkIR32grr3fOj2siLuK7GYNXUf4Bj2jp5QKEMuq8L2cTmQpDPsNlVBBDx5Q00YTWgQIWg"
                    >
                    </stripe-buy-button>
                  `
                }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}