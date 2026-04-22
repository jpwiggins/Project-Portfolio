import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileDown, 
  FileText, 
  Download, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileType,
  Printer,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  frameworks: string[];
  sections: string[];
  estimatedPages: number;
  generationTime: string;
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  framework: string;
  generatedAt: string;
  status: 'generating' | 'ready' | 'failed';
  downloadUrl?: string;
  pageCount?: number;
}

export default function ComplianceReportGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [reportFormat, setReportFormat] = useState<string>('pdf');
  const [includeCertification, setIncludeCertification] = useState(false);
  const { toast } = useToast();

  // Mock report templates
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Compliance Report',
      description: 'Complete assessment across all implemented frameworks with detailed findings and recommendations',
      frameworks: ['GDPR', 'SOC 2', 'EU AI Act'],
      sections: ['Executive Summary', 'Compliance Status', 'Risk Analysis', 'Recommendations', 'Action Plan'],
      estimatedPages: 25,
      generationTime: '3-5 minutes'
    },
    {
      id: 'gdpr-focused',
      name: 'GDPR Privacy Assessment',
      description: 'Detailed GDPR compliance assessment with privacy controls and data protection measures',
      frameworks: ['GDPR'],
      sections: ['Privacy Controls', 'Data Processing', 'Subject Rights', 'Breach Procedures'],
      estimatedPages: 15,
      generationTime: '2-3 minutes'
    },
    {
      id: 'soc2-audit',
      name: 'SOC 2 Security Audit',
      description: 'SOC 2 Type II readiness assessment with security controls and operational effectiveness',
      frameworks: ['SOC 2'],
      sections: ['Security Controls', 'Access Management', 'Monitoring', 'Incident Response'],
      estimatedPages: 20,
      generationTime: '3-4 minutes'
    },
    {
      id: 'ai-governance',
      name: 'AI Governance Report',
      description: 'EU AI Act compliance assessment with AI system classification and risk management',
      frameworks: ['EU AI Act'],
      sections: ['AI System Inventory', 'Risk Classification', 'Governance Framework', 'Oversight Procedures'],
      estimatedPages: 18,
      generationTime: '2-4 minutes'
    },
    {
      id: 'executive-summary',
      name: 'Executive Summary Dashboard',
      description: 'High-level overview for leadership with key metrics and strategic recommendations',
      frameworks: ['GDPR', 'SOC 2', 'EU AI Act'],
      sections: ['Key Metrics', 'Compliance Status', 'Strategic Recommendations'],
      estimatedPages: 8,
      generationTime: '1-2 minutes'
    }
  ];

  // Mock generated reports
  const mockGeneratedReports: GeneratedReport[] = [
    {
      id: '1',
      name: 'Q3 2025 Comprehensive Compliance Report',
      type: 'Comprehensive',
      framework: 'All Frameworks',
      generatedAt: '2025-08-04T10:30:00Z',
      status: 'ready',
      downloadUrl: '/api/reports/1/download',
      pageCount: 28
    },
    {
      id: '2',
      name: 'GDPR Privacy Assessment July 2025',
      type: 'GDPR Assessment',
      framework: 'GDPR',
      generatedAt: '2025-08-02T14:15:00Z',
      status: 'ready',
      downloadUrl: '/api/reports/2/download',
      pageCount: 16
    },
    {
      id: '3',
      name: 'SOC 2 Readiness Assessment',
      type: 'SOC 2 Audit',
      framework: 'SOC 2',
      generatedAt: '2025-08-01T09:45:00Z',
      status: 'generating'
    }
  ];

  const generateReportMutation = useMutation({
    mutationFn: async (reportConfig: any) => {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      return {
        id: Date.now().toString(),
        status: 'generating',
        message: 'Report generation started'
      };
    },
    onSuccess: () => {
      toast({
        title: "Report Generation Started",
        description: "Your compliance report is being generated. You'll be notified when it's ready.",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to start report generation.",
        variant: "destructive",
      });
    },
  });

  const downloadReportMutation = useMutation({
    mutationFn: async (reportId: string) => {
      // Simulate download
      const response = await fetch(`/api/reports/${reportId}/download`, {
        method: 'GET',
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "Your report is downloading now.",
      });
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: "Failed to download the report.",
        variant: "destructive",
      });
    },
  });

  const selectedTemplateData = reportTemplates.find(t => t.id === selectedTemplate);

  const handleGenerateReport = () => {
    if (!selectedTemplate) {
      toast({
        title: "Template Required",
        description: "Please select a report template to continue.",
        variant: "destructive",
      });
      return;
    }

    const reportConfig = {
      templateId: selectedTemplate,
      frameworks: selectedFrameworks,
      sections: selectedSections,
      format: reportFormat,
      includeCertification
    };

    generateReportMutation.mutate(reportConfig);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'generating':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-neutral-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
          <FileDown className="h-6 w-6 text-blue-600" />
          Compliance Report Generator
        </h2>
        <p className="text-neutral-600">Generate comprehensive compliance reports with one click</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="text-sm font-medium text-neutral-900 mb-3 block">
                  Select Report Template
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTemplates.map((template) => (
                    <Card 
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate === template.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:bg-neutral-50'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            checked={selectedTemplate === template.id}
                            onChange={() => {}}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-neutral-900 mb-1">
                              {template.name}
                            </h4>
                            <p className="text-sm text-neutral-600 mb-2">
                              {template.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-neutral-500">
                              <span>{template.estimatedPages} pages</span>
                              <span>{template.generationTime}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              {selectedTemplateData && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-900 mb-2 block">
                      Report Format
                    </label>
                    <Select value={reportFormat} onValueChange={setReportFormat}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">
                          <div className="flex items-center gap-2">
                            <FileType className="h-4 w-4" />
                            PDF Document
                          </div>
                        </SelectItem>
                        <SelectItem value="docx">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Word Document
                          </div>
                        </SelectItem>
                        <SelectItem value="excel">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Excel Spreadsheet
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="certification"
                      checked={includeCertification}
                      onCheckedChange={setIncludeCertification}
                    />
                    <label 
                      htmlFor="certification"
                      className="text-sm font-medium text-neutral-900"
                    >
                      Include compliance certification pages
                    </label>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-900 mb-2 block">
                      Framework Coverage
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedTemplateData.frameworks.map((framework) => (
                        <Badge key={framework} variant="outline">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleGenerateReport}
                disabled={!selectedTemplate || generateReportMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {generateReportMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockGeneratedReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-neutral-900 text-sm line-clamp-2">
                        {report.name}
                      </h4>
                      <Badge className={getStatusColor(report.status)} variant="secondary">
                        {getStatusIcon(report.status)}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-neutral-500 space-y-1">
                      <div>Type: {report.type}</div>
                      <div>Framework: {report.framework}</div>
                      <div>Generated: {new Date(report.generatedAt).toLocaleDateString()}</div>
                      {report.pageCount && <div>Pages: {report.pageCount}</div>}
                    </div>

                    {report.status === 'ready' && (
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => downloadReportMutation.mutate(report.id)}
                          disabled={downloadReportMutation.isPending}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Printer className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {report.status === 'generating' && (
                      <div className="mt-3">
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Generating... estimated 2 minutes remaining</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-4" size="sm">
                View All Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}