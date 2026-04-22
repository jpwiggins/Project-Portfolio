import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (credits: number, amount: number) => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  // Load Stripe script when modal opens
  useEffect(() => {
    if (isOpen && !document.querySelector('script[src*="js.stripe.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, [isOpen]);

  const features = [
    "Unlimited detailed buyer profiles",
    "Complete design recommendations for every profile",
    "Actionable slogans, visual ideas, and color palettes", 
    "Export & copy functionality",
    "9-category buyer personas",
    "Font and layout suggestions",
    "Mockup recommendations",
    "No monthly subscriptions"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            <Sparkles className="h-6 w-6 inline mr-2 text-primary" />
            Get Full Access
          </DialogTitle>
          <p className="text-center text-slate-600">
            Transform your POD business with AI-powered buyer insights
          </p>
        </DialogHeader>
        
        <Card className="border-primary border-2 mt-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">POD Profile Generator</h3>
              <p className="text-slate-600 text-sm mt-1">Professional market research made simple</p>
            </div>

            <ul className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="w-full">
              <div 
                dangerouslySetInnerHTML={{
                  __html: `
                    <stripe-buy-button
                      buy-button-id="buy_btn_1RlfUOBlupvf8Jxw46F96i6T"
                      publishable-key="pk_live_51RagoSBlupvf8JxwMmt3eNsJzQJZFhkIR32grr3fOj2siLuK7GYNXUf4Bj2jp5QKEMuq8L2cTmQpDPsNlVBBDx5Q00YTWgQIWg"
                    >
                    </stripe-buy-button>
                  `
                }}
              />
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}