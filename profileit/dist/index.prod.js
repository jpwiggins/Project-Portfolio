var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  buyerProfiles: () => buyerProfiles,
  generateProfileRequestSchema: () => generateProfileRequestSchema,
  insertBuyerProfileSchema: () => insertBuyerProfileSchema,
  insertPaymentSchema: () => insertPaymentSchema,
  payments: () => payments,
  sessions: () => sessions,
  upsertUserSchema: () => upsertUserSchema,
  users: () => users
});
import { pgTable, text, serial, integer, json, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var sessions, users, buyerProfiles, payments, upsertUserSchema, insertBuyerProfileSchema, insertPaymentSchema, generateProfileRequestSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    sessions = pgTable("sessions", {
      sid: varchar("sid").primaryKey(),
      sess: json("sess").notNull(),
      expire: timestamp("expire").notNull()
    });
    users = pgTable("users", {
      id: varchar("id").primaryKey().notNull(),
      email: varchar("email").unique(),
      firstName: varchar("first_name"),
      lastName: varchar("last_name"),
      profileImageUrl: varchar("profile_image_url"),
      credits: integer("credits").default(0),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    buyerProfiles = pgTable("buyer_profiles", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id),
      niche: text("niche").notNull(),
      productType: text("product_type").notNull(),
      profileData: json("profile_data").notNull(),
      designRecommendations: json("design_recommendations").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    payments = pgTable("payments", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id),
      stripePaymentIntentId: varchar("stripe_payment_intent_id").notNull(),
      amount: integer("amount").notNull(),
      // in cents
      credits: integer("credits").notNull(),
      status: varchar("status").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    upsertUserSchema = createInsertSchema(users).pick({
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profileImageUrl: true
    });
    insertBuyerProfileSchema = createInsertSchema(buyerProfiles).pick({
      userId: true,
      niche: true,
      productType: true,
      profileData: true,
      designRecommendations: true
    });
    insertPaymentSchema = createInsertSchema(payments).pick({
      userId: true,
      stripePaymentIntentId: true,
      amount: true,
      credits: true,
      status: true
    });
    generateProfileRequestSchema = z.object({
      niche: z.string().min(1, "Niche is required"),
      productType: z.string().min(1, "Product type is required")
    });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  db: () => db,
  pool: () => pool
});
import { Pool as PgPool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new PgPool({
      connectionString: process.env.DATABASE_URL,
      // Add connection pool settings for better reliability
      max: 20,
      idleTimeoutMillis: 3e4,
      connectionTimeoutMillis: 2e3
    });
    db = drizzle(pool, { schema: schema_exports });
  }
});

