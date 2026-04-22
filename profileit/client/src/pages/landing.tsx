import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, 
  TrendingUp, 
  Target, 
  Calendar, 
  Palette, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users,
  Zap,
  Play,
  X,
  Award,
  Shield,
  Rocket,
  BarChart3,
  Eye,
  Brain,
  TrendingDown
} from "lucide-react";
import profylixLogo from "@assets/Screenshot (1138)_1754275169435.png";

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-32 py-4">
            <div className="flex items-center">
              <img 
                src={profylixLogo} 
                alt="ProFylix Logo" 
                className="h-28 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = '/home'}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
              >
                Try Demo
              </Button>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-red-50 to-orange-50">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-orange-600/5"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-8 bg-gradient-to-r from-red-600 to-orange-600 text-white text-base px-6 py-3 shadow-lg">
              <Zap className="h-5 w-5 mr-2" />
              🚀 AI-Powered POD Intelligence Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Stop Guessing.
              <br />
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Start Selling.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              ProFylix eliminates guesswork in print-on-demand with AI-powered buyer profiles, 
              profit analysis, marketing calendars, and design strategies that actually convert.
            </p>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="text-lg font-bold text-slate-900">10,000+</div>
                    <div className="text-sm text-slate-600">Trusted Sellers</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center space-x-2">
                  <Award className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="text-lg font-bold text-slate-900">4.9/5</div>
                    <div className="text-sm text-slate-600">Customer Rating</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center space-x-2">
                  <Rocket className="h-6 w-6 text-purple-600" />
                  <div>
                    <div className="text-lg font-bold text-slate-900">5 Min</div>
                    <div className="text-sm text-slate-600">Instant Results</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/home'}
                size="lg"
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-lg px-8 py-4"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Analysis
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg px-8 py-4"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-slate-100 text-slate-700 text-sm px-4 py-2">
              Complete POD Intelligence Suite
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Everything You Need to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600"> Succeed</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive POD intelligence powered by advanced AI to eliminate guesswork and maximize profits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-red-50 hover:from-red-50 hover:to-red-100 group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900">9-Category Buyer Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Deep demographic and psychographic analysis to understand exactly who buys your products and why they convert.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-orange-50 hover:from-orange-50 hover:to-orange-100 group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900">Profit Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Pricing strategies, cost breakdowns, and revenue projections to maximize your profits and minimize risks.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-amber-50 hover:from-amber-50 hover:to-amber-100 group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900">Marketing Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Seasonal trends, campaign timing, and promotional strategies that drive consistent sales growth.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-red-50 hover:from-red-50 hover:to-red-100 group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900">Design Variations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  16+ proven design concepts with colors, fonts, and layouts that convert visitors into customers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-orange-50 hover:from-orange-50 hover:to-orange-100 group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900">SEO Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Optimized titles, descriptions, and tags to increase visibility and drive organic traffic to your products.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-amber-50 hover:from-amber-50 hover:to-amber-100 group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900">Trending Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Market trends, competitor analysis, and seasonal opportunities to stay ahead of the competition.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600">
              Pay only for what you use. No subscriptions, no hidden fees.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-slate-200 hover:border-red-300 transition-colors bg-white">
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

            <Card className="border-2 border-slate-200 hover:border-purple-300 transition-colors bg-white">
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
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Trusted by POD Sellers Worldwide
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-slate-600">Profiles Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-slate-600">Increase in Sales</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">4.9/5</div>
              <div className="text-slate-600">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your POD Business?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of sellers who eliminated guesswork and increased sales with ProFylix.
          </p>
          <Button 
            onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
            size="lg"
            className="bg-white text-red-600 hover:bg-slate-50"
          >
            View Pricing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Choose Your Analysis Package
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get instant access to AI-powered POD intelligence. No subscriptions, no hidden fees.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Package */}
            <Card className="bg-white border-2 border-slate-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$9.99</div>
                  <p className="text-slate-600">Perfect for testing one niche</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>AI Buyer Profile (9 categories)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Design Recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Basic Profit Analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Trending Keywords</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => window.open('https://buy.stripe.com/test_00g4j1bXn4xHbXqaEE', '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Professional Package */}
            <Card className="bg-gradient-to-b from-purple-50 to-blue-50 border-2 border-purple-500 hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white">Most Popular</Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Professional</h3>
                  <div className="text-4xl font-bold text-purple-600 mb-2">$19.99</div>
                  <p className="text-slate-600">Best for serious sellers</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Everything in Starter</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Advanced Profit Analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Marketing Calendar</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>SEO Optimization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Competitor Analysis</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => window.open('https://buy.stripe.com/test_28o9Ct2qR4xHbXqcMN', '_blank')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Get Professional
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Package */}
            <Card className="bg-white border-2 border-slate-200 hover:border-orange-500 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold text-orange-600 mb-2">$39.99</div>
                  <p className="text-slate-600">For POD businesses & agencies</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Everything in Professional</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Design Variations Guide</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Sales Volume Projections</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Market Gap Analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Priority Email Support</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => window.open('https://buy.stripe.com/test_5kA16XbXn4xHbXqeUV', '_blank')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Get Enterprise
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">
              ✓ Instant Access  ✓ No Subscription  ✓ 30-Day Money-Back Guarantee
            </p>
            <p className="text-sm text-slate-500">
              All payments are securely processed by Stripe. Results delivered within 5 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src={profylixLogo} 
                alt="ProFylix Logo" 
                className="h-6 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="text-slate-400 mb-4">
              © 2025 ProFylix. Stop guessing, start selling.
            </p>
            <p className="text-slate-500 text-sm">
              AI-Powered POD Intelligence • Buyer Profiles • Profit Analysis • Marketing Calendar • Design Variations
            </p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Live Demo: DesignScout POD Intelligence Platform
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-8 p-6">
            {/* Demo Example */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6 text-center">
                Example: Fitness Motivation T-Shirts Analysis
              </h3>
              
              {/* AI Buyer Profile Demo */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <Brain className="h-5 w-5 text-blue-600 mr-2" />
                  AI-Generated Buyer Profile
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Age:</strong> 25-40 years old</p>
                    <p><strong>Gender:</strong> 60% Male, 40% Female</p>
                    <p><strong>Income:</strong> $35,000 - $75,000</p>
                    <p><strong>Lifestyle:</strong> Health-conscious, gym-goers</p>
                  </div>
                  <div>
                    <p><strong>Values:</strong> Self-improvement, discipline</p>
                    <p><strong>Pain Points:</strong> Motivation consistency</p>
                    <p><strong>Shopping Behavior:</strong> Impulse + planned purchases</p>
                    <p><strong>Price Sensitivity:</strong> Moderate ($15-$30 range)</p>
                  </div>
                </div>
              </div>

              {/* Design Recommendations Demo */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <Palette className="h-5 w-5 text-purple-600 mr-2" />
                  Design Recommendations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium mb-2">Winning Slogans:</p>
                    <ul className="text-sm space-y-1">
                      <li>• "Beast Mode Activated"</li>
                      <li>• "Stronger Than Yesterday"</li>
                      <li>• "No Excuses, Just Results"</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Color Palette:</p>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-red-600 rounded"></div>
                      <div className="w-8 h-8 bg-black rounded"></div>
                      <div className="w-8 h-8 bg-gray-700 rounded"></div>
                      <div className="w-8 h-8 bg-orange-500 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profit Analysis Demo */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  Profit Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">$24.99</div>
                    <div className="text-sm text-slate-600">Optimal Price</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">$18.74</div>
                    <div className="text-sm text-slate-600">Profit per Sale</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">75%</div>
                    <div className="text-sm text-slate-600">Profit Margin</div>
                  </div>
                </div>
              </div>

              {/* Trending Insights Demo */}
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
                  Market Trends & Opportunities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">Seasonal Peaks:</p>
                    <ul className="space-y-1">
                      <li>• January: New Year resolutions (+180%)</li>
                      <li>• April-June: Summer prep (+120%)</li>
                      <li>• September: Back-to-gym (+95%)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Hot Keywords:</p>
                    <ul className="space-y-1">
                      <li>• "gym motivation" (45K searches/month)</li>
                      <li>• "fitness quotes" (32K searches/month)</li>
                      <li>• "workout shirt" (28K searches/month)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Results Summary */}
            <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
              <h4 className="font-semibold mb-4 text-center">Expected Results from This Analysis:</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2.5x</div>
                  <div className="text-sm text-slate-600">Sales increase</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">$1,200</div>
                  <div className="text-sm text-slate-600">Monthly revenue</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">48hrs</div>
                  <div className="text-sm text-slate-600">Time to first sale</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">16+</div>
                  <div className="text-sm text-slate-600">Design variations</div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-slate-600 mb-4">
                This is just one example. ProFylix analyzes ANY niche with the same level of detail.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setShowDemo(false)}
                  variant="outline"
                  size="lg"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Close Demo
                </Button>
                <Button 
                  onClick={() => {
                    setShowDemo(false);
                    // Scroll to pricing section
                    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                >
                  Get Your Analysis Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}