import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

// SEO Tags Generation Function
function generateSEOTags({ bundleName, products, bundlePrice, description }: {
  bundleName: string;
  products: any[];
  bundlePrice: number;
  description: string;
}) {
  // Extract product categories and key terms
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const allTags = products.flatMap(p => p.tags || []);
  const uniqueTags = Array.from(new Set(allTags)).filter(tag => tag && typeof tag === 'string');
  
  // Generate primary keywords
  const primaryKeywords = [
    bundleName.toLowerCase(),
    ...categories.map(c => c.toLowerCase()),
    'bundle',
    'set',
    'collection'
  ];
  
  // Generate Etsy-specific SEO tags
  const etsySeoTags = [
    ...primaryKeywords,
    ...uniqueTags.slice(0, 8), // Limit to 8 product tags
    'gift',
    'printify',
    'print on demand',
    'custom',
    'design',
    bundlePrice < 30 ? 'affordable' : bundlePrice > 100 ? 'premium' : 'quality'
  ].filter((tag, index, arr) => arr.indexOf(tag) === index); // Remove duplicates
  
  // Generate SEO title (60 characters max)
  const seoTitle = `${bundleName} - ${categories.join(' & ')} Bundle | ${Math.floor(bundlePrice * 1.2)}% Off`
    .substring(0, 60);
  
  // Generate SEO description (160 characters max)
  const savings = Math.round(((products.reduce((sum, p) => sum + parseFloat(p.price), 0) - bundlePrice) / products.reduce((sum, p) => sum + parseFloat(p.price), 0)) * 100);
  const seoDescription = `Get ${products.length} premium ${categories.join(' & ').toLowerCase()} items for $${bundlePrice.toFixed(2)}. Save ${savings}% with this curated bundle. ${description}`.substring(0, 160);
  
  return {
    seoTags: etsySeoTags.slice(0, 13), // Etsy allows 13 tags max
    seoTitle,
    seoDescription
  };
}

