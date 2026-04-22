import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, Zap, Users, ArrowRight, Star, Lock, FileText, BarChart3, Clock, Award, Globe, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";
import regReadyLogo from "@assets/regready-screenshot.png";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to authentication page for proper signup flow
    setLocation("/auth");
  };

  const features = [
    {
      icon: Shield,
      title: "AI-Powered Automation",
      description: "Generate compliant policies in minutes, not weeks. Our AI understands regulatory requirements and creates tailored documentation.",
      color: "bg-blue-500"
    },
    {
      icon: FileText,
      title: "Multi-Framework Coverage",
      description: "Complete GDPR, SOC 2, and EU AI Act compliance templates with automated gap analysis and remediation guidance.",
      color: "bg-green-500"
    },
    {
      icon: BarChart3,
      title: "Real-Time Monitoring",
      description: "Continuous compliance tracking with automated alerts, vendor assessments, and risk scoring dashboards.",
      color: "bg-purple-500"
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Bank-grade encryption, SOC 2 certified infrastructure, and complete audit trails for regulatory confidence.",
      color: "bg-red-500"
    },
    {
      icon: Clock,
      title: "Rapid Implementation",
      description: "Deploy in under 24 hours with guided onboarding, pre-configured frameworks, and expert support.",
      color: "bg-orange-500"
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "Stay compliant across jurisdictions with automatic regulatory updates and multi-region policy management.",
      color: "bg-teal-500"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$19.99",
      period: "/month",
      description: "Perfect for indie builders and solo entrepreneurs",
      features: [
        "14-day FREE trial included",
        "Up to 5 policies",
        "Basic GDPR compliance",
        "AI policy generation",
        "Email support",
        "Dashboard analytics"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "$49.00",
      period: "/month",
      description: "Ideal for growing startups and small teams",
      features: [
        "14-day FREE trial included",
        "Unlimited policies",
        "Full GDPR, SOC 2, EU AI Act",
        "Advanced AI features",
        "Vendor management",
        "Audit report generation",
        "Priority support",
        "API access"
      ],
      popular: true
    },
    {
      name: "Agency",
      price: "$299.99",
      period: "/month",
      description: "For agencies managing multiple clients",
      features: [
        "14-day FREE trial included",
        "Multi-client management",
        "White-label options",
        "Custom frameworks",
        "Advanced reporting",
        "Dedicated account manager",
        "SLA guarantee",
        "Custom integrations"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center space-x-4">
              <img src={regReadyLogo} alt="RegReady Logo" className="w-16 h-12 object-contain" />
              <div>
                <span className="text-2xl font-bold text-neutral-900">RegReady</span>
                <div className="text-xs text-neutral-600 font-medium tracking-wide">COMPLIANCE MANAGEMENT</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex items-center space-x-8">
                <a href="#features" className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors">Features</a>
                <a href="#pricing" className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors">Pricing</a>
                <a href="#security" className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors">Security</a>
              </nav>
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => setLocation("/auth")} className="font-medium">
                  Sign In
                </Button>
                <Button onClick={() => setLocation("/auth")} className="px-6 font-medium">
                  Get Started
                </Button>
              </div>
            </div>
            
            <div className="md:hidden">
              <Button onClick={() => setLocation("/auth")}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-blue-50/30 to-neutral-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold bg-blue-100 text-blue-800 border-blue-200">
              <Shield className="w-4 h-4 mr-2" />
              Trusted by 500+ Startups
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-8 leading-tight">
            Enterprise-Grade
            <br />
            <span className="text-blue-600">Compliance</span>
            <br />
            <span className="text-neutral-700 text-4xl md:text-5xl">Made Simple</span>
          </h1>
          
          <p className="text-xl text-neutral-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Navigate GDPR, SOC 2, and EU AI Act compliance with AI-powered automation. 
            Built for startups who need enterprise-grade compliance without enterprise complexity.
          </p>
          
          <div className="flex flex-col gap-6 justify-center max-w-xl mx-auto mb-12">
            {/* Live Stripe Payment Button */}
            <div className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-lg">
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-neutral-900">Start Your 14-Day Free Trial</div>
                <div className="text-sm text-neutral-600">Full access to all features • $19.99/month after trial</div>
              </div>
              
              <stripe-buy-button
                buy-button-id="buy_btn_1RlfCkBlupvf8Jxw9Py7nkCs"
                publishable-key="pk_live_51RagoSBlupvf8JxwMmt3eNsJzQJZFhkIR32grr3fOj2siLuK7GYNXUf4Bj2jp5QKEMuq8L2cTmQpDPsNlVBBDx5Q00YTWgQIWg"
              />
            </div>
            
            {/* Alternative signup form */}
            <div className="text-center">
              <div className="text-sm text-neutral-500 mb-3">Or explore the platform first</div>
              <form onSubmit={handleSignIn} className="flex flex-col sm:flex-row gap-3 w-full">
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 text-base border-2 border-neutral-200 focus:border-blue-500"
                  required
                />
                <Button type="submit" size="lg" className="h-12 px-8 font-semibold" variant="outline">
                  View Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-neutral-600">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Setup in under 5 minutes
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Live Demo
            </Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              See RegReady in Action
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Watch how RegReady transforms compliance from a burden into a competitive advantage
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Before RegReady */}
              <Card className="p-6 border-2 border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Before RegReady
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>6+ weeks to create GDPR policies</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>$15,000+ in legal consulting fees</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Manual vendor compliance tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Spreadsheet-based risk assessments</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Constant fear of compliance gaps</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-red-100 rounded-lg">
                    <div className="text-lg font-bold text-red-800">Total Cost: $18,000+</div>
                    <div className="text-sm text-red-700">8-12 weeks implementation</div>
                  </div>
                </CardContent>
              </Card>

              {/* After RegReady */}
              <Card className="p-6 border-2 border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    With RegReady
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>12 minutes to generate GDPR policies</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>$49/month for complete compliance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Automated vendor monitoring</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>AI-powered risk analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Real-time compliance dashboard</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <div className="text-lg font-bold text-green-800">Total Cost: $588/year</div>
                    <div className="text-sm text-green-700">24 hours implementation</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Demo Tabs */}
            <Card className="p-6">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Interactive Demo</CardTitle>
                <p className="text-neutral-600">Click through real RegReady features</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">87%</div>
                    <div className="text-sm text-blue-700">GDPR Compliance</div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '87%'}}></div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-green-700">SOC 2 Readiness</div>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">76%</div>
                    <div className="text-sm text-purple-700">EU AI Act</div>
                    <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '76%'}}></div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">24</div>
                    <div className="text-sm text-orange-700">Vendors Monitored</div>
                    <div className="text-xs text-orange-600 mt-1">Real-time tracking</div>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                  <div className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    AI Policy Generation Example:
                  </div>
                  <div className="text-sm text-neutral-600 italic mb-3">"Create a GDPR data processing policy for our SaaS platform"</div>
                  <div className="flex items-center gap-2 text-blue-600 mb-3">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm">Generating compliant policy...</span>
                  </div>
                  <div className="bg-green-100 p-3 rounded border-l-4 border-green-500">
                    <div className="text-sm font-medium text-green-800">✓ Policy Generated in 12 seconds</div>
                    <div className="text-xs text-green-700 mt-1">847 words • GDPR Article 6 compliant • Ready for legal review</div>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => setLocation("/auth")} 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                  >
                    Try the Full Demo - Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-sm text-neutral-600 mt-2">No credit card required • 14-day free trial</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              <Award className="w-4 h-4 mr-2" />
              Enterprise Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Compliance Automation
              <br />
              <span className="text-blue-600">Built for Scale</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
              Transform weeks of manual compliance work into minutes of automated excellence. 
              Built by compliance experts for teams who need enterprise-grade results without enterprise complexity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 border-neutral-100 hover:border-blue-200">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-neutral-900 mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-neutral-600 leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              <Star className="w-4 h-4 mr-2" />
              Transparent Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Enterprise-Grade Compliance
              <br />
              <span className="text-blue-600">at Startup Prices</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
              No hidden fees, no setup costs, no long-term contracts. 
              Start free and scale with transparent pricing as your business grows.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative group hover:shadow-2xl transition-all duration-300 ${
                plan.popular 
                  ? 'border-blue-500 shadow-xl scale-105 bg-gradient-to-b from-blue-50/50 to-white' 
                  : 'border-neutral-200 hover:border-blue-300'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold">
                      <Star className="w-4 h-4 mr-2" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-neutral-900">{plan.name}</CardTitle>
                  <CardDescription className="text-neutral-600 text-base mt-2">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-neutral-900">{plan.price}</span>
                    <span className="text-neutral-600 text-lg ml-1">{plan.period}</span>
                  </div>
                  <div className="text-sm text-neutral-500 mt-2">
                    14-day free trial, then monthly billing
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {plan.name === "Starter" ? (
                    <div className="w-full space-y-3">
                      <stripe-buy-button
                        buy-button-id="buy_btn_1RlfCkBlupvf8Jxw9Py7nkCs"
                        publishable-key="pk_live_51RagoSBlupvf8JxwMmt3eNsJzQJZFhkIR32grr3fOj2siLuK7GYNXUf4Bj2jp5QKEMuq8L2cTmQpDPsNlVBBDx5Q00YTWgQIWg"
                      />
                      <div className="text-center">
                        <div className="text-xs text-green-600 font-medium">✓ 14-Day Free Trial</div>
                        <div className="text-xs text-neutral-500">No credit card required to start</div>
                      </div>
                    </div>
                  ) : plan.name === "Pro" ? (
                    <div className="w-full space-y-3">
                      <stripe-buy-button
                        buy-button-id="buy_btn_1RlfDvBlupvf8Jxw6EiuD1zS"
                        publishable-key="pk_live_51RagoSBlupvf8JxwMmt3eNsJzQJZFhkIR32grr3fOj2siLuK7GYNXUf4Bj2jp5QKEMuq8L2cTmQpDPsNlVBBDx5Q00YTWgQIWg"
                      />
                      <div className="text-center">
                        <div className="text-xs text-green-600 font-medium">✓ 14-Day Free Trial</div>
                        <div className="text-xs text-neutral-500">Most popular choice</div>
                      </div>
                    </div>
                  ) : plan.name === "Agency" ? (
                    <div className="w-full space-y-3">
                      <stripe-buy-button
                        buy-button-id="buy_btn_1RlfEuBlupvf8Jxw9ayOIr2C"
                        publishable-key="pk_live_51RagoSBlupvf8JxwMmt3eNsJzQJZFhkIR32grr3fOj2siLuK7GYNXUf4Bj2jp5QKEMuq8L2cTmQpDPsNlVBBDx5Q00YTWgQIWg"
                      />
                      <div className="text-center">
                        <div className="text-xs text-green-600 font-medium">✓ 14-Day Free Trial</div>
                        <div className="text-xs text-neutral-500">Enterprise features included</div>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => setLocation("/dashboard")}
                    >
                      Start Free Trial
                    </Button>
                  )}
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section id="security" className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-3 py-1 bg-white/10 text-white border-white/20">
              <Lock className="w-4 h-4 mr-2" />
              Enterprise Security
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Bank-Grade Security
              <br />
              <span className="text-blue-400">You Can Trust</span>
            </h2>
            <p className="text-xl text-neutral-300 max-w-4xl mx-auto leading-relaxed">
              Your compliance data deserves the highest level of protection. 
              RegReady is built with enterprise-grade security from the ground up.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">SOC 2 Certified</h3>
              <p className="text-neutral-400 text-sm">Annual security audits and compliance certifications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">256-bit Encryption</h3>
              <p className="text-neutral-400 text-sm">All data encrypted in transit and at rest</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-neutral-400 text-sm">Full data portability and deletion rights</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">99.9% Uptime</h3>
              <p className="text-neutral-400 text-sm">Enterprise-grade infrastructure and monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your
            <br />
            Compliance Process?
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Join 500+ startups who trust RegReady to automate their compliance workflows. 
            Get enterprise-grade results without enterprise complexity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-neutral-50 px-8 py-4 text-lg font-semibold"
              onClick={() => setLocation("/auth")}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              onClick={() => setLocation("/auth")}
            >
              View Demo
            </Button>
          </div>
          <div className="mt-8 text-sm opacity-75">
            No credit card required • 14-day free trial • Setup in 5 minutes
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <img src={regReadyLogo} alt="RegReady Logo" className="w-16 h-12 object-contain" />
                <div>
                  <span className="text-2xl font-bold">RegReady</span>
                  <div className="text-sm text-neutral-400">Enterprise Compliance Platform</div>
                </div>
              </div>
              <p className="text-neutral-300 mb-6 max-w-md leading-relaxed">
                AI-powered compliance automation for startups who need enterprise-grade results without enterprise complexity.
              </p>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  SOC 2 Certified
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Shield className="w-3 h-3 mr-1" />
                  GDPR Compliant
                </Badge>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-3 text-neutral-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-neutral-400 text-sm mb-4 md:mb-0">
              &copy; 2025 RegReady. All rights reserved.
            </div>
            <div className="text-neutral-400 text-sm">
              Built for startups • Trusted by 500+ companies
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}