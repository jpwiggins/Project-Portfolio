import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Lock, Bot, Check, Clock, AlertTriangle, ExternalLink } from "lucide-react";
import type { ComplianceFramework } from "@shared/schema";

const frameworkConfig = {
  GDPR: {
    icon: Shield,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "General Data Protection Regulation compliance for data privacy and protection",
    requirements: [
      "Data Processing Records",
      "Privacy Impact Assessments", 
      "Data Subject Rights",
      "Breach Notification Procedures",
      "Data Protection Officer",
      "Privacy by Design"
    ]
  },
  SOC2: {
    icon: Lock,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "SOC 2 security standards for availability, processing integrity, confidentiality, and privacy",
    requirements: [
      "Security Controls",
      "Availability Monitoring",
      "Processing Integrity",
      "Confidentiality Measures",
      "Privacy Controls",
      "Access Management"
    ]
  },
  EU_AI_ACT: {
    icon: Bot,
    color: "text-green-600", 
    bgColor: "bg-green-50",
    description: "European Union AI Act compliance for artificial intelligence systems",
    requirements: [
      "AI System Classification",
      "Risk Assessment",
      "Documentation Requirements",
      "Human Oversight",
      "Transparency Obligations",
      "Quality Management"
    ]
  }
} as const;

const statusConfig = {
  compliant: { 
    color: "bg-success/10 text-success", 
    label: "Compliant",
    icon: Check,
    description: "All requirements met"
  },
  "in-progress": { 
    color: "bg-warning/10 text-warning", 
    label: "In Progress",
    icon: Clock,
    description: "Implementation underway"
  },
  "needs-attention": { 
    color: "bg-error/10 text-error", 
    label: "Needs Attention",
    icon: AlertTriangle,
    description: "Requires immediate action"
  }
} as const;

export default function ComplianceFrameworks() {
  const { data, isLoading, error } = useQuery<ComplianceFramework[]>({
    queryKey: ["/api/compliance-frameworks"],
  });

  // More detailed debugging
  console.log('Raw data:', data);
  console.log('Data type:', typeof data);
  console.log('Is array:', Array.isArray(data));
  console.log('Data keys:', data ? Object.keys(data) : 'no data');

  // Ensure we always have an array, even if the API returns something unexpected
  const frameworks = Array.isArray(data) ? data : [];
  console.log('Final frameworks array:', frameworks, 'Length:', frameworks.length);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading compliance frameworks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading frameworks: {error.message}</p>
        </div>
      </div>
    );
  }

  // Use frameworks array directly since we already processed it above

  return (
    <>
      <Header 
        title="Compliance Frameworks" 
        description="Monitor and manage your compliance across multiple regulatory frameworks"
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {frameworks.map((framework) => {
            // Map database framework names to config names
            const frameworkNameMapping = {
              'gdpr': 'GDPR',
              'soc2': 'SOC2', 
              'eu-ai-act': 'EU_AI_ACT'
            };
            const configKey = frameworkNameMapping[framework.name as keyof typeof frameworkNameMapping] || framework.name;
            const config = frameworkConfig[configKey as keyof typeof frameworkConfig];
            
            // Map database status to frontend status
            const mappedStatus = framework.status === 'active' 
              ? (parseFloat(framework.completionPercentage || "0") >= 90 ? 'compliant' : 'in-progress')
              : 'needs-attention';
            
            const statusInfo = statusConfig[mappedStatus as keyof typeof statusConfig];
            const Icon = config?.icon || Shield;
            const StatusIcon = statusInfo?.icon || Clock;
            const percentage = parseFloat(framework.completionPercentage || "0");
            
            return (
              <Card key={framework.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${config?.bgColor || "bg-neutral-50"}`}>
                      <Icon className={`w-6 h-6 ${config?.color || "text-neutral-600"}`} />
                    </div>
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{framework.displayName}</CardTitle>
                  <p className="text-sm text-neutral-600">{config?.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-neutral-700">Progress</span>
                      <span className="text-2xl font-bold text-neutral-900">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                    <p className="text-xs text-neutral-500 mt-1">{statusInfo.description}</p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      // Navigate to detailed framework view
                      window.location.href = `/compliance-frameworks/${framework.id}`;
                    }}
                    data-testid={`view-framework-${framework.id}`}
                  >
                    View Details
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Framework Requirements */}
        <div className="space-y-8">
          {frameworks.map((framework) => {
            // Map database framework names to config names
            const frameworkNameMapping = {
              'gdpr': 'GDPR',
              'soc2': 'SOC2', 
              'eu-ai-act': 'EU_AI_ACT'
            };
            const configKey = frameworkNameMapping[framework.name as keyof typeof frameworkNameMapping] || framework.name;
            const config = frameworkConfig[configKey as keyof typeof frameworkConfig];
            const Icon = config?.icon || Shield;
            const percentage = parseFloat(framework.completionPercentage || "0");
            
            return (
              <Card key={`${framework.id}-details`}>
                <CardHeader className="border-b border-neutral-200">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${config?.bgColor || "bg-neutral-50"}`}>
                      <Icon className={`w-7 h-7 ${config?.color || "text-neutral-600"}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{framework.displayName}</CardTitle>
                      <p className="text-neutral-600 mt-1">{config?.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-neutral-500">
                          Last updated: {new Date(framework.lastUpdated).toLocaleDateString()}
                        </span>
                        <span className="text-sm font-medium">
                          {percentage}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {config?.requirements?.map((requirement, index) => {
                      // Mock completion status based on percentage
                      const isCompleted = (index + 1) / config.requirements.length <= percentage / 100;
                      const isInProgress = !isCompleted && (index + 1) / config.requirements.length <= (percentage + 20) / 100;
                      
                      return (
                        <div 
                          key={requirement}
                          className="flex items-center space-x-3 p-3 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5 text-success flex-shrink-0" />
                          ) : isInProgress ? (
                            <Clock className="w-5 h-5 text-warning flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-error flex-shrink-0" />
                          )}
                          <span className="text-sm font-medium text-neutral-900">{requirement}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 flex gap-4">
                    <Button 
                      onClick={() => {
                        // Navigate to checklist for this framework
                        window.location.href = `/compliance-frameworks/${framework.id}/checklist`;
                      }}
                      data-testid={`view-checklist-${framework.id}`}
                    >
                      View Checklist
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // Start compliance assessment
                        window.location.href = `/risk-assessment?framework=${framework.name}`;
                      }}
                      data-testid={`run-assessment-${framework.id}`}
                    >
                      Run Assessment
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // Generate compliance report
                        window.location.href = `/audit-reports?framework=${framework.name}`;
                      }}
                      data-testid={`generate-report-${framework.id}`}
                    >
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {frameworks.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No compliance frameworks found</h3>
              <p className="text-neutral-600">
                Compliance frameworks will be automatically initialized when you start using the platform.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
