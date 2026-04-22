import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Zap, DollarSign, Rocket, Play, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import bundleCraftLogo from "@/assets/bundlecraft-new-logo.png";

export default function Landing() {
  const [showDemo, setShowDemo] = React.useState(false);
  const [selectedProducts, setSelectedProducts] = React.useState<number[]>([]);
  const [showBundle, setShowBundle] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      console.log('Login attempt to /api/admin/login with:', credentials.email);
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      
      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed with response:', errorText);
        
        try {
          const error = JSON.parse(errorText);
          throw new Error(error.message || "Login failed");
        } catch {
          throw new Error("Login failed - " + errorText);
        }
      }
      
      const result = await response.json();
      console.log('Login successful:', result);
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      // Close login modal first
      setShowLogin(false);
      
      // Force refresh authentication state
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Small delay to ensure state updates, then redirect
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });
  
  const demoProducts = [
    { 
      id: 1, 
      name: "Vintage Sunset T-Shirt", 
      basePrice: 19.99,
      cost: 12.50,
      variants: ["XS-Black", "S-Black", "M-Black", "L-Black", "XL-Black", "XS-White", "S-White", "M-White", "L-White", "XL-White", "XS-Navy", "S-Navy", "M-Navy", "L-Navy", "XL-Navy"],
      variantPrices: { "XS": 19.99, "S": 19.99, "M": 19.99, "L": 19.99, "XL": 21.99 },
      totalVariants: 15,
      baseSku: "VST-001"
    },
    { 
      id: 2, 
      name: "Mountain Adventure Hoodie", 
      basePrice: 34.99,
      cost: 22.00,
      variants: ["S-Black", "M-Black", "L-Black", "XL-Black", "XXL-Black", "S-Gray", "M-Gray", "L-Gray", "XL-Gray", "XXL-Gray", "S-Navy", "M-Navy", "L-Navy", "XL-Navy", "XXL-Navy"],
      variantPrices: { "S": 34.99, "M": 34.99, "L": 34.99, "XL": 36.99, "XXL": 38.99 },
      totalVariants: 15,
      baseSku: "MAH-002"
    },
    { 
      id: 3, 
      name: "Ocean Waves Mug", 
      basePrice: 12.99,
      cost: 8.50,
      variants: ["11oz-White", "15oz-White", "11oz-Black", "15oz-Black"],
      variantPrices: { "11oz": 12.99, "15oz": 14.99 },
      totalVariants: 4,
      baseSku: "OWM-003"
    },
    { 
      id: 4, 
      name: "Retro Coffee Tee", 
      basePrice: 18.99,
      cost: 11.75,
      variants: ["XS-Cream", "S-Cream", "M-Cream", "L-Cream", "XL-Cream", "XS-Brown", "S-Brown", "M-Brown", "L-Brown", "XL-Brown"],
      variantPrices: { "XS": 18.99, "S": 18.99, "M": 18.99, "L": 18.99, "XL": 20.99 },
      totalVariants: 10,
      baseSku: "RCT-004"
    },
    { 
      id: 5, 
      name: "Nature Explorer Cap", 
      basePrice: 24.99,
      cost: 15.00,
      variants: ["Adjustable-Black", "Adjustable-Khaki", "Adjustable-Navy", "Adjustable-Forest"],
      variantPrices: { "Adjustable": 24.99 },
      totalVariants: 4,
      baseSku: "NEC-005"
    },
    { 
      id: 6, 
      name: "Hiking Trail Sticker", 
      basePrice: 3.99,
      cost: 1.50,
      variants: ["3inch-Glossy", "4inch-Glossy", "3inch-Matte", "4inch-Matte"],
      variantPrices: { "3inch": 3.99, "4inch": 4.99 },
      totalVariants: 4,
      baseSku: "HTS-006"
    }
  ];
  
  const handleProductSelect = (productId: number) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else if (prev.length < 3) {
        const newSelected = [...prev, productId];
        if (newSelected.length === 3) {
          setTimeout(() => setShowBundle(true), 500);
        }
        return newSelected;
      }
      return prev;
    });
  };
  
  const resetDemo = () => {
    setSelectedProducts([]);
    setShowBundle(false);
  };
  
  const getTotalPrice = () => {
    return selectedProducts.reduce((sum, id) => {
      const product = demoProducts.find(p => p.id === id);
      return sum + (product?.basePrice || 0);
    }, 0);
  };
  
  const getBundlePrice = () => {
    const total = getTotalPrice();
    return total * 0.85; // 15% discount with smart optimization
  };
  
  const getTotalCost = () => {
    return selectedProducts.reduce((sum, id) => {
      const product = demoProducts.find(p => p.id === id);
      return sum + (product?.cost || 0);
    }, 0);
  };
  
  const getProfitMargin = () => {
    const bundlePrice = getBundlePrice();
    const totalCost = getTotalCost();
    return ((bundlePrice - totalCost) / bundlePrice * 100);
  };
  
  const getTotalVariantCombinations = () => {
    return selectedProducts.reduce((total, id) => {
      const product = demoProducts.find(p => p.id === id);
      return total * (product?.totalVariants || 1);
    }, 1);
  };
  
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={bundleCraftLogo} alt="BundleCraft" className="h-10 w-auto" />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => {
                document.querySelector('.pricing-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                View Plans
              </Button>
              <Button variant="ghost" onClick={() => setShowLogin(true)}>
                Login
              </Button>
              <Button onClick={() => {
                document.querySelector('.pricing-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-br from-purple-50 to-pink-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <img src={bundleCraftLogo} alt="BundleCraft - The Listing Help for Smart Sellers" className="h-32 w-auto mx-auto mb-6" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Stop Creating <span className="text-red-600">Thousands</span> of Product Variants
              <span className="text-primary block">Create Smart Bundles Instead</span>
            </h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold text-red-800 mb-3">The Variant Consolidation Nightmare:</h2>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-4 rounded border">
                  <p className="font-medium text-red-700">Create 900+ Variant Combos</p>
                  <p className="text-red-600">= Hours clicking in Printify interface</p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <p className="font-medium text-red-700">Consolidate to ONE Listing</p>
                  <p className="text-red-600">= Transfer all variants manually + SKU chaos</p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <p className="font-medium text-red-700">Price Each Combination</p>
                  <p className="text-red-600">= Complex calculations + Profit loss risk</p>
                </div>
              </div>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              <span className="font-semibold text-primary">BundleCraft automates everything:</span> Import your Printify products, 
              create intelligent bundles with proper SKU tracking, and get professional Etsy listings in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={() => setShowLogin(true)}>
                Login
              </Button>
              <Button variant="outline" size="lg" onClick={() => {
                // Open demo modal
                setShowDemo(true);
              }} className="border-primary text-primary hover:bg-primary hover:text-white">
                <Play className="mr-2 h-4 w-4 fill-current" />
                Try Live Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="text-primary mr-2" />
                  Import Products Instantly
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect your Printify account and import all your products with one click. 
                  No more manual data entry.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="text-primary mr-2" />
                  Smart Bundle Creation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Select 2-10 products, set your discount, and we'll generate professional 
                  Etsy descriptions automatically.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="text-primary mr-2" />
                  Maximize Profits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Increase your average order value with strategic bundles. Our customers 
                  see 40% higher sales on average.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Testimonials Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-br from-orange-50 to-amber-50">
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4 italic">
                    "BundleCraft helped me increase my Etsy sales by 45% in just 2 months. The SKU tracking makes everything so professional!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                      S
                    </div>
                    <div>
                      <p className="font-medium">Sarah M.</p>
                      <p className="text-sm text-gray-500">Etsy Store Owner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-amber-50">
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4 italic">
                    "The bundle descriptions are perfect for Etsy. I just copy and paste - saves me hours every week!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                      M
                    </div>
                    <div>
                      <p className="font-medium">Mike D.</p>
                      <p className="text-sm text-gray-500">Print-on-Demand Seller</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-amber-50">
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4 italic">
                    "Finally, a tool that understands Printify! The automatic product import is a game-changer."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                      L
                    </div>
                    <div>
                      <p className="font-medium">Lisa K.</p>
                      <p className="text-sm text-gray-500">Creative Entrepreneur</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-16 text-center pricing-section">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Simple, Honest Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Monthly Plan</CardTitle>
                  <div className="text-4xl font-bold text-primary">$29.99<span className="text-lg text-gray-600">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center">
                      <Rocket className="text-primary mr-2 h-4 w-4" />
                      Import unlimited Printify products
                    </li>
                    <li className="flex items-center">
                      <Rocket className="text-primary mr-2 h-4 w-4" />
                      Create unlimited profitable bundles
                    </li>
                    <li className="flex items-center">
                      <Rocket className="text-primary mr-2 h-4 w-4" />
                      Copy-paste ready Etsy descriptions
                    </li>
                    <li className="flex items-center">
                      <Rocket className="text-primary mr-2 h-4 w-4" />
                      Priority email support
                    </li>
                  </ul>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-3">Ready to start bundling like a pro?</p>
                    <stripe-buy-button
                      buy-button-id="buy_btn_1Rku7PBlupvf8JxwHed665iN"
                      publishable-key="pk_live_51RagoSBlupvf8JxwMmt3eNsJzQJZFhkIR32grr3fOj2siLuK7GYNXUf4Bj2jp5QKEMuq8L2cTmQpDPsNlVBBDx5Q00YTWgQIWg"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-2xl">Annual Plan</CardTitle>
                  <div className="text-4xl font-bold text-primary">$279.00<span className="text-lg text-gray-600">/year</span></div>
                  <Badge className="w-fit">Save $80!</Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center">
                      <Rocket className="text-primary mr-2 h-4 w-4" />
                      Import unlimited Printify products
                    </li>
                    <li className="flex items-center">
                      <Rocket className="text-primary mr-2 h-4 w-4" />
                      Create unlimited profitable bundles
                    </li>
                    <li className="flex items-center">
                      <Rocket className="text-primary mr-2 h-4 w-4" />
                      Copy-paste ready Etsy descriptions
                    </li>
                    <li className="flex items-center">
                      <Rocket className="text-primary mr-2 h-4 w-4" />
                      Priority email support
                    </li>
                    <li className="flex items-center">
                      <Rocket className="text-primary mr-2 h-4 w-4" />
                      2 months free!
                    </li>
                  </ul>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-primary font-medium mb-3">Best Value - Save $80 per year!</p>
                    <stripe-buy-button
                      buy-button-id="buy_btn_1RktRUBlupvf8JxwkvROZGuc"
                      publishable-key="pk_live_51RagoSBlupvf8JxwMmt3eNsJzQJZFhkIR32grr3fOj2siLuK7GYNXUf4Bj2jp5QKEMuq8L2cTmQpDPsNlVBBDx5Q00YTWgQIWg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>See BundleCraft in Action</DialogTitle>
            <DialogDescription>
              Here's exactly what you'll see inside your BundleCraft dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Interactive Preview */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <div className="bg-gray-100 p-2 rounded-t text-xs text-gray-600 mb-4">Your BundleCraft Dashboard Preview</div>
              
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Your Products</h3>
                <Button size="sm" className="bg-primary">+ Import from Printify</Button>
              </div>
              
              {/* Interactive Product Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {demoProducts.map((product) => {
                  const isSelected = selectedProducts.includes(product.id);
                  const canSelect = selectedProducts.length < 3 || isSelected;
                  return (
                    <div 
                      key={product.id} 
                      className={`border rounded-lg p-3 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-primary border-2 bg-primary/10' 
                          : canSelect 
                            ? 'bg-gray-50 hover:bg-gray-100' 
                            : 'bg-gray-30 opacity-50'
                      }`}
                    >
                      <div className="w-full h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded mb-2 flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-600" />
                      </div>
                      <h4 className="text-xs font-medium">{product.name}</h4>
                      <p className="text-xs text-gray-600">${product.basePrice.toFixed(2)}</p>
                      <p className="text-xs text-orange-600 font-medium">{product.totalVariants} variants</p>
                      <Button 
                        size="sm" 
                        variant={isSelected ? "default" : "outline"} 
                        className="w-full mt-2 text-xs py-1"
                        onClick={() => handleProductSelect(product.id)}
                        disabled={!canSelect}
                      >
                        {isSelected ? "✓ Selected" : "Select"}
                      </Button>
                    </div>
                  );
                })}
              </div>
              
              {/* Selection Counter & Complexity */}
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  {selectedProducts.length === 0 && "👆 Click 'Select' on any 3 products to create a bundle"}
                  {selectedProducts.length === 1 && "Great! Select 2 more products to create your bundle"}
                  {selectedProducts.length === 2 && "Perfect! Select 1 more product to complete your bundle"}
                  {selectedProducts.length === 3 && "🎉 Bundle created! Watch the magic happen below..."}
                </p>
                {selectedProducts.length > 0 && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm font-semibold text-red-800">Manual Variant Consolidation Nightmare:</p>
                    <p className="text-xs text-red-700">
                      {selectedProducts.length === 1 && `${getTotalVariantCombinations()} variants to manually transfer to bundle listing`}
                      {selectedProducts.length === 2 && `${getTotalVariantCombinations()} combined variants to create in ONE Printify listing`}
                      {selectedProducts.length === 3 && `${getTotalVariantCombinations().toLocaleString()} variants to consolidate into ONE bundle listing! 😱`}
                    </p>
                    {selectedProducts.length === 3 && (
                      <div className="text-xs text-red-600 mt-2 space-y-1">
                        <p className="font-semibold">Manual Variant Consolidation Process:</p>
                        <p>1️⃣ Create all {getTotalVariantCombinations().toLocaleString()} variant combinations in Printify</p>
                        <p>2️⃣ Choose ONE product to keep live, disable the rest</p>
                        <p>3️⃣ Manually add all variants from other products to this ONE listing</p>
                        <p>4️⃣ Transfer all product info, images, and descriptions</p>
                        <p>5️⃣ Calculate unique pricing for each variant combination</p>
                        <p>6️⃣ Create Etsy listing with all variant options</p>
                        <p className="font-medium">= Days of tedious work + Massive error risk + Lost profits</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Dynamic Bundle Creation */}
              {showBundle && selectedProducts.length === 3 && (
                <div className="bg-primary/10 rounded-lg p-4 animate-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Bundle: Adventure Collection</h4>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={resetDemo}
                      className="text-xs"
                    >
                      Reset Demo
                    </Button>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">3 products selected • Bundle Price: ${getBundlePrice().toFixed(2)} • You save: ${(getTotalPrice() - getBundlePrice()).toFixed(2)}</p>
                    
                    {/* Pricing Complexity Automation */}
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-xs font-semibold text-green-800">✨ Smart Pricing Automation:</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div className="bg-white p-2 rounded border">
                          <p className="font-medium text-green-700">Profit Margin: {getProfitMargin().toFixed(1)}%</p>
                          <p className="text-green-600">Auto-optimized for max profit</p>
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <p className="font-medium text-green-700">Total Cost: ${getTotalCost().toFixed(2)}</p>
                          <p className="text-green-600">All variant costs calculated</p>
                        </div>
                      </div>
                      <p className="text-xs text-green-700 mt-2">
                        🎯 Manages {getTotalVariantCombinations().toLocaleString()} different price combinations automatically! 
                        No manual pricing calculations, no variant confusion, no profit loss.
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm font-medium mb-1">Generated Etsy Description:</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong>🎯 ADVENTURE COLLECTION BUNDLE - Save ${(getTotalPrice() - getBundlePrice()).toFixed(2)}!</strong></p>
                      <p>Perfect collection for outdoor enthusiasts! This carefully curated bundle includes:</p>
                      {selectedProducts.map(id => {
                        const product = demoProducts.find(p => p.id === id);
                        return product ? (
                          <div key={id} className="mb-2">
                            <p>✅ {product.name} - ${product.basePrice.toFixed(2)}</p>
                            <div className="ml-4 mt-1 p-2 bg-gray-50 rounded border text-xs">
                              <p className="font-medium text-gray-700">Contributing {product.totalVariants} variants:</p>
                              <div className="grid grid-cols-3 gap-1 mt-1">
                                {product.variants.slice(0, 6).map((variant, idx) => (
                                  <span key={idx} className="text-xs bg-white px-1 py-0.5 rounded border">
                                    {variant}
                                  </span>
                                ))}
                                {product.variants.length > 6 && (
                                  <span className="text-xs text-gray-500">+{product.variants.length - 6} more</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })}
                      
                      {/* Consolidated Bundle Variants */}
                      <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="font-medium text-blue-800 text-sm">🎯 Final Bundle Listing Variants:</p>
                        <p className="text-xs text-blue-700 mb-2">All {getTotalVariantCombinations().toLocaleString()} combinations consolidated into ONE Printify listing:</p>
                        <div className="bg-white p-2 rounded border max-h-24 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <span className="bg-gray-100 px-1 py-0.5 rounded">XS-Black + S-Black + 11oz-White</span>
                            <span className="bg-gray-100 px-1 py-0.5 rounded">XS-Black + S-Black + 15oz-White</span>
                            <span className="bg-gray-100 px-1 py-0.5 rounded">XS-Black + M-Black + 11oz-White</span>
                            <span className="bg-gray-100 px-1 py-0.5 rounded">S-White + L-Gray + 15oz-Black</span>
                            <span className="bg-gray-100 px-1 py-0.5 rounded">M-Navy + XL-Navy + 11oz-Black</span>
                            <span className="text-orange-600 font-medium">... +{(getTotalVariantCombinations() - 5).toLocaleString()} more variants</span>
                          </div>
                        </div>
                        <p className="text-xs text-blue-600 mt-1 font-medium">
                          💡 Each variant gets proper SKU tracking and pricing automatically!
                        </p>
                      </div>
                      <p><strong>Bundle Price: ${getBundlePrice().toFixed(2)} (Regular: ${getTotalPrice().toFixed(2)})</strong></p>
                      <p>🎁 Save money while getting everything you need for your adventure!</p>
                      <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                        <p className="text-xs font-medium text-blue-800">🚀 Time & Error Savings:</p>
                        <p className="text-xs text-blue-700">
                          Manual Process: {Math.ceil(getTotalVariantCombinations() / 10)} hours + high error risk
                        </p>
                        <p className="text-xs text-blue-700">
                          With BundleCraft: 2 minutes + zero errors ✨
                        </p>
                      </div>
                      <p className="mt-2">#AdventureBundle #PrintifyProducts #EtsyFinds #OutdoorGear</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="mt-3" 
                      onClick={() => {
                        const description = `🎯 ADVENTURE COLLECTION BUNDLE - Save $${(getTotalPrice() - getBundlePrice()).toFixed(2)}! Perfect collection for outdoor enthusiasts...`;
                        navigator.clipboard.writeText(description);
                        alert('Bundle description copied to clipboard!');
                      }}
                    >
                      Copy Description
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Process Steps */}
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">3-Step Process</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-medium">Import Products</h4>
                  <p className="text-sm text-gray-600">Add your Printify API key and instantly import all your products with SKU tracking</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-medium">Create Bundles</h4>
                  <p className="text-sm text-gray-600">Select products, set bundle pricing, and preview your savings with comprehensive SKU management</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-medium">Copy & List</h4>
                  <p className="text-sm text-gray-600">Get professional Etsy descriptions with SKU details ready to paste into your listings</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                {selectedProducts.length === 3 
                  ? "🎉 You just created a professional bundle! Ready to do this with your real Printify products?" 
                  : "Ready to start creating profitable bundles with your real products?"
                }
              </p>
              <div className="space-y-2">
                <Button onClick={() => {
                  setShowDemo(false);
                  setTimeout(() => {
                    document.querySelector('.pricing-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                }} size="lg" className="w-full">
                  {selectedProducts.length === 3 ? "Get BundleCraft Now" : "Choose Your Plan"}
                </Button>
                {selectedProducts.length === 3 && (
                  <p className="text-xs text-gray-500">
                    Start creating real bundles like this in minutes!
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Simple Login Modal */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Enter your credentials to access the dashboard
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            loginMutation.mutate({
              email: formData.get('email') as string,
              password: formData.get('password') as string,
            });
          }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
            {loginMutation.isError && (
              <p className="text-sm text-red-600 text-center">
                Invalid credentials. Please try again.
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Quick Logout */}
      <div className="fixed bottom-1 right-1 flex space-x-2 opacity-20 hover:opacity-60 transition-opacity">
        <button 
          onClick={async () => {
            try {
              console.log('Logout clicked - clearing session');
              
              // Clear all local storage and session storage
              localStorage.clear();
              sessionStorage.clear();
              
              // Invalidate all React Query cache
              queryClient.clear();
              
              // Call logout API
              const response = await fetch('/api/logout', { 
                method: 'GET', 
                credentials: 'include',
                headers: {
                  'Cache-Control': 'no-cache',
                  'Pragma': 'no-cache'
                }
              });
              
              console.log('Logout response:', response.status);
              
              // Force complete page reload to clear all state
              window.location.href = window.location.origin;
              
            } catch (error) {
              console.error('Logout failed:', error);
              // Fallback: force reload anyway
              window.location.href = window.location.origin;
            }
          }}
          className="text-xs text-gray-300 hover:text-gray-500 cursor-pointer"
          title="Logout"
        >
          ×
        </button>
      </div>
    </div>
  );
}