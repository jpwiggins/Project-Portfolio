import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  username: text("username").notNull(),
  companyName: text("company_name"),
  role: text("role").notNull().default("user"), // user, admin
  subscriptionTier: text("subscription_tier").notNull().default("trial"), // trial, starter, pro, agency
  subscriptionStatus: text("subscription_status").notNull().default("trial"), // trial, active, inactive, cancelled
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // privacy, security, data-processing, ai-governance
  description: text("description"),
  content: text("content"),
  version: text("version").notNull().default("1.0"),
  status: text("status").notNull().default("draft"), // draft, under-review, approved, archived
  frameworks: jsonb("frameworks").$type<string[]>().default([]), // gdpr, soc2, ai-act
  createdBy: text("created_by").notNull(),
  approvedBy: text("approved_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
});

export const complianceFrameworks = pgTable("compliance_frameworks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // GDPR, SOC2, EU_AI_ACT
  displayName: text("display_name").notNull(),
  description: text("description"),
  completionPercentage: decimal("completion_percentage", { precision: 5, scale: 2 }).default("0"),
  status: text("status").notNull().default("in-progress"), // compliant, in-progress, needs-attention
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const complianceChecks = pgTable("compliance_checks", {
  id: serial("id").primaryKey(),
  frameworkId: integer("framework_id").references(() => complianceFrameworks.id).notNull(),
  checkName: text("check_name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // completed, pending, failed
  evidence: text("evidence"),
  lastChecked: timestamp("last_checked").defaultNow().notNull(),
});

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // cloud-infrastructure, email-marketing, analytics, etc.
  riskLevel: text("risk_level").notNull().default("medium"), // low, medium, high
  gdprCompliant: boolean("gdpr_compliant").default(false),
  soc2Compliant: boolean("soc2_compliant").default(false),
  aiActCompliant: boolean("ai_act_compliant").default(false),
  lastAssessment: timestamp("last_assessment").defaultNow().notNull(),
  notes: text("notes"),
});

export const riskAssessments = pgTable("risk_assessments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  riskScore: integer("risk_score").notNull(), // 0-100
  riskLevel: text("risk_level").notNull(), // low, medium, high, critical
  category: text("category").notNull(), // data-privacy, security, operational, compliance
  mitigationPlan: text("mitigation_plan"),
  status: text("status").notNull().default("open"), // open, in-progress, mitigated, closed
  assignedTo: text("assigned_to"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const auditReports = pgTable("audit_reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // comprehensive, framework-specific, vendor-assessment
  framework: text("framework"), // gdpr, soc2, ai-act (if framework-specific)
  status: text("status").notNull().default("draft"), // draft, final
  summary: text("summary"),
  findings: jsonb("findings").$type<any[]>().default([]),
  recommendations: jsonb("recommendations").$type<string[]>().default([]),
  generatedBy: text("generated_by").notNull(),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  filePath: text("file_path"), // PDF file path
});

export const documentVersions = pgTable("document_versions", {
  id: serial("id").primaryKey(),
  policyId: integer("policy_id").references(() => policies.id).notNull(),
  version: text("version").notNull(),
  content: text("content").notNull(),
  changeNotes: text("change_notes"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertPolicySchema = createInsertSchema(policies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
});

export const insertComplianceFrameworkSchema = createInsertSchema(complianceFrameworks).omit({
  id: true,
  lastUpdated: true,
});

export const insertComplianceCheckSchema = createInsertSchema(complianceChecks).omit({
  id: true,
  lastChecked: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  lastAssessment: true,
});

export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditReportSchema = createInsertSchema(auditReports).omit({
  id: true,
  generatedAt: true,
});

export const insertDocumentVersionSchema = createInsertSchema(documentVersions).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Policy = typeof policies.$inferSelect;
export type InsertPolicy = z.infer<typeof insertPolicySchema>;

export type ComplianceFramework = typeof complianceFrameworks.$inferSelect;
export type InsertComplianceFramework = z.infer<typeof insertComplianceFrameworkSchema>;

export type ComplianceCheck = typeof complianceChecks.$inferSelect;
export type InsertComplianceCheck = z.infer<typeof insertComplianceCheckSchema>;

export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;

export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;

export type AuditReport = typeof auditReports.$inferSelect;
export type InsertAuditReport = z.infer<typeof insertAuditReportSchema>;

export type DocumentVersion = typeof documentVersions.$inferSelect;
export type InsertDocumentVersion = z.infer<typeof insertDocumentVersionSchema>;
