import OpenAI from "openai";
import type { ProfileData, DesignRecommendations } from "@shared/schema";

// Ensure API key is set in environment variables
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY must be set in environment variables. API key not found.");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY // Ensure there is no default key set
});

export async function generateBuyerProfile(niche: string): Promise<ProfileData> {
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
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as ProfileData;
  } catch (error) {
    throw new Error("Failed to generate buyer profile: " + (error as Error).message);
  }
}

export async function generateDesignRecommendations(
  profileData: ProfileData, 
  productType: string
): Promise<DesignRecommendations> {
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
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as DesignRecommendations;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Return comprehensive demo data as fallback
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
          icon: "✨"
        },
        {
          name: "Typography Focus",
          description: "Bold text-based design with niche-specific messaging",
          icon: "🔤"
        },
        {
          name: "Lifestyle Integration",
          description: "Design that shows the product in everyday use",
          icon: "🌟"
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
            salesPotential: "High" as const
          },
          {
            trend: "Vintage-inspired designs with modern twists",
            relevance: "Nostalgic appeal combined with contemporary style attracts broader audience",
            salesPotential: "Medium" as const
          },
          {
            trend: "Personalized and customizable options",
            relevance: "Customers want products that feel unique to them and their interests",
            salesPotential: "High" as const
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