// server/index.prod.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
init_schema();
init_db();
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations for Replit Auth
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async updateUserCredits(userId, credits) {
    const [user] = await db.update(users).set({ credits, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, userId)).returning();
    return user;
  }
  // Profile operations
  async createBuyerProfile(profile) {
    const [savedProfile] = await db.insert(buyerProfiles).values(profile).returning();
    return savedProfile;
  }
  async getBuyerProfile(id) {
    const [profile] = await db.select().from(buyerProfiles).where(eq(buyerProfiles.id, id));
    return profile || void 0;
  }
  async getUserProfiles(userId) {
    return await db.select().from(buyerProfiles).where(eq(buyerProfiles.userId, userId));
  }
  async getAllProfiles() {
    return await db.select().from(buyerProfiles).limit(50);
  }
  // Payment operations
  async createPayment(payment) {
    const [savedPayment] = await db.insert(payments).values(payment).returning();
    return savedPayment;
  }
  async updatePaymentStatus(paymentIntentId, status) {
    await db.update(payments).set({ status }).where(eq(payments.stripePaymentIntentId, paymentIntentId));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
init_schema();
import Stripe from "stripe";

// server/services/openai.ts
import OpenAI from "openai";
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY must be set in environment variables. API key not found.");
}
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
  // Ensure there is no default key set
});
async function generateBuyerProfile(niche) {
  const prompt = `You are a market research expert.

Create a complete buyer persona for the niche "${niche}".

Break it into these 9 categories and provide detailed, emotionally rich content for each:

1. **Core Demographics** - Age, gender, income, education, life stage
2. **Daily Life & Routines** - Morning, work, evening, weekend habits
3. **Animal/Archetype Identity** - Spirit animal, personality archetype, core traits
4. **Geographic Insights** - Location preferences, climate, lifestyle, community values
5. **Cross-Niche Passions** - Related interests and hobbies they pursue
6. **Language & Slang** - Key terms, phrases, hashtags, communication tone
7. **Work Life Snapshot** - Career type, work style, goals, challenges
8. **Food & Drink Culture** - Diet preferences, drinks, eating habits, restrictions
9. **Values & Emotional Drivers** - Core values, motivations, pain points, desires

Make it emotionally rich and helpful for a print-on-demand designer. Respond with JSON in this exact format:
{
  "coreDemographics": "detailed content here",
  "dailyLife": "detailed content here", 
  "archetype": "detailed content here",
  "geographic": "detailed content here",
  "crossNiche": "detailed content here",
  "language": "detailed content here",
  "workLife": "detailed content here",
  "foodCulture": "detailed content here",
  "values": "detailed content here"
}`;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    throw new Error("Failed to generate buyer profile: " + error.message);
  }
}
async function generateDesignRecommendations(profileData, productType) {
  const prompt = `You are a creative director for a print-on-demand brand.

Using this buyer profile:
Core Demographics: ${profileData.coreDemographics}
Daily Life: ${profileData.dailyLife}
Archetype: ${profileData.archetype}
Geographic: ${profileData.geographic}
Cross-Niche: ${profileData.crossNiche}
Language: ${profileData.language}
Work Life: ${profileData.workLife}
Food Culture: ${profileData.foodCulture}
Values: ${profileData.values}

And this product type: ${productType}

Generate detailed design recommendations, SEO optimization, and trending insights. Respond with JSON in this exact format:
{
  "slogans": ["slogan1", "slogan2", "slogan3"],
  "visualIdeas": [
    {"name": "Visual Name", "description": "detailed description", "icon": "fas fa-icon-name"},
    {"name": "Visual Name 2", "description": "detailed description", "icon": "fas fa-icon-name"},
    {"name": "Visual Name 3", "description": "detailed description", "icon": "fas fa-icon-name"}
  ],
  "fonts": {
    "primary": "Font Name (reason)",
    "accent": "Font Name (reason)", 
    "body": "Font Name (reason)"
  },
  "colors": {
    "palette": ["#color1", "#color2", "#color3", "#color4"],
    "description": "description of color scheme and psychology"
  },
  "layouts": [
    {"name": "Layout Name", "description": "detailed description"},
    {"name": "Layout Name 2", "description": "detailed description"},
    {"name": "Layout Name 3", "description": "detailed description"}
  ],
  "mockups": [
    {"name": "Mockup Setting", "description": "description", "setting": "environment description"},
    {"name": "Mockup Setting 2", "description": "description", "setting": "environment description"},
    {"name": "Mockup Setting 3", "description": "description", "setting": "environment description"},
    {"name": "Mockup Setting 4", "description": "description", "setting": "environment description"}
  ],
  "seoOptimization": {
    "productTitles": ["SEO-optimized product title 1", "title 2", "title 3"],
    "descriptions": ["Product description 1", "description 2", "description 3"],
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
  },
  "trendingInsights": {
    "currentTrends": [
      {
        "trend": "Current trend description",
        "relevance": "How it relates to the niche",
        "salesPotential": "High"
      }
    ],
    "seasonalOpportunities": [
      {
        "season": "Season name",
        "opportunity": "Opportunity description",
        "timing": "Best timing"
      }
    ],
    "competitorAnalysis": {
      "topSellingStyles": ["style1", "style2", "style3"],
      "priceRanges": ["$15-25", "$25-35", "$35-45"],
      "marketGaps": ["gap1", "gap2", "gap3"]
    }
  }
}

Focus on:
1. Emotional connection and buyer psychology for designs
2. SEO-optimized product titles and descriptions for better discoverability
3. Current trends and seasonal opportunities in this niche
4. Competitor analysis and market gaps to exploit
5. Actionable insights to increase sales and reduce guesswork`;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      slogans: [
        "Life's Better with This Passion",
        "Vibes Only - Premium Quality",
        "Powered by Pure Energy"
      ],
      visualIdeas: [
        {
          name: "Minimalist Icon",
          description: "Simple, clean icon representing the niche",
          icon: "\u2728"
        },
        {
          name: "Typography Focus",
          description: "Bold text-based design with niche-specific messaging",
          icon: "\u{1F524}"
        },
        {
          name: "Lifestyle Integration",
          description: "Design that shows the product in everyday use",
          icon: "\u{1F31F}"
        }
      ],
      fonts: {
        primary: "Montserrat Bold (Modern and trustworthy)",
        accent: "Playfair Display (Elegant and distinctive)",
        body: "Open Sans (Highly readable and friendly)"
      },
      colors: {
        palette: ["#2563eb", "#7c3aed", "#059669", "#dc2626"],
        description: "Modern, vibrant colors that appeal to the target demographic with psychological impact"
      },
      layouts: [
        {
          name: "Center Focus",
          description: "Main design element centered with supporting text - works great for bold statements"
        },
        {
          name: "Corner Accent",
          description: "Small design element in corner with main text - subtle but effective"
        },
        {
          name: "Full Coverage",
          description: "Design covers entire product surface - maximum visual impact"
        }
      ],
      mockups: [
        {
          name: "Lifestyle Shot",
          description: "Product shown in natural, everyday context",
          setting: "Casual, relatable environment that target audience identifies with"
        },
        {
          name: "Studio Clean",
          description: "Professional product photography with clean background",
          setting: "Minimalist studio setup highlighting product details"
        },
        {
          name: "Action Scene",
          description: "Product being used in relevant activity or scenario",
          setting: "Dynamic environment showing product in use"
        },
        {
          name: "Flat Lay",
          description: "Overhead shot with complementary items and styling",
          setting: "Curated flat lay with lifestyle accessories"
        }
      ],
      seoOptimization: {
        productTitles: [
          `Premium ${productType} - Perfect Gift for Enthusiasts`,
          `Unique ${productType} Design - High Quality & Comfortable`,
          `Funny ${productType} - Great Conversation Starter`
        ],
        descriptions: [
          `Show your passion with this premium ${productType}. Perfect for daily wear or as a thoughtful gift. Made with high-quality materials for lasting comfort and style.`,
          `Express yourself with this unique ${productType} featuring exclusive design. Comfortable, durable, and guaranteed to start conversations wherever you go.`,
          `Premium ${productType} that combines style with comfort. Whether you're treating yourself or finding the perfect gift, this is designed to impress.`
        ],
        tags: [productType.toLowerCase(), "gift", "premium", "unique", "comfortable", "durable", "high-quality", "exclusive"],
        keywords: [`${productType} gift`, `unique ${productType}`, `premium ${productType}`, `comfortable ${productType}`]
      },
      trendingInsights: {
        currentTrends: [
          {
            trend: "Minimalist aesthetic with bold statements",
            relevance: "Appeals to modern consumers who want clean, impactful designs that make a statement",
            salesPotential: "High"
          },
          {
            trend: "Vintage-inspired designs with modern twists",
            relevance: "Nostalgic appeal combined with contemporary style attracts broader audience",
            salesPotential: "Medium"
          },
          {
            trend: "Personalized and customizable options",
            relevance: "Customers want products that feel unique to them and their interests",
            salesPotential: "High"
          }
        ],
        seasonalOpportunities: [
          {
            season: "Holiday Season",
            opportunity: "Gift-focused marketing and bundle offers with emotional messaging",
            timing: "November - December (peak gift-giving season)"
          },
          {
            season: "Back to School",
            opportunity: "Student-targeted designs and campus themes with fresh starts messaging",
            timing: "August - September (new semester energy)"
          },
          {
            season: "Spring/Summer",
            opportunity: "Bright, optimistic designs with outdoor and activity themes",
            timing: "March - July (seasonal mood boost)"
          }
        ],
        competitorAnalysis: {
          topSellingStyles: ["Minimalist text-based designs", "Vintage-inspired graphics", "Humorous sayings and quotes"],
          priceRanges: ["$18-24 (budget-friendly)", "$25-32 (mid-range)", "$35-45 (premium)"],
          marketGaps: ["Truly personalized options", "Eco-friendly materials messaging", "Size-inclusive designs", "Cultural representation"]
        }
      }
    };
  }
}

