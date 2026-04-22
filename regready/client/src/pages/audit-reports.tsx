import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileBarChart, Search, Plus, Download, Eye, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AuditReport } from "@shared/schema";

const auditFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Report type is required"),
  framework: z.string().optional(),
  summary: z.string().optional(),
});

type AuditFormData = z.infer<typeof auditFormSchema>;

const reportTypeConfig = {
  comprehensive: { 
    label: "Comprehensive", 
    description: "Full compliance assessment across all frameworks",
    icon: FileBarChart 
  },
  "framework-specific": { 
    label: "Framework-Specific", 
    description: "Focused assessment for a single framework",
    icon: CheckCircle 
  },
  "vendor-assessment": { 
    label: "Vendor Assessment", 
    description: "Third-party vendor compliance evaluation",
    icon: AlertCircle 
  },
} as const;

const statusConfig = {
  draft: { color: "bg-neutral-100 text-neutral-700", label: "Draft", icon: Clock },
  final: { color: "bg-success/10 text-success", label: "Final", icon: CheckCircle },
} as const;

export default function AuditReports() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      title: "",
      type: "",
      framework: "",
      summary: "",
    },
  });

  const { data: auditReports = [], isLoading } = useQuery<AuditReport[]>({
    queryKey: ["/api/audit-reports"],
  });

  const createAuditReportMutation = useMutation({
    mutationFn: async (data: AuditFormData) => {
      const reportData = {
        ...data,
        status: "draft",
        generatedBy: "Current User",
        findings: [],
        recommendations: [],
      };
      const response = await apiRequest("POST", "/api/audit-reports", reportData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/audit-reports"] });
      toast({
        title: "Audit Report Created",
        description: "Audit report has been successfully created.",
      });
      setIsCreateModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create audit report.",
        variant: "destructive",
      });
    },
  });

  const exportReportMutation = useMutation({
    mutationFn: async (reportId: number) => {
      const response = await fetch(`/api/audit-reports/${reportId}/export`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({
        title: "Export Successful",
        description: "Audit report has been exported as PDF.",
      });
    },
    onError: () => {
      toast({
        title: "Export Failed",
        description: "Failed to export audit report as PDF.",
        variant: "destructive",
      });
    },
  });

  const handleCreateReport = () => {
    const data = form.getValues();
    if (form.formState.isValid) {
      createAuditReportMutation.mutate(data);
    }
  };

  const filteredReports = auditReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate overview metrics
  const totalReports = auditReports.length;
  const draftReports = auditReports.filter(r => r.status === "draft").length;
  const finalReports = auditReports.filter(r => r.status === "final").length;
  const thisMonthReports = auditReports.filter(r => {
    const reportDate = new Date(r.generatedAt);
    const now = new Date();
    return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
  }).length;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading audit reports...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header 
        title="Audit Reports" 
        description="Generate, manage, and export comprehensive compliance audit reports"
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Reports</p>
                  <p className="text-2xl font-bold text-neutral-900">{totalReports}</p>
                </div>
                <FileBarChart className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Draft Reports</p>
                  <p className="text-2xl font-bold text-warning">{draftReports}</p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Final Reports</p>
                  <p className="text-2xl font-bold text-success">{finalReports}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">This Month</p>
                  <p className="text-2xl font-bold text-neutral-900">{thisMonthReports}</p>
                </div>
                <Calendar className="w-8 h-8 text-neutral-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <Input
              placeholder="Search audit reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="comprehensive">Comprehensive</SelectItem>
              <SelectItem value="framework-specific">Framework-Specific</SelectItem>
              <SelectItem value="vendor-assessment">Vendor Assessment</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="final">Final</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Audit Report</DialogTitle>
              </DialogHeader>
              
              <form className="space-y-6">
                <div>
                  <Label htmlFor="title">Report Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter report title"
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-error mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="type">Report Type</Label>
                  <Select onValueChange={(value) => form.setValue("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(reportTypeConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center space-x-2">
                            <config.icon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{config.label}</div>
                              <div className="text-xs text-neutral-500">{config.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.type && (
                    <p className="text-sm text-error mt-1">{form.formState.errors.type.message}</p>
                  )}
                </div>

                {form.watch("type") === "framework-specific" && (
                  <div>
                    <Label htmlFor="framework">Target Framework</Label>
                    <Select onValueChange={(value) => form.setValue("framework", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gdpr">GDPR</SelectItem>
                        <SelectItem value="soc2">SOC 2</SelectItem>
                        <SelectItem value="ai-act">EU AI Act</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="summary">Executive Summary (Optional)</Label>
                  <Textarea
                    id="summary"
                    rows={4}
                    placeholder="Provide a brief summary of the audit scope and objectives"
                    {...form.register("summary")}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateReport}
                    disabled={createAuditReportMutation.isPending}
                  >
                    {createAuditReportMutation.isPending ? "Generating..." : "Generate Report"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileBarChart className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No audit reports found</h3>
              <p className="text-neutral-600 mb-6">
                {auditReports.length === 0 
                  ? "Get started by generating your first audit report."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Generate Your First Report
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map((report) => {
              const typeConfig = reportTypeConfig[report.type as keyof typeof reportTypeConfig];
              const statusInfo = statusConfig[report.status as keyof typeof statusConfig];
              const TypeIcon = typeConfig?.icon || FileBarChart;
              const StatusIcon = statusInfo?.icon || Clock;
              
              return (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <TypeIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg line-clamp-2">{report.title}</CardTitle>
                          <p className="text-sm text-neutral-600">
                            {typeConfig?.label || report.type}
                            {report.framework && ` • ${report.framework.toUpperCase()}`}
                          </p>
                        </div>
                      </div>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {report.summary && (
                      <p className="text-sm text-neutral-600 line-clamp-3 mb-4">
                        {report.summary}
                      </p>
                    )}
                    
                    <div className="text-xs text-neutral-500 mb-4 space-y-1">
                      <div>Generated by: {report.generatedBy}</div>
                      <div>Created: {new Date(report.generatedAt).toLocaleDateString()}</div>
                      {report.findings && report.findings.length > 0 && (
                        <div>Findings: {report.findings.length} items</div>
                      )}
                      {report.recommendations && report.recommendations.length > 0 && (
                        <div>Recommendations: {report.recommendations.length} items</div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => exportReportMutation.mutate(report.id)}
                        disabled={exportReportMutation.isPending}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