// Generate complete Etsy listing data with SKUs and variants
function generateEtsyListingData({ bundleName, products, bundlePrice, originalPrice, discountPercentage }: {
  bundleName: string;
  products: any[];
  bundlePrice: number;
  originalPrice: number;
  discountPercentage: number;
}) {
  const productSkus = products.map(product => ({
    productId: product.id,
    printifyId: product.printifyId,
    sku: product.sku || `SKU-${product.printifyId}`,
    title: product.title,
    price: product.price,
    variants: product.variants || []
  }));

  // Generate complete variant breakdown - EVERY variant from EVERY product
  const variantDetails = products.flatMap(product => {
    const variants = product.variants || [];
    console.log(`Including ALL variants from ${product.title}: ${variants.length} variants`);
    
    if (Array.isArray(variants) && variants.length > 0) {
      return variants.map((variant: any) => {
        // Parse size and color from Printify variant options
        let size = 'One Size';
        let color = 'Default';
        
        if (variant.options && Array.isArray(variant.options)) {
          // Extract size and color from options array
          const sizeOption = variant.options.find((opt: any) => 
            opt.name && (opt.name.toLowerCase().includes('size') || 
                        ['xs', 's', 'm', 'l', 'xl', 'xxl', '3xl', '4xl', '5xl'].includes(opt.value?.toLowerCase()))
          );
          const colorOption = variant.options.find((opt: any) => 
            opt.name && opt.name.toLowerCase().includes('color')
          );
          
          if (sizeOption) size = sizeOption.value || size;
          if (colorOption) color = colorOption.value || color;
        } else if (variant.title) {
          // Parse from variant title format like "Dark Heather / L" or "White / XL"
          const titleParts = variant.title.split(' / ');
          if (titleParts.length >= 2) {
            color = titleParts[0].trim();
            size = titleParts[1].trim();
          } else {
            // Try to extract size from title using common size patterns
            const sizeMatch = variant.title.match(/\b(XS|S|M|L|XL|XXL|3XL|4XL|5XL|2XL)\b/i);
            if (sizeMatch) {
              size = sizeMatch[0].toUpperCase();
              color = variant.title.replace(sizeMatch[0], '').trim().replace(/[\/\-\s]+$/, '');
            }
          }
        }
        
        return {
          productId: product.id,
          productTitle: product.title,
          productDescription: product.description || '',
          productCategory: product.category || 'General',
          productTags: product.tags || [],
          variantId: variant.id || 'N/A',
          sku: variant.sku || product.sku || `SKU-${product.printifyId}`,
          title: variant.title || 'Default',
          originalPrice: variant.price ? (parseFloat(variant.price) / 100).toFixed(2) : parseFloat(product.price).toFixed(2),
          bundlePrice: bundlePrice.toFixed(2), // Same bundle price for all variants
          size: size,
          color: color,
          material: variant.material || 'Standard',
          availability: variant.is_available ? 'In Stock' : 'Out of Stock',
          imageUrl: product.imageUrl || '',
          printifyId: product.printifyId
        };
      });
    } else {
      return [{
        productId: product.id,
        productTitle: product.title,
        productDescription: product.description || '',
        productCategory: product.category || 'General',
        productTags: product.tags || [],
        variantId: 'default',
        sku: product.sku || `SKU-${product.printifyId}`,
        title: 'Default Variant',
        originalPrice: parseFloat(product.price).toFixed(2),
        bundlePrice: bundlePrice.toFixed(2),
        size: 'One Size',
        color: 'Default',
        material: 'Standard',
        availability: 'In Stock',
        imageUrl: product.imageUrl || '',
        printifyId: product.printifyId
      }];
    }
  });

  // Generate comprehensive Etsy listing text
  const listingText = `
═══════════════════════════════════════
🌟 ${bundleName.toUpperCase()} - BUNDLE LISTING 🌟
═══════════════════════════════════════

💰 PRICING INFORMATION:
• Bundle Price: $${bundlePrice.toFixed(2)}
• Original Total: $${originalPrice.toFixed(2)}
• Your Savings: $${(originalPrice - bundlePrice).toFixed(2)} (${discountPercentage}% OFF)

📦 INCLUDED PRODUCTS:
${products.map((product, index) => `
${index + 1}. ${product.title}
   • SKU: ${product.sku || `SKU-${product.printifyId}`}
   • Individual Price: $${parseFloat(product.price).toFixed(2)}
   • Category: ${product.category || 'General'}
`).join('')}

🏷️ COMPLETE SKU & VARIANT BREAKDOWN (ALL PRODUCT INFORMATION INCLUDED):
${variantDetails.map((variant, index) => `
Variant ${index + 1}:
• Product: ${variant.productTitle}
• Category: ${variant.productCategory}
• SKU: ${variant.sku}
• Variant: ${variant.title}
• Original Price: $${variant.originalPrice}
• Bundle Price: $${variant.bundlePrice}
• Size: ${variant.size}
• Color: ${variant.color}
• Material: ${variant.material}
• Status: ${variant.availability}
• Printify ID: ${variant.printifyId}
`).join('')}

📋 COMPLETE ETSY SKU IMPORT FORMAT (${variantDetails.length} total variants from ${products.length} products):
${variantDetails.map((variant, index) => 
`${index + 1}. SKU: ${variant.sku} | Price: $${variant.bundlePrice} | Qty: 999 | ${variant.size} - ${variant.color} | From: ${variant.productTitle}`
).join('\n')}

📋 ETSY VARIANT SETUP:
Variation 1 (Size): ${Array.from(new Set(variantDetails.map(v => v.size))).join(', ')}
Variation 2 (Color): ${Array.from(new Set(variantDetails.map(v => v.color))).join(', ')}

🎯 ETSY LISTING SETUP STEPS:
1. Create ONE product on Etsy with bundle name: "${bundleName}"
2. Add custom variations for Size and Color (see options above)
3. Copy/paste ALL ${variantDetails.length} SKUs exactly as shown above
4. Each SKU gets price $${bundlePrice.toFixed(2)} and quantity 999
5. Download mockup images from each Printify product
6. Upload images to Etsy (max 10) and link to corresponding variants
7. Set main listing price: $${bundlePrice.toFixed(2)}

⚠️ CRITICAL: Include ALL variants from ALL products so customers can order any size/color combination

🚨 IMPORTANT: Each SKU must match exactly as shown above for Printify order sync

═══════════════════════════════════════
Ready to paste into your Etsy listing!
═══════════════════════════════════════
`;

  return {
    listingText,
    productSkus,
    variantDetails,
    totalVariants: variantDetails.length,
    pricing: {
      bundlePrice: bundlePrice.toFixed(2),
      originalPrice: originalPrice.toFixed(2),
      savings: (originalPrice - bundlePrice).toFixed(2),
      discountPercentage: discountPercentage.toString()
    }
  };
}

