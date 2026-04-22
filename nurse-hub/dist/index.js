var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// client/public/manifest.json
var require_manifest = __commonJS({
  "client/public/manifest.json"(exports, module) {
    module.exports = {
      name: "NurseHub",
      short_name: "NurseHub",
      start_url: ".",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#2563eb",
      description: "Essential tools for nurses in one platform.",
      icons: [
        {
          src: "/assets/nursehub-logo.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/assets/nursehub-logo.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    };
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import Stripe from "stripe";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminAccounts: () => adminAccounts,
  chatMessages: () => chatMessages,
  clinicalProtocols: () => clinicalProtocols,
  diagnosticConditions: () => diagnosticConditions,
  drugs: () => drugs,
  insertChatMessageSchema: () => insertChatMessageSchema,
  insertShiftSchema: () => insertShiftSchema,
  insertWellnessEntrySchema: () => insertWellnessEntrySchema,
  mentalHealthResources: () => mentalHealthResources,
  sessions: () => sessions,
  shifts: () => shifts,
  shiftsRelations: () => shiftsRelations,
  translationPhrases: () => translationPhrases,
  users: () => users,
  usersRelations: () => usersRelations,
  wellnessEntries: () => wellnessEntries,
  wellnessEntriesRelations: () => wellnessEntriesRelations
});
import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  uuid
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  password: varchar("password").default("temp_password_need_reset"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("free"),
  role: varchar("role").default("nurse"),
  // admin, nurse, user
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var shifts = pgTable("shifts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: varchar("location"),
  shiftType: varchar("shift_type"),
  // day, night, float, training
  status: varchar("status").default("scheduled"),
  // scheduled, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  chatRoomId: varchar("chat_room_id").notNull(),
  senderId: varchar("sender_id").references(() => users.id),
  senderType: varchar("sender_type").notNull(),
  // user, ai
  message: text("message").notNull(),
  messageType: varchar("message_type").default("text"),
  // text, image, file
  metadata: jsonb("metadata"),
  // for storing additional data
  createdAt: timestamp("created_at").defaultNow()
});
var clinicalProtocols = pgTable("clinical_protocols", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  category: varchar("category").notNull(),
  content: text("content").notNull(),
  keywords: text("keywords").array(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  isActive: boolean("is_active").default(true)
});
var drugs = pgTable("drugs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  genericName: varchar("generic_name"),
  brandNames: text("brand_names").array(),
  category: varchar("category"),
  dosage: text("dosage"),
  indications: text("indications"),
  contraindications: text("contraindications"),
  sideEffects: text("side_effects"),
  interactions: text("interactions"),
  keywords: text("keywords").array()
});
var diagnosticConditions = pgTable("diagnostic_conditions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  category: varchar("category"),
  description: text("description"),
  symptoms: text("symptoms").array(),
  imageUrls: text("image_urls").array(),
  differentialDiagnosis: text("differential_diagnosis"),
  keywords: text("keywords").array()
});
var mentalHealthResources = pgTable("mental_health_resources", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  type: varchar("type").notNull(),
  // meditation, crisis_support, article, video
  content: text("content"),
  url: varchar("url"),
  duration: integer("duration"),
  // in minutes
  tags: text("tags").array(),
  isActive: boolean("is_active").default(true)
});
var translationPhrases = pgTable("translation_phrases", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  englishPhrase: varchar("english_phrase").notNull(),
  category: varchar("category"),
  translations: jsonb("translations").notNull(),
  // {language_code: {text: "", audio_url: ""}}
  usage: integer("usage").default(0)
});
var wellnessEntries = pgTable("wellness_entries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  stressLevel: integer("stress_level"),
  // 1-10
  mood: varchar("mood"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  shifts: many(shifts),
  wellnessEntries: many(wellnessEntries)
}));
var shiftsRelations = relations(shifts, ({ one }) => ({
  user: one(users, {
    fields: [shifts.userId],
    references: [users.id]
  })
}));
var wellnessEntriesRelations = relations(wellnessEntries, ({ one }) => ({
  user: one(users, {
    fields: [wellnessEntries.userId],
    references: [users.id]
  })
}));
var adminAccounts = pgTable("admin_accounts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  email: varchar("email"),
  role: varchar("role").default("admin"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at")
});
var insertShiftSchema = createInsertSchema(shifts).omit({
  id: true,
  createdAt: true
});
var insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true
});
var insertWellnessEntrySchema = createInsertSchema(wellnessEntries).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, or, and, gte, lte, ilike, count } from "drizzle-orm";
import bcrypt from "bcrypt";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createUser(userData) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  async updateUserStripeInfo(userId, customerId, subscriptionId) {
    const [user] = await db.update(users).set({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: "active",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, userId)).returning();
    return user;
  }
  // Shifts operations
  async getShifts(userId) {
    return await db.select().from(shifts).where(eq(shifts.userId, userId)).orderBy(desc(shifts.startTime));
  }
  async getShiftsInRange(userId, startDate, endDate) {
    return await db.select().from(shifts).where(
      and(
        eq(shifts.userId, userId),
        gte(shifts.startTime, startDate),
        lte(shifts.endTime, endDate)
      )
    ).orderBy(shifts.startTime);
  }
  async createShift(shift) {
    const [newShift] = await db.insert(shifts).values(shift).returning();
    return newShift;
  }
  async updateShift(id, userId, updates) {
    const [updatedShift] = await db.update(shifts).set(updates).where(and(eq(shifts.id, id), eq(shifts.userId, userId))).returning();
    return updatedShift;
  }
  async deleteShift(id, userId) {
    const result = await db.delete(shifts).where(and(eq(shifts.id, id), eq(shifts.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }
  // Chat operations
  async getChatMessages(chatRoomId, limit = 50) {
    return await db.select().from(chatMessages).where(eq(chatMessages.chatRoomId, chatRoomId)).orderBy(desc(chatMessages.createdAt)).limit(limit);
  }
  async createChatMessage(message) {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }
  // Clinical data operations
  async searchClinicalProtocols(query) {
    return await db.select().from(clinicalProtocols).where(
      and(
        eq(clinicalProtocols.isActive, true),
        or(
          ilike(clinicalProtocols.title, `%${query}%`),
          ilike(clinicalProtocols.content, `%${query}%`)
        )
      )
    ).orderBy(clinicalProtocols.title);
  }
  async searchDrugs(query) {
    return await db.select().from(drugs).where(
      or(
        ilike(drugs.name, `%${query}%`),
        ilike(drugs.genericName, `%${query}%`)
      )
    ).orderBy(drugs.name);
  }
  async searchDiagnosticConditions(query) {
    return await db.select().from(diagnosticConditions).where(
      or(
        ilike(diagnosticConditions.name, `%${query}%`),
        ilike(diagnosticConditions.description, `%${query}%`)
      )
    ).orderBy(diagnosticConditions.name);
  }
  // Mental health operations
  async getMentalHealthResources(type) {
    const conditions = [eq(mentalHealthResources.isActive, true)];
    if (type) {
      conditions.push(eq(mentalHealthResources.type, type));
    }
    return await db.select().from(mentalHealthResources).where(and(...conditions)).orderBy(mentalHealthResources.title);
  }
  // Translation operations
  async getTranslationPhrases(category) {
    const conditions = [];
    if (category) {
      conditions.push(eq(translationPhrases.category, category));
    }
    return await db.select().from(translationPhrases).where(conditions.length > 0 ? and(...conditions) : void 0).orderBy(desc(translationPhrases.usage), translationPhrases.englishPhrase);
  }
  async getTranslationPhrase(id) {
    const [phrase] = await db.select().from(translationPhrases).where(eq(translationPhrases.id, id));
    return phrase;
  }
  // Wellness operations
  async getWellnessEntries(userId, limit = 30) {
    return await db.select().from(wellnessEntries).where(eq(wellnessEntries.userId, userId)).orderBy(desc(wellnessEntries.createdAt)).limit(limit);
  }
  async createWellnessEntry(entry) {
    const [newEntry] = await db.insert(wellnessEntries).values(entry).returning();
    return newEntry;
  }
  async getLatestWellnessEntry(userId) {
    const [entry] = await db.select().from(wellnessEntries).where(eq(wellnessEntries.userId, userId)).orderBy(desc(wellnessEntries.createdAt)).limit(1);
    return entry;
  }
  // Admin operations
  async createAdminAccount(username, password, email) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const [admin] = await db.insert(adminAccounts).values({
      username,
      passwordHash,
      email
    }).returning();
    return admin;
  }
  async authenticateAdmin(username, password) {
    const [admin] = await db.select().from(adminAccounts).where(and(
      eq(adminAccounts.username, username),
      eq(adminAccounts.isActive, true)
    ));
    if (!admin) {
      return null;
    }
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return null;
    }
    await db.update(adminAccounts).set({ lastLoginAt: /* @__PURE__ */ new Date() }).where(eq(adminAccounts.id, admin.id));
    return admin;
  }
  async getAdminStats() {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [activeSubscriptions] = await db.select({ count: count() }).from(users).where(eq(users.subscriptionStatus, "active"));
    const [shiftCount] = await db.select({ count: count() }).from(shifts);
    const monthlyRevenue = (activeSubscriptions?.count || 0) * 49;
    return {
      totalUsers: userCount?.count || 0,
      activeSubscriptions: activeSubscriptions?.count || 0,
      monthlyRevenue,
      totalShifts: shiftCount?.count || 0,
      translationsUsed: 1250
      // Sample data since we don't track this yet
    };
  }
  // Revenue Analytics Implementation
  async getTotalUsers() {
    const result = await db.select({ count: count() }).from(users);
    return result[0]?.count || 0;
  }
  async getActiveSubscriptions() {
    const result = await db.select({ count: count() }).from(users).where(eq(users.subscriptionStatus, "active"));
    return result[0]?.count || 0;
  }
  async getTrialUsers() {
    const result = await db.select({ count: count() }).from(users).where(eq(users.subscriptionStatus, "trial"));
    return result[0]?.count || 0;
  }
  async getMonthlyRevenue() {
    const activeUsers = await this.getActiveSubscriptions();
    return activeUsers * 49;
  }
  async getChurnRate() {
    const totalUsers = await this.getTotalUsers();
    const activeUsers = await this.getActiveSubscriptions();
    if (totalUsers === 0) return 0;
    return Math.round((totalUsers - activeUsers) / totalUsers * 100);
  }
  async getConversionRate() {
    const trialUsers = await this.getTrialUsers();
    const activeUsers = await this.getActiveSubscriptions();
    const totalTrialAndActive = trialUsers + activeUsers;
    if (totalTrialAndActive === 0) return 0;
    return Math.round(activeUsers / totalTrialAndActive * 100);
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  if (!stored || !stored.includes(".")) {
    return false;
  }
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    return false;
  }
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "nursehub-dev-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1e3,
      // 7 days
      sameSite: "lax"
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !user.password || !await comparePasswords(password, user.password)) {
            return done(null, false, { message: "Invalid email or password" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        profileImageUrl: null
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (err2) => {
        if (err2) {
          return next(err2);
        }
        res.json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        });
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user;
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  });
}
function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// server/routes.ts
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY not set - Stripe functionality will be disabled");
}
var stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil"
}) : null;
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/shifts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const startDate = req.query.start ? new Date(req.query.start) : void 0;
      const endDate = req.query.end ? new Date(req.query.end) : void 0;
      const shifts2 = startDate && endDate ? await storage.getShiftsInRange(userId, startDate, endDate) : await storage.getShifts(userId);
      res.json(shifts2);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      res.status(500).json({ message: "Failed to fetch shifts" });
    }
  });
  app2.post("/api/shifts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const shiftData = insertShiftSchema.parse({ ...req.body, userId });
      const shift = await storage.createShift(shiftData);
      res.json(shift);
    } catch (error) {
      console.error("Error creating shift:", error);
      res.status(500).json({ message: "Failed to create shift" });
    }
  });
  app2.put("/api/shifts/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const shiftId = req.params.id;
      const updates = req.body;
      const shift = await storage.updateShift(shiftId, userId, updates);
      if (!shift) {
        return res.status(404).json({ message: "Shift not found" });
      }
      res.json(shift);
    } catch (error) {
      console.error("Error updating shift:", error);
      res.status(500).json({ message: "Failed to update shift" });
    }
  });
  app2.delete("/api/shifts/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const shiftId = req.params.id;
      const success = await storage.deleteShift(shiftId, userId);
      if (!success) {
        return res.status(404).json({ message: "Shift not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting shift:", error);
      res.status(500).json({ message: "Failed to delete shift" });
    }
  });
  app2.get("/api/clinical/protocols", async (req, res) => {
    try {
      const query = req.query.q || "";
      const protocols = await storage.searchClinicalProtocols(query);
      res.json(protocols);
    } catch (error) {
      console.error("Error searching protocols:", error);
      res.status(500).json({ message: "Failed to search protocols" });
    }
  });
  app2.get("/api/clinical/drugs", async (req, res) => {
    try {
      const query = req.query.q || "";
      const drugs2 = await storage.searchDrugs(query);
      res.json(drugs2);
    } catch (error) {
      console.error("Error searching drugs:", error);
      res.status(500).json({ message: "Failed to search drugs" });
    }
  });
  app2.get("/api/clinical/conditions", async (req, res) => {
    try {
      const query = req.query.q || "";
      const conditions = await storage.searchDiagnosticConditions(query);
      res.json(conditions);
    } catch (error) {
      console.error("Error searching conditions:", error);
      res.status(500).json({ message: "Failed to search conditions" });
    }
  });
  app2.get("/api/mental-health/resources", async (req, res) => {
    try {
      const type = req.query.type;
      const resources = await storage.getMentalHealthResources(type);
      res.json(resources);
    } catch (error) {
      console.error("Error fetching mental health resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });
  app2.get("/api/translation/phrases", async (req, res) => {
    try {
      const category = req.query.category;
      const phrases = await storage.getTranslationPhrases(category);
      res.json(phrases);
    } catch (error) {
      console.error("Error fetching translation phrases:", error);
      res.status(500).json({ message: "Failed to fetch phrases" });
    }
  });
  app2.get("/api/translation/phrases/:id", async (req, res) => {
    try {
      const phraseId = req.params.id;
      const phrase = await storage.getTranslationPhrase(phraseId);
      if (!phrase) {
        return res.status(404).json({ message: "Phrase not found" });
      }
      res.json(phrase);
    } catch (error) {
      console.error("Error fetching translation phrase:", error);
      res.status(500).json({ message: "Failed to fetch phrase" });
    }
  });
  app2.get("/api/wellness/entries", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const entries = await storage.getWellnessEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching wellness entries:", error);
      res.status(500).json({ message: "Failed to fetch wellness entries" });
    }
  });
  app2.post("/api/wellness/entries", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const entryData = insertWellnessEntrySchema.parse({ ...req.body, userId });
      const entry = await storage.createWellnessEntry(entryData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating wellness entry:", error);
      res.status(500).json({ message: "Failed to create wellness entry" });
    }
  });
  app2.get("/api/wellness/latest", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const entry = await storage.getLatestWellnessEntry(userId);
      res.json(entry || null);
    } catch (error) {
      console.error("Error fetching latest wellness entry:", error);
      res.status(500).json({ message: "Failed to fetch latest wellness entry" });
    }
  });
  app2.get("/api/admin/revenue", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.email !== "admin@nursehub.com") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const analytics = {
        totalUsers: await storage.getTotalUsers(),
        activeSubscriptions: await storage.getActiveSubscriptions(),
        trialUsers: await storage.getTrialUsers(),
        monthlyRevenue: await storage.getMonthlyRevenue(),
        churnRate: await storage.getChurnRate(),
        conversionRate: await storage.getConversionRate()
      };
      res.json(analytics);
    } catch (error) {
      console.error("Revenue analytics error:", error);
      res.status(500).json({ message: "Failed to fetch revenue data" });
    }
  });
  app2.get("/api/subscription/status", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const subscriptionStatus = {
        hasActiveSubscription: user.subscriptionStatus === "active",
        subscriptionId: user.stripeSubscriptionId || null,
        customerId: user.stripeCustomerId || null,
        status: user.subscriptionStatus || "free",
        trialDaysRemaining: user.subscriptionStatus === "trial" ? 3 : 0
      };
      res.json(subscriptionStatus);
    } catch (error) {
      console.error("Subscription status error:", error);
      res.status(500).json({ message: "Failed to check subscription status" });
    }
  });
  if (stripe) {
    app2.post("/api/create-subscription", isAuthenticated, async (req, res) => {
      try {
        const userId = req.user.id;
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        if (user.stripeSubscriptionId) {
          const subscription2 = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          res.json({
            subscriptionId: subscription2.id,
            clientSecret: subscription2.latest_invoice?.payment_intent?.client_secret
          });
          return;
        }
        if (!user.email) {
          return res.status(400).json({ message: "User email required" });
        }
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim()
        });
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{
            price: process.env.STRIPE_PRICE_ID || "price_default"
          }],
          payment_behavior: "default_incomplete",
          expand: ["latest_invoice.payment_intent"]
        });
        await storage.updateUserStripeInfo(userId, customer.id, subscription.id);
        res.json({
          subscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice?.payment_intent?.client_secret
        });
      } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).json({ message: "Failed to create subscription" });
      }
    });
  }
  const adminAuth = (req, res, next) => {
    if (req.session?.adminId) {
      return next();
    }
    return res.status(401).json({ message: "Admin authentication required" });
  };
  app2.post("/api/demo/login", async (req, res) => {
    try {
      const demoUser = {
        claims: {
          sub: "demo-user-001",
          email: "demo@nursehub.pro",
          first_name: "Demo",
          last_name: "User",
          profile_image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"
        },
        access_token: "demo-token",
        expires_at: Math.floor(Date.now() / 1e3) + 3600
        // 1 hour from now
      };
      const existingUser = await storage.getUser("demo-user-001");
      if (!existingUser) {
        await storage.createUser({
          id: "demo-user-001",
          email: "demo@nursehub.pro",
          firstName: "Demo",
          lastName: "User",
          profileImageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"
        });
      }
      req.user = demoUser;
      req.session.passport = { user: demoUser };
      res.json({ message: "Demo session created" });
    } catch (error) {
      console.error("Demo login error:", error);
      res.status(500).json({ message: "Demo not available" });
    }
  });
  app2.post("/api/admin/create", async (req, res) => {
    try {
      const { username, password, email } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const admin = await storage.createAdminAccount(username, password, email);
      res.json({ message: "Admin account created", admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Admin creation error:", error);
      res.status(500).json({ message: "Failed to create admin account" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const admin = await storage.authenticateAdmin(username, password);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.adminId = admin.id;
      req.session.isAdmin = true;
      res.json({ message: "Login successful", admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });
  app2.get("/api/admin/stats", adminAuth, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const clients = /* @__PURE__ */ new Map();
  wss.on("connection", (ws2) => {
    clients.set(ws2, { ws: ws2 });
    ws2.on("message", async (message) => {
      try {
        const data = JSON.parse(message);
        const client = clients.get(ws2);
        if (!client) return;
        switch (data.type) {
          case "join":
            client.userId = data.userId;
            client.chatRoomId = data.chatRoomId;
            break;
          case "message":
            if (client.userId && client.chatRoomId) {
              const chatMessage = await storage.createChatMessage({
                chatRoomId: client.chatRoomId,
                senderId: client.userId,
                senderType: "user",
                message: data.message,
                messageType: data.messageType || "text",
                metadata: data.metadata
              });
              clients.forEach((otherClient) => {
                if (otherClient.chatRoomId === client.chatRoomId && otherClient.ws.readyState === WebSocket.OPEN) {
                  otherClient.ws.send(JSON.stringify({
                    type: "message",
                    message: chatMessage
                  }));
                }
              });
              if (client.chatRoomId === "ai_assistant") {
                setTimeout(async () => {
                  const aiResponse = await storage.createChatMessage({
                    chatRoomId: client.chatRoomId,
                    senderId: null,
                    senderType: "ai",
                    message: `I understand you're asking about "${data.message}". I'll help you with clinical guidance and app navigation. Please note this is for educational purposes only and shouldn't replace professional medical consultation.`,
                    messageType: "text"
                  });
                  clients.forEach((otherClient) => {
                    if (otherClient.chatRoomId === client.chatRoomId && otherClient.ws.readyState === WebSocket.OPEN) {
                      otherClient.ws.send(JSON.stringify({
                        type: "message",
                        message: aiResponse
                      }));
                    }
                  });
                }, 1e3);
              }
            }
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    ws2.on("close", () => {
      clients.delete(ws2);
    });
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Proper __dirname for ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(async ({ mode }) => {
  const isProd = mode === "production";

  const plugins = [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "NurseHub",
        short_name: "NurseHub",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#2563eb",
        description: "Essential tools for nurses in one platform.",
        icons: [
          { src: "/assets/nursehub-logo.png", sizes: "192x192", type: "image/png" },
          { src: "/assets/nursehub-logo.png", sizes: "512x512", type: "image/png" }
        ]
      },
      workbox: { globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"] }
    }),
  ];

  return {
    plugins,
    // The client source lives in /client
    root: resolve(__dirname, "client"),

    // IMPORTANT: Build where the server serves from
    // Your server uses serveStatic() expecting server/dist/public
    build: {
      outDir: resolve(__dirname, "server", "dist", "public"),
      emptyOutDir: true,
    },

    server: {
      fs: { strict: true, deny: ["**/.*"] },
    },
  };
});


// server/vite.ts
import { nanoid } from "nanoid";
import { resolve as pathResolve } from "node:path";

// Define __dirname for ESM (reuse from above)
const __dirname2 = dirname(fileURLToPath(import.meta.url));

var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const viteConfig = {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "NurseHub",
          short_name: "NurseHub",
          start_url: ".",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#2563eb",
          description: "Essential tools for nurses in one platform.",
          icons: [
            { src: "/assets/nursehub-logo.png", sizes: "192x192", type: "image/png" },
            { src: "/assets/nursehub-logo.png", sizes: "512x512", type: "image/png" }
          ]
        },
        workbox: { globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"] }
      }),
    ],
    root: pathResolve(__dirname2, "client"),
    build: {
      outDir: pathResolve(__dirname2, "server", "dist", "public"),
      emptyOutDir: true,
    },
    server: {
      fs: { strict: true, deny: ["**/.*"] },
    },
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
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
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