// server/routes.ts
import bcrypt from "bcrypt";
import session from "express-session";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_...");
var admin = {
  email: "joan@example.com",
  // Password: admin123 - hashed with bcrypt (newly generated)
  passwordHash: "$2b$10$MAx5ghxwmD.kjry/INBDxu1HOYrBkHdUDgAgDy8hyIKm5SeaHgXpS"
};
async function registerRoutes(app2) {
  app2.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      service: "proflix-api"
    });
  });
  app2.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1e3
      // 24 hours
    }
  }));
  app2.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email === admin.email) {
        const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
        if (passwordMatch) {
          req.session.user = "admin";
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
        req.session.user = "user";
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
  app2.get("/api/auth/admin-status", (req, res) => {
    const isAdmin = req.session?.user === "admin";
    res.json({ isAdmin });
  });
  app2.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Logout failed" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });
  app2.get("/api/login", (req, res) => {
    res.redirect("/login.html");
  });
  app2.get("/api/auth/user", (req, res) => {
    const sessionUser = req.session?.user;
    if (sessionUser === "admin") {
      res.json({
        id: "admin",
        email: "joan@example.com",
        isAdmin: true
      });
    } else if (sessionUser) {
      res.json({
        id: "user",
        email: "demo@example.com",
        isAdmin: false
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
  app2.post("/api/generate-profile", async (req, res) => {
    try {
      const validatedData = generateProfileRequestSchema.parse(req.body);
      const { niche, productType } = validatedData;
      try {
        const profileData = await generateBuyerProfile(niche);
        const designRecommendations = await generateDesignRecommendations(profileData, productType);
        const savedProfile = await storage.createBuyerProfile({
          userId: null,
          niche,
          productType,
          profileData,
          designRecommendations
        });
        res.json({
          id: savedProfile.id,
          niche: savedProfile.niche,
          productType: savedProfile.productType,
          profileData: savedProfile.profileData,
          designRecommendations: savedProfile.designRecommendations,
          createdAt: savedProfile.createdAt
        });
      } catch (aiError) {
        console.log("AI generation failed, providing demo data for:", niche);
        const demoProfileData = {
          coreDemographics: `**Age Range:** 25-45 years old, predominantly female (70%)
**Income:** $35,000-$75,000 annually
**Education:** College-educated, health-conscious professionals
**Life Stage:** Busy professionals seeking work-life balance, some with young families
**Location:** Urban and suburban areas, health-conscious communities`,
          dailyLife: `**Morning:** 6 AM wake-up, meditation or stretching, healthy breakfast
**Work:** 9-5 desk jobs, frequent breaks for movement
**Evening:** ${niche.toLowerCase()} practice 3-4x per week, meal prep, self-care routines
**Weekend:** Longer ${niche.toLowerCase()} sessions, farmers markets, outdoor activities
**Sleep:** Prioritizes 7-8 hours, evening wind-down rituals`,
          archetype: `**Spirit Animal:** Graceful Swan - elegant, balanced, mindful
**Personality:** The Mindful Achiever - driven yet centered, success-oriented but values inner peace
**Core Traits:** Disciplined, authentic, community-minded, growth-focused
**Style:** Clean, minimalist aesthetic with natural elements`,
          geographic: `**Primary Locations:** California, New York, Colorado, Pacific Northwest
**Setting Preference:** Urban areas with access to nature, walkable neighborhoods
**Climate:** Prefers mild temperatures, outdoor-friendly environments
**Community:** Values wellness-focused communities, organic markets, studios within walking distance`,
          crossNiche: `**Wellness:** Meditation, healthy cooking, aromatherapy
**Fitness:** Pilates, hiking, cycling, swimming
**Lifestyle:** Sustainable living, plant-based nutrition, mindfulness
**Personal Growth:** Reading self-help, journaling, life coaching
**Social:** Wellness retreats, community classes, book clubs`,
          language: `**Key Terms:** "Namaste," "mindful," "intentional," "alignment," "flow state"
**Hashtags:** #mindfulmovement #wellnessjourney #selfcare #innerpeace #mindfullife
**Tone:** Gentle, encouraging, authentic, non-judgmental
**Communication:** Values inclusivity, uses calming language, avoids aggressive sales tactics`,
          workLife: `**Career Types:** Healthcare, education, creative fields, corporate wellness roles
**Work Style:** Values flexibility, work-life balance, meaningful work
**Challenges:** Stress management, sitting too long, maintaining energy
**Goals:** Career advancement while maintaining personal values and wellness
**Remote Work:** 40% work from home, seeking movement breaks`,
          foodCulture: `**Diet:** Plant-forward, organic when possible, minimal processed foods
**Drinks:** Herbal teas, smoothies, kombucha, limited coffee, lots of water
**Eating Habits:** Mindful eating, meal prep, intuitive eating principles
**Restrictions:** Many are vegetarian/vegan, gluten-sensitive, avoid artificial ingredients
**Social:** Enjoys healthy restaurants, cooking classes, farmers market visits`,
          values: `**Core Values:** Authenticity, balance, personal growth, community connection
**Emotional Drivers:** Desire for inner peace, fear of burnout, need for belonging
**Pain Points:** Time constraints, perfectionism, comparison to others
**Desires:** More energy, deeper connections, purposeful living
**Motivations:** Self-improvement, helping others, living mindfully`
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
              icon: "\u{1FAB7}"
            },
            {
              name: "Mountain Silhouette",
              description: "Minimalist mountain range with sun, symbolizing strength and mindfulness",
              icon: "\u26F0\uFE0F"
            },
            {
              name: "Flowing Typography",
              description: "Hand-lettered inspirational quotes with organic, flowing letterforms",
              icon: "\u2728"
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
            tags: [niche.toLowerCase().replace(/\s+/g, "-"), productType.toLowerCase().replace(/\s+/g, "-"), "gift", "premium", "unique", "comfortable", "durable", "high-quality"],
            keywords: [`${niche.toLowerCase()} ${productType.toLowerCase()}`, `${niche.toLowerCase()} gift`, `${niche.toLowerCase()} lover`, `${niche.toLowerCase()} enthusiast`]
          },
          trendingInsights: {
            currentTrends: [
              {
                trend: "Minimalist aesthetic with bold statements",
                relevance: `Appeals to ${niche.toLowerCase()} enthusiasts who want clean, impactful designs that make a statement`,
                salesPotential: "High"
              },
              {
                trend: "Vintage-inspired designs with modern twists",
                relevance: `Nostalgic appeal combined with contemporary style attracts broader ${niche.toLowerCase()} audience`,
                salesPotential: "Medium"
              },
              {
                trend: "Personalized and customizable options",
                relevance: `${niche} customers want products that feel unique to them and their specific interests`,
                salesPotential: "High"
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
        const savedProfile = await storage.createBuyerProfile({
          userId: null,
          // Public profiles for now
          niche,
          productType,
          profileData: demoProfileData,
          designRecommendations: demoDesignRecommendations
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
  app2.get("/api/profiles", async (req, res) => {
    try {
      const sessionUser = req.session?.user;
      let profiles = [];
      if (sessionUser === "admin") {
        profiles = await storage.getAllProfiles();
      } else {
        profiles = await storage.getAllProfiles();
        profiles = profiles.slice(-10);
      }
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });
  app2.get("/api/profiles/:id", async (req, res) => {
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
  app2.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { tier } = req.body;
      if (!stripe) {
        const amounts = { starter: 9.99, professional: 19.99, enterprise: 39.99 };
        const amount = amounts[tier];
        return res.json({
          error: "PAYMENT_CONFIG_NEEDED",
          message: `To complete your ${tier} purchase ($${amount}), please contact support for payment processing.`,
          tier,
          amount
        });
      }
      let priceData;
      switch (tier) {
        case "starter":
          priceData = {
            currency: "usd",
            product_data: {
              name: "ProFylix Starter Analysis",
              description: "Complete buyer profile, design recommendations, SEO optimization"
            },
            unit_amount: 999
            // $9.99
          };
          break;
        case "professional":
          priceData = {
            currency: "usd",
            product_data: {
              name: "ProFylix Professional Analysis",
              description: "Everything in Starter + profit analysis, marketing calendar, trending insights"
            },
            unit_amount: 1999
            // $19.99
          };
          break;
        case "enterprise":
          priceData = {
            currency: "usd",
            product_data: {
              name: "ProFylix Enterprise Analysis",
              description: "Everything in Professional + design variations, sales projections, priority support"
            },
            unit_amount: 3999
            // $39.99
          };
          break;
        default:
          return res.status(400).json({ error: "Invalid tier" });
      }
      const session2 = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: priceData,
          quantity: 1
        }],
        mode: "payment",
        success_url: `${req.headers.origin}/home?payment=success`,
        cancel_url: `${req.headers.origin}/`
      });
      res.json({ url: session2.url });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });
  app2.post("/api/payment-success", async (req, res) => {
    try {
      const { paymentIntentId, credits } = req.body;
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
  const httpServer = createServer(app2);
  return httpServer;
}

// init-db.js
import { exec } from "child_process";
import { promisify } from "util";
var execAsync = promisify(exec);
async function waitForDatabase() {
  const maxRetries = 30;
  let retries = 0;
  console.log("Waiting for database to be ready...");
  while (retries < maxRetries) {
    try {
      const { Pool } = await import("pg");
      const pool2 = new Pool({ connectionString: process.env.DATABASE_URL });
      await pool2.query("SELECT 1");
      await pool2.end();
      console.log("Database is ready!");
      return true;
    } catch (error) {
      retries++;
      console.log(`Database not ready yet (attempt ${retries}/${maxRetries}). Waiting...`);
      await new Promise((resolve) => setTimeout(resolve, 2e3));
    }
  }
  throw new Error("Database failed to become ready within timeout period");
}
async function runMigrations() {
  console.log("Running database migrations...");
  try {
    const { migrate } = await import("drizzle-orm/node-postgres/migrator");
    const { db: db2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    await migrate(db2, { migrationsFolder: "./migrations" });
    console.log("Database migrations completed successfully!");
  } catch (error) {
    console.error("Failed to run migrations:", error);
    console.log("Continuing without migrations...");
  }
}
async function initializeDatabase() {
  try {
    await waitForDatabase();
    await runMigrations();
    console.log("Database initialization completed successfully!");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

// server/index.prod.ts
import path from "path";
var log = (message, source = "express") => {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
};
var serveStatic = (app2) => {
  app2.use(express.static("client"));
  app2.get("*", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "client", "index.html"));
  });
};
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await initializeDatabase();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  serveStatic(app);
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
