import { 
  Policy, InsertPolicy, 
  ComplianceFramework, InsertComplianceFramework,
  ComplianceCheck, InsertComplianceCheck,
  Vendor, InsertVendor,
  RiskAssessment, InsertRiskAssessment,
  AuditReport, InsertAuditReport,
  DocumentVersion, InsertDocumentVersion,
  User, InsertUser
} from "@shared/schema";
import { DatabaseStorage } from "./database-storage";

export interface IStorage {
  // User operations
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User | undefined>;
  verifyPassword(email: string, password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  generateAuthToken(userId: number): string;

  // Policy operations
  getPolicies(): Promise<Policy[]>;
  getPolicy(id: number): Promise<Policy | undefined>;
  createPolicy(policy: InsertPolicy): Promise<Policy>;
  updatePolicy(id: number, policy: Partial<InsertPolicy>): Promise<Policy | undefined>;
  deletePolicy(id: number): Promise<boolean>;

  // Compliance framework operations
  getComplianceFrameworks(): Promise<ComplianceFramework[]>;
  getComplianceFramework(id: number): Promise<ComplianceFramework | undefined>;
  createComplianceFramework(framework: InsertComplianceFramework): Promise<ComplianceFramework>;
  updateComplianceFramework(id: number, framework: Partial<InsertComplianceFramework>): Promise<ComplianceFramework | undefined>;

  // Compliance check operations
  getComplianceChecks(frameworkId?: number): Promise<ComplianceCheck[]>;
  createComplianceCheck(check: InsertComplianceCheck): Promise<ComplianceCheck>;
  updateComplianceCheck(id: number, check: Partial<InsertComplianceCheck>): Promise<ComplianceCheck | undefined>;

  // Vendor operations
  getVendors(): Promise<Vendor[]>;
  getVendor(id: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor | undefined>;
  deleteVendor(id: number): Promise<boolean>;

  // Risk assessment operations
  getRiskAssessments(): Promise<RiskAssessment[]>;
  getRiskAssessment(id: number): Promise<RiskAssessment | undefined>;
  createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment>;
  updateRiskAssessment(id: number, assessment: Partial<InsertRiskAssessment>): Promise<RiskAssessment | undefined>;

  // Audit report operations
  getAuditReports(): Promise<AuditReport[]>;
  getAuditReport(id: number): Promise<AuditReport | undefined>;
  createAuditReport(report: InsertAuditReport): Promise<AuditReport>;

  // Document version operations
  getDocumentVersions(policyId: number): Promise<DocumentVersion[]>;
  createDocumentVersion(version: InsertDocumentVersion): Promise<DocumentVersion>;

  // Dashboard data
  getDashboardMetrics(): Promise<{
    complianceOverview: { framework: string; percentage: number; status: string }[];
    recentActivities: { title: string; timestamp: string; type: string }[];
    riskScore: number;
    totalPolicies: number;
    pendingReviews: number;
  }>;
}

export const storage = new DatabaseStorage();