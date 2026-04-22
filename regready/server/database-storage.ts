import { 
  Policy, 
  InsertPolicy, 
  ComplianceFramework, 
  InsertComplianceFramework,
  ComplianceCheck, 
  InsertComplianceCheck,
  Vendor, 
  InsertVendor,
  RiskAssessment, 
  InsertRiskAssessment,
  AuditReport, 
  InsertAuditReport,
  DocumentVersion, 
  InsertDocumentVersion,
  User, 
  InsertUser,
  policies,
  complianceFrameworks,
  complianceChecks,
  vendors,
  riskAssessments,
  auditReports,
  documentVersions,
  users
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'regready_secret_key_2025';

  constructor() {
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    try {
      const existingFrameworks = await db.select().from(complianceFrameworks);
      
      if (existingFrameworks.length === 0) {
        // Initialize default compliance frameworks
        const defaultFrameworks = [
          {
            name: "gdpr",
            displayName: "GDPR",
            description: "General Data Protection Regulation",
            status: "active",
            completionPercentage: "75"
          },
          {
            name: "soc2",
            displayName: "SOC 2",
            description: "System and Organization Controls 2",
            status: "active",
            completionPercentage: "60"
          },
          {
            name: "eu-ai-act",
            displayName: "EU AI Act",
            description: "European Union AI Act",
            status: "active",
            completionPercentage: "45"
          }
        ];

        await db.insert(complianceFrameworks).values(defaultFrameworks);
        
        // Initialize default vendors
        const defaultVendors = [
          {
            name: "OpenAI",
            type: "ai-service",
            riskLevel: "low",
            gdprCompliant: true,
            soc2Compliant: true,
            aiActCompliant: false,
            notes: "AI model provider for policy generation"
          },
          {
            name: "Stripe",
            type: "payment-processing",
            riskLevel: "low",
            gdprCompliant: true,
            soc2Compliant: true,
            aiActCompliant: true,
            notes: "Payment processing for subscription billing"
          },
          {
            name: "Docker Hub",
            type: "infrastructure",
            riskLevel: "medium",
            gdprCompliant: true,
            soc2Compliant: true,
            aiActCompliant: true,
            notes: "Container registry for deployment"
          }
        ];

        await db.insert(vendors).values(defaultVendors);

        // Initialize sample policies
        const defaultPolicies = [
          {
            title: "Privacy Policy",
            description: "Comprehensive privacy policy covering data collection, usage, and user rights",
            status: "approved",
            version: "2.1",
            content: "This privacy policy outlines how we collect, use, and protect your personal data...",
            category: "privacy",
            framework: "gdpr",
            approvedBy: "Legal Team",
            createdBy: "System",
            nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          },
          {
            title: "Information Security Policy",
            description: "Guidelines for maintaining information security across the organization",
            status: "under-review",
            version: "1.0",
            content: "This policy establishes the framework for information security management...",
            category: "security",
            framework: "soc2",
            approvedBy: null,
            createdBy: "System",
            nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          }
        ];

        // Skip policies initialization for now to avoid schema conflicts

        // Initialize sample risk assessments
        const defaultRiskAssessments = [
          {
            title: "Data Breach Risk Assessment",
            description: "Assessment of potential data breach vulnerabilities",
            riskScore: 35,
            riskLevel: "medium",
            category: "security",
            mitigationPlan: "Implement additional encryption and access controls",
            status: "open",
            assignedTo: "Security Team",
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        ];

        await db.insert(riskAssessments).values(defaultRiskAssessments);
      }
    } catch (error) {
      console.error('Error initializing default data:', error);
    }
  }

  // User operations
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        stripeCustomerId, 
        stripeSubscriptionId, 
        subscriptionStatus: 'active',
        updatedAt: new Date() 
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  generateAuthToken(userId: number): string {
    return jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: '30d' });
  }

  // Policy operations
  async getPolicies(): Promise<Policy[]> {
    return db.select().from(policies);
  }

  async getPolicy(id: number): Promise<Policy | undefined> {
    const [policy] = await db.select().from(policies).where(eq(policies.id, id));
    return policy;
  }

  async createPolicy(policy: InsertPolicy): Promise<Policy> {
    const policyData = {
      type: policy.type,
      title: policy.title,
      description: policy.description || null,
      content: policy.content || null,
      version: policy.version || "1.0",
      status: policy.status || "draft",
      frameworks: policy.frameworks || [],
      createdBy: policy.createdBy,
      organizationId: policy.organizationId,
      approvedBy: policy.approvedBy || null
    };
    
    const [newPolicy] = await db.insert(policies).values(policyData).returning();
    return newPolicy;
  }

  async updatePolicy(id: number, policy: Partial<InsertPolicy>): Promise<Policy | undefined> {
    const updateData: any = { updatedAt: new Date() };
    
    if (policy.type) updateData.type = policy.type;
    if (policy.title) updateData.title = policy.title;
    if (policy.description !== undefined) updateData.description = policy.description;
    if (policy.content !== undefined) updateData.content = policy.content;
    if (policy.version) updateData.version = policy.version;
    if (policy.status) updateData.status = policy.status;
    if (policy.frameworks) updateData.frameworks = policy.frameworks;
    if (policy.approvedBy !== undefined) updateData.approvedBy = policy.approvedBy;
    
    const [updatedPolicy] = await db
      .update(policies)
      .set(updateData)
      .where(eq(policies.id, id))
      .returning();
    return updatedPolicy;
  }

  async deletePolicy(id: number): Promise<boolean> {
    const result = await db.delete(policies).where(eq(policies.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Compliance framework operations
  async getComplianceFrameworks(): Promise<ComplianceFramework[]> {
    return db.select().from(complianceFrameworks);
  }

  async getComplianceFramework(id: number): Promise<ComplianceFramework | undefined> {
    const [framework] = await db.select().from(complianceFrameworks).where(eq(complianceFrameworks.id, id));
    return framework;
  }

  async createComplianceFramework(framework: InsertComplianceFramework): Promise<ComplianceFramework> {
    const [newFramework] = await db.insert(complianceFrameworks).values(framework).returning();
    return newFramework;
  }

  async updateComplianceFramework(id: number, framework: Partial<InsertComplianceFramework>): Promise<ComplianceFramework | undefined> {
    const [updatedFramework] = await db
      .update(complianceFrameworks)
      .set({ ...framework, lastUpdated: new Date() })
      .where(eq(complianceFrameworks.id, id))
      .returning();
    return updatedFramework;
  }

  // Compliance check operations
  async getComplianceChecks(frameworkId?: number): Promise<ComplianceCheck[]> {
    if (frameworkId) {
      return db.select().from(complianceChecks).where(eq(complianceChecks.frameworkId, frameworkId));
    }
    return db.select().from(complianceChecks);
  }

  async createComplianceCheck(check: InsertComplianceCheck): Promise<ComplianceCheck> {
    const [newCheck] = await db.insert(complianceChecks).values(check).returning();
    return newCheck;
  }

  async updateComplianceCheck(id: number, check: Partial<InsertComplianceCheck>): Promise<ComplianceCheck | undefined> {
    const [updatedCheck] = await db
      .update(complianceChecks)
      .set({ ...check, lastChecked: new Date() })
      .where(eq(complianceChecks.id, id))
      .returning();
    return updatedCheck;
  }

  // Vendor operations
  async getVendors(): Promise<Vendor[]> {
    return db.select().from(vendors);
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor;
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const [newVendor] = await db.insert(vendors).values(vendor).returning();
    return newVendor;
  }

  async updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor | undefined> {
    const [updatedVendor] = await db
      .update(vendors)
      .set({ ...vendor, lastAssessment: new Date() })
      .where(eq(vendors.id, id))
      .returning();
    return updatedVendor;
  }

  async deleteVendor(id: number): Promise<boolean> {
    const result = await db.delete(vendors).where(eq(vendors.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Risk assessment operations
  async getRiskAssessments(): Promise<RiskAssessment[]> {
    return db.select().from(riskAssessments);
  }

  async getRiskAssessment(id: number): Promise<RiskAssessment | undefined> {
    const [assessment] = await db.select().from(riskAssessments).where(eq(riskAssessments.id, id));
    return assessment;
  }

  async createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment> {
    const [newAssessment] = await db.insert(riskAssessments).values(assessment).returning();
    return newAssessment;
  }

  async updateRiskAssessment(id: number, assessment: Partial<InsertRiskAssessment>): Promise<RiskAssessment | undefined> {
    const [updatedAssessment] = await db
      .update(riskAssessments)
      .set({ ...assessment, updatedAt: new Date() })
      .where(eq(riskAssessments.id, id))
      .returning();
    return updatedAssessment;
  }

  // Audit report operations
  async getAuditReports(): Promise<AuditReport[]> {
    return db.select().from(auditReports);
  }

  async getAuditReport(id: number): Promise<AuditReport | undefined> {
    const [report] = await db.select().from(auditReports).where(eq(auditReports.id, id));
    return report;
  }

  async createAuditReport(report: InsertAuditReport): Promise<AuditReport> {
    const reportData = {
      title: report.title,
      type: report.type,
      framework: report.framework || null,
      status: report.status || 'draft',
      summary: report.summary || null,
      findings: Array.isArray(report.findings) ? report.findings : [],
      recommendations: Array.isArray(report.recommendations) ? report.recommendations : [],
      generatedBy: report.generatedBy,
      filePath: report.filePath || null
    };
    
    const [newReport] = await db.insert(auditReports).values(reportData).returning();
    return newReport;
  }

  // Document version operations
  async getDocumentVersions(policyId: number): Promise<DocumentVersion[]> {
    return db.select().from(documentVersions).where(eq(documentVersions.policyId, policyId));
  }

  async createDocumentVersion(version: InsertDocumentVersion): Promise<DocumentVersion> {
    const [newVersion] = await db.insert(documentVersions).values(version).returning();
    return newVersion;
  }

  // Dashboard data
  async getDashboardMetrics(): Promise<{
    complianceOverview: { framework: string; percentage: number; status: string }[];
    recentActivities: { title: string; timestamp: string; type: string }[];
    riskScore: number;
    totalPolicies: number;
    pendingReviews: number;
  }> {
    const frameworks = await this.getComplianceFrameworks();
    const totalPoliciesResult = await db.select({ count: sql<number>`count(*)` }).from(policies);
    const riskAssessmentList = await this.getRiskAssessments();

    const complianceOverview = frameworks.map(framework => ({
      framework: framework.displayName,
      percentage: parseInt(framework.completionPercentage || "0"),
      status: parseInt(framework.completionPercentage || "0") >= 80 ? 'compliant' : 'non-compliant'
    }));

    const recentActivities = [
      { title: 'Policy review completed', timestamp: new Date().toISOString(), type: 'policy' },
      { title: 'GDPR compliance check', timestamp: new Date().toISOString(), type: 'compliance' },
    ];

    const avgRiskScore = riskAssessmentList.length > 0 
      ? riskAssessmentList.reduce((sum, risk) => sum + risk.riskScore, 0) / riskAssessmentList.length 
      : 0;

    return {
      complianceOverview,
      recentActivities,
      riskScore: Math.round(avgRiskScore),
      totalPolicies: totalPoliciesResult[0].count,
      pendingReviews: 3
    };
  }
}