import { insertProductSchema, insertBundleSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";

// Professional Etsy description generator
function generateProfessionalEtsyDescription({ bundleName, products, bundlePrice, originalPrice, discountPercentage, description }: {
  bundleName: string;
  products: any[];
  bundlePrice: number;
  originalPrice: number;
  discountPercentage: number;
  description?: string;
}): string {
  const productTitles = products.map(p => p.title);
  const savings = originalPrice - bundlePrice;
  
  // Generate SEO keywords based on product titles and tags
  const allTags = products.flatMap(p => p.tags || []);
  const uniqueTags = Array.from(new Set(allTags)).slice(0, 8);
  
  return `🌟 ${bundleName.toUpperCase()} - SPECIAL BUNDLE DEAL! 🌟

💝 WHAT'S INCLUDED:
${productTitles.map(title => `✓ ${title}`).join('\n')}

💰 AMAZING SAVINGS:
• Bundle Price: $${bundlePrice.toFixed(2)}
• Regular Price: $${originalPrice.toFixed(2)}
• YOU SAVE: $${savings.toFixed(2)} (${discountPercentage}% OFF!)

🎯 WHY CHOOSE THIS BUNDLE?
${description || 'Perfect combination of quality and value! These items work beautifully together and make an excellent gift or addition to your collection.'}

📦 WHAT YOU GET:
• High-quality print-on-demand products
• Fast processing and shipping
• Professional packaging
• 100% satisfaction guarantee

🏷️ PERFECT FOR:
• Gift giving
• Personal collection
• Special occasions
• Everyday use

⭐ CUSTOMER SATISFACTION:
We're committed to your happiness! If you're not completely satisfied, we'll make it right.

🚚 SHIPPING & PROCESSING:
• Fast processing time
• Careful packaging
• Tracking information provided
• Multiple shipping options available

🛍️ ORDER NOW and save ${discountPercentage}% on this exclusive bundle!

#${uniqueTags.join(' #')} #Bundle #Sale #PrintOnDemand #QualityProducts #FastShipping #CustomerSatisfaction`;
}

// Smart pricing optimizer with market trend analysis
function generatePricingAnalysis({ products, bundleName, bundlePrice, originalPrice }: {
  products: any[];
  bundleName: string;
  bundlePrice: number;
  originalPrice: number;
}) {
  // Market segment analysis based on product categories and tags
  const categories = Array.from(new Set(products.map(p => p.category)));
  const allTags = products.flatMap(p => p.tags || []);
  const uniqueTags = Array.from(new Set(allTags));
  
  // Determine market segment
  let marketSegment = "general";
  if (categories.includes("apparel")) marketSegment = "fashion";
  if (categories.includes("home")) marketSegment = "home_decor";
  if (categories.includes("drinkware")) marketSegment = "lifestyle";
  
  // Simulate market analysis (in production, this would use real market data APIs)
  const avgMarketPrices = {
    "fashion": { min: 45, max: 85, avg: 65 },
    "home_decor": { min: 35, max: 75, avg: 55 },
    "lifestyle": { min: 25, max: 65, avg: 45 },
    "general": { min: 30, max: 70, avg: 50 }
  };
  
  const marketData = avgMarketPrices[marketSegment as keyof typeof avgMarketPrices] || avgMarketPrices.general;
  
  // Calculate optimization score (0-100)
  const pricePosition = (bundlePrice - marketData.min) / (marketData.max - marketData.min);
  let optimizationScore = 85; // Start with high score
  
  if (bundlePrice < marketData.min * 0.8) optimizationScore = 60; // Too low
  if (bundlePrice > marketData.max * 1.2) optimizationScore = 45; // Too high
  if (bundlePrice >= marketData.avg * 0.9 && bundlePrice <= marketData.avg * 1.1) optimizationScore = 95; // Sweet spot
  
  // Generate seasonal trends
  const currentMonth = new Date().getMonth();
  let seasonalTrend = "stable";
  if ([11, 0, 1].includes(currentMonth)) seasonalTrend = "high_demand"; // Winter holidays
  if ([5, 6, 7].includes(currentMonth)) seasonalTrend = "summer_boost"; // Summer
  if ([8, 9].includes(currentMonth)) seasonalTrend = "back_to_school"; // Fall
  
  // Calculate suggested price range
  const suggestedMin = Math.max(originalPrice * 0.7, marketData.min);
  const suggestedMax = Math.min(originalPrice * 0.9, marketData.max);
  const suggestedOptimal = (suggestedMin + suggestedMax) / 2;
  
  const competitorAnalysis = {
    marketPosition: bundlePrice < marketData.avg ? "below_market" : bundlePrice > marketData.avg ? "above_market" : "market_average",
    competitiveAdvantage: bundlePrice < marketData.avg * 0.95 ? "price_leader" : "value_proposition",
    marketGap: marketData.avg - bundlePrice,
  };
  
  const marketTrends = {
    demandLevel: seasonalTrend === "high_demand" ? "high" : seasonalTrend === "stable" ? "medium" : "high",
    priceDirection: "stable",
    seasonalMultiplier: seasonalTrend === "high_demand" ? 1.15 : 1.0,
    trendingTags: uniqueTags.slice(0, 5),
  };
  
  return {
    suggestedPrice: suggestedOptimal,
    competitorAnalysis,
    marketTrends,
    priceOptimizationScore: optimizationScore,
    marketSegment,
    recommendedPriceRange: {
      min: suggestedMin,
      max: suggestedMax,
      optimal: suggestedOptimal
    }
  };
}

// Admin authentication config
const ADMIN_CONFIG = {
  email: "joan@example.com",
  passwordHash: "$2b$10$go7.9fagV3ZCR/mdISrITuKBir.qX6EaNSCZMQ6WT8zwbprf3yHQW" // your-password
};

// Admin authentication middleware
const isAdminAuthenticated = (req: any, res: any, next: any) => {
  if (req.session?.adminUser === 'admin') {
    return next();
  }
  return res.status(401).json({ message: "Admin access required" });
};

// Combined auth middleware (works for both admin and regular users)
const isAnyAuthenticated = (req: any, res: any, next: any) => {
  console.log('Auth check - Session ID:', req.sessionID);
  console.log('Admin session:', req.session?.adminUser);
  
  // Check if admin is logged in
  if (req.session?.adminUser === 'admin') {
    console.log('Admin user authenticated via session');
    // Create a mock user object for admin access
    req.user = {
      claims: {
        sub: 'admin-user',
        email: 'joan@example.com'
      }
    };
    return next();
  }
  
  // Otherwise use regular Replit auth
  return isAuthenticated(req, res, next);
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Parse form data for admin login
  app.use(express.urlencoded({ extended: true }));
  
  // Auth middleware
  await setupAuth(app);

  // Session clearing route for debugging 
  app.get('/api/clear-session', (req: any, res) => {
    console.log('Clearing all sessions for:', req.sessionID);
    req.session.destroy((err: any) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.clearCookie('connect.sid', { 
        path: '/', 
        domain: undefined,
        httpOnly: true,
        secure: false 
      });
      res.json({ message: "Session cleared successfully" });
    });
  });

  // Admin login routes
  app.post('/api/admin/login', async (req: any, res) => {
    try {
      console.log('🔐 Admin login attempt:', req.body);
      console.log('Request headers:', req.headers['content-type']);
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      if (email === ADMIN_CONFIG.email && await bcrypt.compare(password, ADMIN_CONFIG.passwordHash)) {
        // Clear any existing session first
        req.session.regenerate((err: any) => {
          if (err) {
            console.error('Session regeneration error:', err);
            return res.status(500).json({ message: "Session error" });
          }
          
          // Set admin session
          req.session.adminUser = 'admin';
          
          // Save session explicitly
          req.session.save(async (saveErr: any) => {
            if (saveErr) {
              console.error('Session save error:', saveErr);
              return res.status(500).json({ message: "Session save failed" });
            }
            
            try {
              // Ensure admin user exists in storage
              await storage.upsertUser({
                id: 'admin-user',
                email: email,
                firstName: 'Admin',
                lastName: 'User',
                profileImageUrl: null,
              });
              
              console.log('Admin login successful, session ID:', req.sessionID);
              res.json({ message: "Admin login successful", user: { id: 'admin-user', email: email, role: 'admin' } });
            } catch (storageError) {
              console.error("Error creating admin user:", storageError);
              res.json({ message: "Admin login successful", user: { id: 'admin-user', email: email, role: 'admin' } });
            }
          });
        });
      } else {
        res.status(401).json({ message: "Invalid admin credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/admin/logout', (req: any, res) => {
    console.log('Admin logout request');
    req.session.destroy((err: any) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid', { 
        path: '/', 
        domain: undefined,
        httpOnly: true,
        secure: false 
      });
      console.log('Admin session destroyed successfully');
      res.json({ message: "Admin logout successful" });
    });
  });

  // Auth routes
  app.get('/api/auth/user', isAnyAuthenticated, async (req: any, res) => {
    try {
      console.log('Auth user request - Session ID:', req.sessionID);
      console.log('Authenticated user:', req.user?.claims?.sub);
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Printify API Key routes
  app.post("/api/printify/setup", isAnyAuthenticated, async (req: any, res) => {
    try {
      const { apiKey } = req.body;
      const userId = req.user.claims.sub;
      
      if (!apiKey) {
        return res.status(400).json({ message: "API key is required" });
      }

      await storage.updateUserPrintifyKey(userId, apiKey);
      res.json({ message: "API key saved successfully" });
    } catch (error) {
      console.error("Error saving API key:", error);
      res.status(500).json({ message: "Failed to save API key" });
    }
  });

  // Product routes
  app.get("/api/products", isAnyAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const products = await storage.getProductsByUserId(userId);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products/sync", isAnyAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.printifyApiKey) {
        return res.status(400).json({ message: "Printify API key not configured" });
      }

      // First fetch shops from Printify API
      const shopsResponse = await fetch("https://api.printify.com/v1/shops.json", {
        headers: {
          "Authorization": `Bearer ${user.printifyApiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!shopsResponse.ok) {
        const errorText = await shopsResponse.text();
        console.error("Printify API error:", shopsResponse.status, errorText);
        console.error("API Key (first 10 chars):", user.printifyApiKey?.substring(0, 10));
        
        // Handle common API errors with helpful messages
        let errorMessage = "Failed to fetch shops from Printify";
        let helpText = "";
        
        if (shopsResponse.status === 401) {
          errorMessage = "Your Printify API key has expired or is invalid";
          helpText = "Please get a fresh API key from Printify Account Settings > API > Generate New Token";
        } else if (shopsResponse.status === 403) {
          errorMessage = "Access denied. Your API key doesn't have required permissions";
          helpText = "Ensure your API key has 'shops.read' and 'products.read' permissions";
        } else if (shopsResponse.status === 429) {
          errorMessage = "Rate limit exceeded";
          helpText = "Please try again in a few minutes";
        }
        
        return res.status(400).json({ 
          message: errorMessage, 
          helpText: helpText,
          error: errorText,
          status: shopsResponse.status,
          needsNewApiKey: shopsResponse.status === 401
        });
      }

      const shopsData = await shopsResponse.json();
      console.log("Fetched shops:", shopsData);

      // Handle both possible response formats from Printify API
      const shops = Array.isArray(shopsData) ? shopsData : (shopsData.data || shopsData);
      
      if (!shops || !Array.isArray(shops) || shops.length === 0) {
        return res.status(400).json({ message: "No shops found in your Printify account" });
      }
      
      console.log(`✅ Found ${shops.length} shops, starting product sync...`);

      // Fetch products from all shops with rate limiting
      let allProducts: any[] = [];
      let successfulShops = 0;
      let failedShops = 0;
      
      for (let i = 0; i < shops.length; i++) {
        const shop = shops[i];
        console.log(`Fetching products from shop: ${shop.title} (ID: ${shop.id})`);
        
        try {
          const productsResponse = await fetch(`https://api.printify.com/v1/shops/${shop.id}/products.json?limit=50`, {
            headers: {
              "Authorization": `Bearer ${user.printifyApiKey}`,
              "Content-Type": "application/json",
              "User-Agent": "BundleCraft-App"
            },
          });

          if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            const products = productsData.data || productsData;
            console.log(`Found ${products?.length || 0} products in shop ${shop.title}`);
            
            if (products && Array.isArray(products)) {
              allProducts = allProducts.concat(products);
              successfulShops++;
            }
          } else if (productsResponse.status === 429) {
            console.log(`Rate limit hit for shop ${shop.title}, waiting 2 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Retry once
            const retryResponse = await fetch(`https://api.printify.com/v1/shops/${shop.id}/products.json?limit=50`, {
              headers: {
                "Authorization": `Bearer ${user.printifyApiKey}`,
                "Content-Type": "application/json",
                "User-Agent": "BundleCraft-App"
              },
            });
            
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              const retryProducts = retryData.data || retryData;
              if (retryProducts && Array.isArray(retryProducts)) {
                allProducts = allProducts.concat(retryProducts);
                successfulShops++;
              }
            } else {
              failedShops++;
              console.error(`Failed to fetch products from shop ${shop.title} after retry:`, retryResponse.status);
            }
          } else {
            failedShops++;
            console.error(`Failed to fetch products from shop ${shop.title}:`, productsResponse.status);
          }
          
          // Add delay between requests to respect rate limits
          if (i < shops.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
        } catch (error) {
          failedShops++;
          console.error(`Error fetching from shop ${shop.title}:`, error);
        }
      }

      console.log(`Total products found: ${allProducts.length}`);
      
      // Clear existing products
      await storage.deleteProductsByUserId(userId);
      
      // Transform and save products with comprehensive variant data
      const productsToInsert = allProducts.map((product: any) => {
        // Ensure we capture ALL variants from Printify
        const variants = product.variants || [];
        console.log(`Product ${product.title}: ${variants.length} variants imported`);
        
        return {
          userId,
          printifyId: product.id.toString(),
          title: product.title,
          description: product.description || "",
          price: variants?.[0]?.price ? (variants[0].price / 100).toFixed(2) : "0.00",
          sku: variants?.[0]?.sku || `SKU-${product.id}`,
          category: product.tags?.[0] || "uncategorized",
          imageUrl: product.images?.[0]?.src || "",
          variants: variants, // Store ALL variants for complete bundle creation
          tags: product.tags || [],
        };
      });

      const savedProducts = await storage.createManyProducts(productsToInsert);
      
      // Calculate total variants imported
      const totalVariants = savedProducts.reduce((total, product) => {
        return total + (product.variants?.length || 0);
      }, 0);
      
      let message = `Successfully synced ${savedProducts.length} products with ${totalVariants} total variants`;
      if (failedShops > 0) {
        message += ` (${failedShops} shops had sync issues - this is normal due to API rate limits)`;
      }
      
      res.json({ 
        message: message,
        count: savedProducts.length,
        products: savedProducts,
        stats: {
          totalShops: shops.length,
          successfulShops,
          failedShops,
          totalProducts: allProducts.length
        }
      });
    } catch (error) {
      console.error("Error syncing products:", error);
      res.status(500).json({ message: "Failed to sync products" });
    }
  });

  // Bundle routes
  app.get("/api/bundles", isAnyAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bundles = await storage.getBundlesByUserId(userId);
      res.json(bundles);
    } catch (error) {
      console.error("Error fetching bundles:", error);
      res.status(500).json({ message: "Failed to fetch bundles" });
    }
  });

  app.post("/api/bundles", isAnyAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bundleData = insertBundleSchema.parse({
        ...req.body,
        userId,
      });

      // Calculate pricing
      const products = await storage.getProductsByIds(bundleData.productIds);
      const originalPrice = products.reduce((sum, product) => sum + parseFloat(product.price), 0);
      const discountAmount = (originalPrice * (parseFloat(bundleData.discountPercentage?.toString() || "0") / 100));
      const bundlePrice = bundleData.bundlePrice ? parseFloat(bundleData.bundlePrice.toString()) : originalPrice - discountAmount;

      // Generate professional Etsy description
      const etsyDescription = generateProfessionalEtsyDescription({
        bundleName: bundleData.name,
        products: products,
        bundlePrice: bundlePrice,
        originalPrice: originalPrice,
        discountPercentage: parseFloat(bundleData.discountPercentage?.toString() || "0"),
        description: bundleData.description || ""
      });

      // Generate complete Etsy listing data with SKUs and variants
      const etsyListingData = generateEtsyListingData({
        bundleName: bundleData.name,
        products: products,
        bundlePrice: bundlePrice,
        originalPrice: originalPrice,
        discountPercentage: parseFloat(bundleData.discountPercentage?.toString() || "0")
      });

      // Generate SEO tags and metadata
      const seoData = generateSEOTags({
        bundleName: bundleData.name,
        products: products,
        bundlePrice: bundlePrice,
        description: bundleData.description || ""
      });

      // Generate pricing analysis
      const pricingAnalysis = generatePricingAnalysis({
        products: products,
        bundleName: bundleData.name,
        bundlePrice: bundlePrice,
        originalPrice: originalPrice
      });

      const bundle = await storage.createBundle({
        ...bundleData,
        originalPrice: originalPrice.toString(),
        bundlePrice: bundlePrice.toString(),
        etsyDescription,
        etsyListingData: etsyListingData.listingText,
        productSkus: etsyListingData.productSkus,
        variantDetails: etsyListingData.variantDetails,
        seoTags: seoData.seoTags,
        seoTitle: seoData.seoTitle,
        seoDescription: seoData.seoDescription,
        suggestedPrice: pricingAnalysis.suggestedPrice.toString(),
        competitorAnalysis: pricingAnalysis.competitorAnalysis,
        marketTrends: pricingAnalysis.marketTrends,
        priceOptimizationScore: pricingAnalysis.priceOptimizationScore.toString(),
      });

      // Create price analytics record
      await storage.createPriceAnalytics({
        bundleId: bundle.id,
        marketSegment: pricingAnalysis.marketSegment,
        averageMarketPrice: "50.00", // This would come from real market data
        competitorPrices: pricingAnalysis.competitorAnalysis,
        demandScore: "75.00",
        seasonalTrend: pricingAnalysis.marketTrends.demandLevel,
        recommendedPriceRange: pricingAnalysis.recommendedPriceRange,
      });

      res.json(bundle);
    } catch (error) {
      console.error("Error creating bundle:", error);
      res.status(500).json({ message: "Failed to create bundle" });
    }
  });

  // Get individual bundle with complete listing data
  app.get("/api/bundles/:id", isAnyAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bundleId = parseInt(req.params.id);
      const bundle = await storage.getBundleById(bundleId, userId);
      
      if (!bundle) {
        return res.status(404).json({ message: "Bundle not found" });
      }
      
      res.json(bundle);
    } catch (error) {
      console.error("Error fetching bundle:", error);
      res.status(500).json({ message: "Failed to fetch bundle" });
    }
  });

  app.delete("/api/bundles/:id", isAnyAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.userId;
      const bundleId = parseInt(req.params.id);
      const isAdmin = userId === 'admin-user';
      
      console.log(`Delete request - User ID: ${userId}, Bundle ID: ${bundleId}, Admin: ${isAdmin}`);
      
      if (isAdmin) {
        // Admin can delete any bundle
        await storage.deleteBundleAdmin(bundleId);
        console.log(`Bundle ${bundleId} deleted by admin`);
      } else {
        // Regular users can only delete their own bundles
        const bundle = await storage.getBundleById(bundleId, userId);
        if (!bundle) {
          console.log(`Bundle not found or doesn't belong to user: ${bundleId} for user: ${userId}`);
          return res.status(404).json({ message: "Bundle not found or access denied" });
        }
        
        await storage.deleteBundle(bundleId, userId);
        console.log(`Bundle ${bundleId} deleted successfully for user ${userId}`);
      }
      
      res.json({ message: "Bundle deleted successfully" });
    } catch (error) {
      console.error("Error deleting bundle:", error);
      res.status(500).json({ message: "Failed to delete bundle" });
    }
  });

  // Pricing analytics routes
  app.post("/api/bundles/:id/analyze-pricing", isAnyAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bundleId = parseInt(req.params.id);
      
      const bundle = await storage.getBundleById(bundleId, userId);
      if (!bundle) {
        return res.status(404).json({ message: "Bundle not found" });
      }

      const products = await storage.getProductsByIds(bundle.productIds);
      const originalPrice = parseFloat(bundle.originalPrice || "0");
      const currentPrice = parseFloat(bundle.bundlePrice || "0");

      const pricingAnalysis = generatePricingAnalysis({
        products: products,
        bundleName: bundle.name,
        bundlePrice: currentPrice,
        originalPrice: originalPrice
      });

      // Update bundle with new pricing analysis
      const updatedBundle = await storage.updateBundlePricing(bundleId, {
        suggestedPrice: pricingAnalysis.suggestedPrice.toString(),
        competitorAnalysis: pricingAnalysis.competitorAnalysis,
        marketTrends: pricingAnalysis.marketTrends,
        priceOptimizationScore: pricingAnalysis.priceOptimizationScore.toString(),
      });

      // Create/update price analytics record
      await storage.createPriceAnalytics({
        bundleId: bundleId,
        marketSegment: pricingAnalysis.marketSegment,
        averageMarketPrice: "50.00",
        competitorPrices: pricingAnalysis.competitorAnalysis,
        demandScore: "75.00",
        seasonalTrend: pricingAnalysis.marketTrends.demandLevel,
        recommendedPriceRange: pricingAnalysis.recommendedPriceRange,
      });

      res.json({
        bundle: updatedBundle,
        pricingAnalysis: pricingAnalysis
      });
    } catch (error) {
      console.error("Error analyzing pricing:", error);
      res.status(500).json({ message: "Failed to analyze pricing" });
    }
  });

  app.get("/api/bundles/:id/pricing-analytics", isAnyAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bundleId = parseInt(req.params.id);
      
      const bundle = await storage.getBundleById(bundleId, userId);
      if (!bundle) {
        return res.status(404).json({ message: "Bundle not found" });
      }

      const analytics = await storage.getPriceAnalyticsByBundleId(bundleId);
      
      res.json({
        bundle: bundle,
        analytics: analytics,
        hasOptimization: !!(bundle.suggestedPrice && bundle.priceOptimizationScore)
      });
    } catch (error) {
      console.error("Error fetching pricing analytics:", error);
      res.status(500).json({ message: "Failed to fetch pricing analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
