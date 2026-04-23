import { useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Calendar, DollarSign } from "lucide-react";

export default function Subscribe() {
  useEffect(() => {
    // Load Stripe buy button script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to BudgetBites Pro
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited meal plans, advanced dietary customization, and premium features to save even more on groceries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Features */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-primary" />
                  Premium Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Check className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Unlimited Meal Plans</h4>
                    <p className="text-sm text-gray-600">Generate as many meal plans as you need</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Advanced Dietary Options</h4>
                    <p className="text-sm text-gray-600">Keto, paleo, vegan, and 20+ diet types</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Smart Ingredient Substitutions</h4>
                    <p className="text-sm text-gray-600">Automatic alternatives for allergies and preferences</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Calorie & Nutrition Tracking</h4>
                    <p className="text-sm text-gray-600">Detailed nutrition info and calorie planning</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">PDF Grocery Lists</h4>
                    <p className="text-sm text-gray-600">Download organized shopping lists</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Save Favorite Plans</h4>
                    <p className="text-sm text-gray-600">Build your personal recipe collection</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing */}
          <div>
            <Card className="h-full border-primary shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pro Plan</CardTitle>
                <div className="flex items-center justify-center mt-4">
                  <DollarSign className="h-8 w-8 text-primary" />
                  <span className="text-4xl font-bold text-primary">9.99</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="flex items-center justify-center text-green-600">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span className="font-semibold">3-Day Free Trial</span>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Start your free trial today!</strong><br />
                    Cancel anytime. No commitments.
                  </p>
                </div>

                {/* Stripe Buy Button */}
                <div 
                  className="stripe-buy-button-container"
                  dangerouslySetInnerHTML={{
                    __html: `
                      <stripe-buy-button
                        buy-button-id="buy_btn_1RsssjBlupvf8Jxwj45ZLn6m"
                        publishable-key="pk_live_51RagoSBlupvf8JxwMmt3eNsJzQJZFhkIR32grr3fOj2siLuK7GYNXUf4Bj2jp5QKEMuq8L2cTmQpDPsNlVBBDx5Q00YTWgQIWg"
                      >
                      </stripe-buy-button>
                    `
                  }}
                />

                <p className="text-xs text-gray-500">
                  Secure payment processed by Stripe<br />
                  Cancel or change plan anytime
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-2">How does the free trial work?</h4>
              <p className="text-gray-600 text-sm">
                Start with a 3-day free trial with full access to all Pro features. 
                Your subscription begins after the trial ends. Cancel anytime during the trial at no charge.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600 text-sm">
                Yes! Cancel your subscription anytime through your account settings or contact support.
                You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, debit cards, and digital payment methods through Stripe's secure payment processing.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How much money can I save?</h4>
              <p className="text-gray-600 text-sm">
                Our users typically save 20-40% on their grocery bills by following our optimized meal plans and smart shopping lists.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}