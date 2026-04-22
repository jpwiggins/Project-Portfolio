import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Users, Shield, Clock, Headphones } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

// Declare custom elements for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'buy-button-id': string;
        'publishable-key': string;
      };
    }
  }
}

const features = [
  {
    icon: Users,
    title: "AI Clinical Consultation",
    description: "Get instant AI-powered clinical guidance and decision support"
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description: "Manage shifts, breaks, and team coordination effortlessly"
  },
  {
    icon: Shield,
    title: "Professional References",
    description: "Comprehensive clinical reference library and educational materials"
  },
  {
    icon: Star,
    title: "Diagnostic Tools",
    description: "Visual symptom checker and clinical reference guides"
  },
  {
    icon: Headphones,
    title: "Wellness Support",
    description: "Mental health resources and stress management tools"
  },
  {
    icon: Check,
    title: "Medical Translation",
    description: "20+ languages with audio pronunciation for patient care"
  }
];

export default function Subscribe() {
  useEffect(() => {
    // Load Stripe buy button script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.body.appendChild(script);

    // Create and insert buy button after script loads
    script.onload = () => {
      const placeholder = document.getElementById('stripe-buy-button-placeholder');
      if (placeholder) {
        placeholder.innerHTML = `
          <stripe-buy-button
            buy-button-id="buy_btn_1RsCgaBlupvf8Jxw65Ot15SN"
            publishable-key="pk_live_51RagoSBlupvf8JxwMmt3eNsJzQJZFhkIR32grr3fOj2siLuK7GYNXUf4Bj2jp5QKEMuq8L2cTmQpDPsNlVBBDx5Q00YTWgQIWg">
          </stripe-buy-button>
        `;
      }
    };

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      
      <div className="lg:ml-72 min-h-screen">
        <Header 
          title="Subscribe to NurseHub Pro"
          subtitle="Unlock all premium features for comprehensive nursing support"
        />
        
        <main className="p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Pricing Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2" />
                Free Trials Available on All Plans
              </div>
              <h1 className="text-4xl font-bold text-text-primary mb-4">
                Choose Your Perfect Plan<br />
                <span className="text-primary">Free Trial Included</span>
              </h1>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Start with our Essential plan or upgrade to Professional for advanced features. 
                Both plans include free trials so you can test everything risk-free.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {/* Essential Plan */}
              <Card className="border-success/20 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 bg-success text-white text-center py-2 text-sm font-medium">
                  14-Day Free Trial
                </div>
                <CardHeader className="text-center pb-4 pt-12">
                  <CardTitle className="text-2xl text-primary">Essential Plan</CardTitle>
                  <div className="mt-4">
                    <div className="text-5xl font-bold text-success">$29</div>
                    <div className="text-text-secondary">/month after 14-day trial</div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center mb-6">
                    <div className="stripe-buy-button-container">
                      <stripe-buy-button
                        buy-button-id="buy_btn_1RsCeqBlupvf8JxwOv53gj2f"
                        publishable-key="pk_live_51RagoSBlupvf8JxwMmt3eNsJzQJZFhkIR32grr3fOj2siLuK7GYNXUf4Bj2jp5QKEMuq8L2cTmQpDPsNlVBBDx5Q00YTWgQIWg">
                      </stripe-buy-button>
                    </div>
                  </div>
                  <div className="text-center text-sm text-text-secondary space-y-1">
                    <div>✓ 14-day free trial</div>
                    <div>✓ All core nursing tools</div>
                    <div>✓ Basic support</div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Plan */}
              <Card className="border-primary/20 shadow-lg relative overflow-hidden ring-2 ring-primary">
                <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2 text-sm font-medium">
                  Most Popular • 3-Day Trial
                </div>
                <CardHeader className="text-center pb-4 pt-12">
                  <CardTitle className="text-2xl text-primary">Professional Plan</CardTitle>
                  <div className="mt-4">
                    <div className="text-5xl font-bold text-primary">$49</div>
                    <div className="text-text-secondary">/month after 3-day trial</div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center mb-6">
                    <div id="stripe-buy-button-placeholder">
                      {/* Stripe buy button will be loaded here */}
                    </div>
                  </div>
                  <div className="text-center text-sm text-text-secondary space-y-1">
                    <div>✓ 3-day free trial</div>
                    <div>✓ All premium features</div>
                    <div>✓ Priority support</div>
                    <div>✓ Advanced analytics</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
                What's included in your subscription
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-primary mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-text-secondary text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Trial Benefits */}
            <Card className="bg-success/5 border-success/20 mb-8">
              <CardHeader>
                <CardTitle className="text-center text-success">
                  Your 3-Day Free Trial Includes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-text-primary">Full AI clinical consultation access</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-text-primary">Unlimited patient notes and documentation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-text-primary">Advanced scheduling and shift management</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-text-primary">Medical translation in 20+ languages</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-text-primary">Wellness and mental health resources</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-text-primary">24/7 customer support</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-center text-primary">
                  Why nurses choose NurseHub Pro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                    <div className="text-text-secondary">Active Nurses</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                    <div className="text-text-secondary">Uptime</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-text-secondary">Support</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
