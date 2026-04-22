import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { generateProfileRequestSchema } from "@shared/schema";
import { generateBuyerProfile, generateDesignRecommendations } from "./services/openai";
import bcrypt from "bcrypt";
import session from "express-session";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...');

// Admin configuration - you can change these
const admin = {
  email: 'joan@example.com',
  // Password: admin123 - hashed with bcrypt (newly generated)
  passwordHash: '$2b$10$MAx5ghxwmD.kjry/INBDxu1HOYrBkHdUDgAgDy8hyIKm5SeaHgXpS'
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Docker
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      service: "proflix-api" 
    });
  });

  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Secure admin login route
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (email === admin.email) {
        const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
        
        if (passwordMatch) {
          // Admin login successful - set session
          (req as any).session.user = 'admin';
          res.json({ 
            success: true, 
            message: "Admin login successful",
            redirect: "/home",
            isAdmin: true
          });
          return;
        }
      }
      
      if (email && password) {
        // Regular user login (for demo purposes)
        (req as any).session.user = 'user';
        res.json({ 
          success: true, 
          message: "Login successful",
          redirect: "/home",
          isAdmin: false
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: "Email and password required" 
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Login failed" 
      });
    }
  });

  // Check admin status endpoint
  app.get("/api/auth/admin-status", (req, res) => {
    const isAdmin = (req as any).session?.user === 'admin';
    res.json({ isAdmin });
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    (req as any).session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Logout failed" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  app.get("/api/login", (req, res) => {
    // Redirect to a simple login page
    res.redirect("/login.html");
  });

  // Standard authentication system (no longer using Replit auth)

  // Basic user endpoint (simplified for demo)
  app.get('/api/auth/user', (req: any, res) => {
    // For demo purposes, return basic user info based on session
    const sessionUser = (req as any).session?.user;
    if (sessionUser === 'admin') {
      res.json({ 
        id: 'admin', 
        email: 'joan@example.com', 
        isAdmin: true 
      });
    } else if (sessionUser) {
      res.json({ 
        id: 'user', 
        email: 'demo@example.com', 
        isAdmin: false 
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
  
  // Generate buyer profile and design recommendations (public route for now)
  app.post("/api/generate-profile", async (req: any, res) => {
    try {
      const validatedData = generateProfileRequestSchema.parse(req.body);
      const { niche, productType } = validatedData;

      try {
        // Try generating with AI first
        const profileData = await generateBuyerProfile(niche);
        const designRecommendations = await generateDesignRecommendations(profileData, productType);

        // Save to storage (public profile for now)
        const savedProfile = await storage.createBuyerProfile({
          userId: null,
          niche,
          productType,
          profileData,
          designRecommendations,
        });

        res.json({
          id: savedProfile.id,
          niche: savedProfile.niche,
          productType: savedProfile.productType,
          profileData: savedProfile.profileData,
          designRecommendations: savedProfile.designRecommendations,
          createdAt: savedProfile.createdAt,
        });
      } catch (aiError) {
        // If AI fails (quota exceeded), provide a sample response to demonstrate the app
        console.log("AI generation failed, providing demo data for:", niche);
        
        const demoProfileData = {
          coreDemographics: `**Age Range:** 25-45 years old, predominantly female (70%)\n**Income:** $35,000-$75,000 annually\n**Education:** College-educated, health-conscious professionals\n**Life Stage:** Busy professionals seeking work-life balance, some with young families\n**Location:** Urban and suburban areas, health-conscious communities`,
          
          dailyLife: `**Morning:** 6 AM wake-up, meditation or stretching, healthy breakfast\n**Work:** 9-5 desk jobs, frequent breaks for movement\n**Evening:** ${niche.toLowerCase()} practice 3-4x per week, meal prep, self-care routines\n**Weekend:** Longer ${niche.toLowerCase()} sessions, farmers markets, outdoor activities\n**Sleep:** Prioritizes 7-8 hours, evening wind-down rituals`,
          
          archetype: `**Spirit Animal:** Graceful Swan - elegant, balanced, mindful\n**Personality:** The Mindful Achiever - driven yet centered, success-oriented but values inner peace\n**Core Traits:** Disciplined, authentic, community-minded, growth-focused\n**Style:** Clean, minimalist aesthetic with natural elements`,
          
          geographic: `**Primary Locations:** California, New York, Colorado, Pacific Northwest\n**Setting Preference:** Urban areas with access to nature, walkable neighborhoods\n**Climate:** Prefers mild temperatures, outdoor-friendly environments\n**Community:** Values wellness-focused communities, organic markets, studios within walking distance`,
          
          crossNiche: `**Wellness:** Meditation, healthy cooking, aromatherapy\n**Fitness:** Pilates, hiking, cycling, swimming\n**Lifestyle:** Sustainable living, plant-based nutrition, mindfulness\n**Personal Growth:** Reading self-help, journaling, life coaching\n**Social:** Wellness retreats, community classes, book clubs`,
          
          language: `**Key Terms:** "Namaste," "mindful," "intentional," "alignment," "flow state"\n**Hashtags:** #mindfulmovement #wellnessjourney #selfcare #innerpeace #mindfullife\n**Tone:** Gentle, encouraging, authentic, non-judgmental\n**Communication:** Values inclusivity, uses calming language, avoids aggressive sales tactics`,
          
          workLife: `**Career Types:** Healthcare, education, creative fields, corporate wellness roles\n**Work Style:** Values flexibility, work-life balance, meaningful work\n**Challenges:** Stress management, sitting too long, maintaining energy\n**Goals:** Career advancement while maintaining personal values and wellness\n**Remote Work:** 40% work from home, seeking movement breaks`,
          
          foodCulture: `**Diet:** Plant-forward, organic when possible, minimal processed foods\n**Drinks:** Herbal teas, smoothies, kombucha, limited coffee, lots of water\n**Eating Habits:** Mindful eating, meal prep, intuitive eating principles\n**Restrictions:** Many are vegetarian/vegan, gluten-sensitive, avoid artificial ingredients\n**Social:** Enjoys healthy restaurants, cooking classes, farmers market visits`,
          
          values: `**Core Values:** Authenticity, balance, personal growth, community connection\n**Emotional Drivers:** Desire for inner peace, fear of burnout, need for belonging\n**Pain Points:** Time constraints, perfectionism, comparison to others\n**Desires:** More energy, deeper connections, purposeful living\n**Motivations:** Self-improvement, helping others, living mindfully`
        };

        const demoDesignRecommendations = {
          slogans: [
            "Find Your Flow, Live Your Truth",
            "Mindful Moments, Lasting Peace",
            "Breathe Deep, Dream Big"
          ],
          visualIdeas: [
            {
              name: "Lotus Mandala",
              description: "Intricate lotus flower with geometric mandala patterns representing growth and balance",
              icon: "🪷"
            },
            {
              name: "Mountain Silhouette",
              description: "Minimalist mountain range with sun, symbolizing strength and mindfulness",
              icon: "⛰️"
            },
            {
              name: "Flowing Typography",
              description: "Hand-lettered inspirational quotes with organic, flowing letterforms",
              icon: "✨"
            }
          ],
          fonts: {
            primary: "Playfair Display (elegant serif for headers, conveys sophistication)",
            accent: "Dancing Script (flowing script for inspirational text)",
            body: "Source Sans Pro (clean, readable sans-serif for body text)"
          },
          colors: {
            palette: ["#8FA68E", "#F7F3E9", "#E4C5A0", "#B4A7D6", "#D4B5B0"],
            description: "Earthy sage greens and warm neutrals with soft lavender accents. This palette evokes natural tranquility, mindfulness, and spiritual connection while remaining approachable and calming."
          },
          layouts: [
            {
              name: "Centered Mandala Design",
              description: "Large central mandala or lotus with inspirational text arched above and below"
            },
            {
              name: "Minimalist Quote Layout",
              description: "Clean typography-focused design with simple geometric elements"
            },
            {
              name: "Nature-Inspired Border",
              description: "Text surrounded by delicate botanical illustrations or watercolor elements"
            }
          ],
          mockups: [
            {
              name: "Studio Setting",
              description: "Product photographed in a bright, airy yoga studio with natural lighting",
              setting: "Wooden floors, plants, yoga mats, natural light streaming through windows"
            },
            {
              name: "Outdoor Mindfulness",
              description: "Lifestyle shot in a peaceful outdoor setting during golden hour",
              setting: "Garden, park, or beach setting with soft natural lighting"
            },
            {
              name: "Home Sanctuary",
              description: "Cozy home environment with meditation corner and wellness elements",
              setting: "Soft textures, candles, plants, comfortable seating, calming atmosphere"
            },
            {
              name: "Active Lifestyle",
              description: "Product shown in use during actual practice or daily wellness routine",
              setting: "Real-life moments, authentic settings, natural expressions"
            }
          ],
          seoOptimization: {
            productTitles: [
              `${niche} ${productType} - Perfect Gift for ${niche} Enthusiasts`,
              `Funny ${niche} ${productType} - Great Conversation Starter`,
              `Premium ${niche} ${productType} - High Quality & Comfortable`
            ],
            descriptions: [
              `Show your ${niche.toLowerCase()} passion with this premium ${productType}. Perfect for daily wear or as a thoughtful gift. Made with high-quality materials for lasting comfort and style.`,
              `Express your ${niche.toLowerCase()} love with this unique ${productType} featuring exclusive design. Comfortable, durable, and guaranteed to start conversations wherever you go.`,
              `Premium ${niche.toLowerCase()} ${productType} that combines style with comfort. Whether you're treating yourself or finding the perfect gift, this is designed to impress.`
            ],
            tags: [niche.toLowerCase().replace(/\s+/g, '-'), productType.toLowerCase().replace(/\s+/g, '-'), "gift", "premium", "unique", "comfortable", "durable", "high-quality"],
            keywords: [`${niche.toLowerCase()} ${productType.toLowerCase()}`, `${niche.toLowerCase()} gift`, `${niche.toLowerCase()} lover`, `${niche.toLowerCase()} enthusiast`]
          },
          trendingInsights: {
            currentTrends: [
              {
                trend: "Minimalist aesthetic with bold statements",
                relevance: `Appeals to ${niche.toLowerCase()} enthusiasts who want clean, impactful designs that make a statement`,
                salesPotential: "High" as const
              },
              {
                trend: "Vintage-inspired designs with modern twists",
                relevance: `Nostalgic appeal combined with contemporary style attracts broader ${niche.toLowerCase()} audience`,
                salesPotential: "Medium" as const
              },
              {
                trend: "Personalized and customizable options",
                relevance: `${niche} customers want products that feel unique to them and their specific interests`,
                salesPotential: "High" as const
              }
            ],
            seasonalOpportunities: [
              {
                season: "Holiday Season",
                opportunity: `Gift-focused marketing for ${niche.toLowerCase()} enthusiasts with emotional messaging`,
                timing: "November - December (peak gift-giving season)"
              },
              {
                season: "Spring/Summer",
                opportunity: `Bright, optimistic ${niche.toLowerCase()} designs with outdoor and activity themes`,
                timing: "March - July (seasonal mood boost)"
              },
              {
                season: "Back to School",
                opportunity: `Student-targeted ${niche.toLowerCase()} designs for campus and dorm use`,
                timing: "August - September (new semester energy)"
              }
            ],
            competitorAnalysis: {
              topSellingStyles: ["Minimalist text-based designs", "Vintage-inspired graphics", "Humorous sayings and quotes"],
              priceRanges: ["$18-24 (budget-friendly)", "$25-32 (mid-range)", "$35-45 (premium)"],
              marketGaps: [`Truly personalized ${niche.toLowerCase()} options`, "Eco-friendly materials messaging", "Size-inclusive designs", "Cultural representation"]
            }
          }
        };

        // Save demo profile to storage
        const savedProfile = await storage.createBuyerProfile({
          userId: null, // Public profiles for now
          niche,
          productType,
          profileData: demoProfileData,
          designRecommendations: demoDesignRecommendations,
        });

        res.json({
          id: savedProfile.id,
          niche: savedProfile.niche,
          productType: savedProfile.productType,
          profileData: savedProfile.profileData,
          designRecommendations: savedProfile.designRecommendations,
          createdAt: savedProfile.createdAt,
          isDemoData: true
        });
      }
    } catch (error) {
      console.error("Error generating profile:", error);
      res.status(500).json({ 
        message: "Failed to generate buyer profile. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get user's buyer profiles (will show recent public profiles if not authenticated)
  app.get("/api/profiles", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      let profiles: any[] = [];
      
      if (sessionUser === 'admin') {
        // Admin can see all profiles
        profiles = await storage.getAllProfiles();
      } else {
        // For demo users and non-authenticated, show recent public profiles
        profiles = await storage.getAllProfiles();
        // Limit to 10 most recent for demo
        profiles = profiles.slice(-10);
      }
      
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  // Get specific buyer profile
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const profile = await storage.getBuyerProfile(id);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Create Stripe checkout session
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { tier } = req.body;
      
      // If no Stripe key is configured, provide payment instructions
      if (!stripe) {
        const amounts = { starter: 9.99, professional: 19.99, enterprise: 39.99 };
        const amount = amounts[tier as keyof typeof amounts];
        
        return res.json({ 
          error: 'PAYMENT_CONFIG_NEEDED',
          message: `To complete your ${tier} purchase ($${amount}), please contact support for payment processing.`,
          tier,
          amount
        });
      }
      
      let priceData;
      switch (tier) {
        case 'starter':
          priceData = {
            currency: 'usd',
            product_data: {
              name: 'ProFylix Starter Analysis',
              description: 'Complete buyer profile, design recommendations, SEO optimization'
            },
            unit_amount: 999 // $9.99
          };
          break;
        case 'professional':
          priceData = {
            currency: 'usd',
            product_data: {
              name: 'ProFylix Professional Analysis',
              description: 'Everything in Starter + profit analysis, marketing calendar, trending insights'
            },
            unit_amount: 1999 // $19.99
          };
          break;
        case 'enterprise':
          priceData = {
            currency: 'usd',
            product_data: {
              name: 'ProFylix Enterprise Analysis',
              description: 'Everything in Professional + design variations, sales projections, priority support'
            },
            unit_amount: 3999 // $39.99
          };
          break;
        default:
          return res.status(400).json({ error: 'Invalid tier' });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: priceData,
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/home?payment=success`,
        cancel_url: `${req.headers.origin}/`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // Handle successful payment (webhook simulation for demo)
  app.post("/api/payment-success", async (req, res) => {
    try {
      const { paymentIntentId, credits } = req.body;
      
      // In production, verify the payment with Stripe
      // For demo, just acknowledge success
      console.log(`Payment successful: ${paymentIntentId}, credits: ${credits}`);
      
      res.json({ 
        success: true, 
        message: `Successfully purchased ${credits} credits!` 
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ 
        message: "Failed to process payment",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
