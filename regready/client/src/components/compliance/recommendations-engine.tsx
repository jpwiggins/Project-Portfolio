import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Star,
  Lightbulb,
  Target,
  ArrowRight,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'security' | 'privacy' | 'compliance' | 'governance';
  impact: number;
  effort: number;
  frameworks: string[];
  implementationSteps: string[];
  timeline: string;
  riskReduction: number;
}

interface ComplianceInsight {
  framework: string;
  currentScore: number;
  targetScore: number;
  gaps: string[];
  quickWins: string[];
}

export default function RecommendationsEngine() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for recommendations engine
  const mockRecommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Implement Automated Data Discovery',
      description: 'Deploy automated tools to discover and classify personal data across your systems to meet GDPR Article 30 requirements.',
      priority: 'high',
      category: 'privacy',
      impact: 85,
      effort: 60,
      frameworks: ['GDPR'],
      implementationSteps: [
        'Audit current data sources and repositories',
        'Deploy data discovery and classification tools',
        'Create data inventory and mapping documentation',
        'Establish ongoing monitoring procedures'
      ],
      timeline: '4-6 weeks',
      riskReduction: 40
    },
    {
      id: '2',
      title: 'Enhance Access Control Monitoring',
      description: 'Strengthen SOC 2 compliance by implementing real-time access control monitoring and automated review processes.',
      priority: 'high',
      category: 'security',
      impact: 90,
      effort: 45,
      frameworks: ['SOC 2'],
      implementationSteps: [
        'Review current access control policies',
        'Implement privileged access management (PAM)',
        'Set up automated access review workflows',
        'Configure real-time monitoring and alerting'
      ],
      timeline: '3-4 weeks',
      riskReduction: 50
    },
    {
      id: '3',
      title: 'AI Risk Assessment Framework',
      description: 'Establish comprehensive AI risk assessment procedures to comply with EU AI Act requirements for high-risk AI systems.',
      priority: 'medium',
      category: 'governance',
      impact: 75,
      effort: 70,
      frameworks: ['EU AI Act'],
      implementationSteps: [
        'Classify AI systems by risk level',
        'Develop risk assessment methodology',
        'Create documentation templates',
        'Train team on assessment procedures'
      ],
      timeline: '6-8 weeks',
      riskReduction: 35
    },
    {
      id: '4',
      title: 'Data Breach Response Automation',
      description: 'Automate incident response workflows to meet GDPR 72-hour breach notification requirements.',
      priority: 'medium',
      category: 'compliance',
      impact: 70,
      effort: 35,
      frameworks: ['GDPR', 'SOC 2'],
      implementationSteps: [
        'Document current incident response procedures',
        'Implement automated detection tools',
        'Create notification workflow templates',
        'Test response procedures with simulations'
      ],
      timeline: '2-3 weeks',
      riskReduction: 30
    }
  ];

  const mockInsights: ComplianceInsight[] = [
    {
      framework: 'GDPR',
      currentScore: 85,
      targetScore: 95,
      gaps: ['Data retention policy documentation', 'Third-party processor agreements'],
      quickWins: ['Update privacy notice language', 'Implement consent banners']
    },
    {
      framework: 'SOC 2',
      currentScore: 72,
      targetScore: 90,
      gaps: ['Continuous monitoring setup', 'Vendor risk assessment process'],
      quickWins: ['Enable two-factor authentication', 'Document security procedures']
    },
    {
      framework: 'EU AI Act',
      currentScore: 45,
      targetScore: 80,
      gaps: ['AI system inventory', 'Risk classification methodology', 'Human oversight procedures'],
      quickWins: ['Create AI use case documentation', 'Establish AI governance committee']
    }
  ];

  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      // In a real implementation, this would call the AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      return mockRecommendations;
    },
    onSuccess: () => {
      toast({
        title: "Recommendations Generated",
        description: "New AI-powered compliance recommendations are ready.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate new recommendations.",
        variant: "destructive",
      });
    },
  });

  const implementRecommendationMutation = useMutation({
    mutationFn: async (recommendationId: string) => {
      await apiRequest("POST", `/api/recommendations/${recommendationId}/implement`);
    },
    onSuccess: () => {
      toast({
        title: "Implementation Started",
        description: "Recommendation has been added to your action plan.",
      });
    },
    onError: () => {
      toast({
        title: "Implementation Failed",
        description: "Failed to start recommendation implementation.",
        variant: "destructive",
      });
    },
  });

  const filteredRecommendations = mockRecommendations.filter(rec => {
    const categoryMatch = selectedCategory === 'all' || rec.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || rec.priority === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Target className="h-4 w-4" />;
      case 'privacy': return <CheckCircle className="h-4 w-4" />;
      case 'compliance': return <Clock className="h-4 w-4" />;
      case 'governance': return <Brain className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with AI Generation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            AI Compliance Insights
          </h2>
          <p className="text-neutral-600">Personalized recommendations to improve your compliance posture</p>
        </div>
        <Button
          onClick={() => generateRecommendationsMutation.mutate()}
          disabled={generateRecommendationsMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Zap className="h-4 w-4 mr-2" />
          {generateRecommendationsMutation.isPending ? 'Generating...' : 'Refresh Insights'}
        </Button>
      </div>

      {/* Compliance Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockInsights.map((insight) => (
          <Card key={insight.framework} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{insight.framework}</CardTitle>
                <Badge variant="outline" className="text-sm">
                  {insight.currentScore}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-neutral-600">Progress to Target</span>
                    <span className="text-sm font-medium">{insight.targetScore}%</span>
                  </div>
                  <Progress value={insight.currentScore} className="h-2" />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">Key Gaps:</h4>
                  <ul className="space-y-1">
                    {insight.gaps.slice(0, 2).map((gap, index) => (
                      <li key={index} className="text-xs text-neutral-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-orange-500 flex-shrink-0" />
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">Quick Wins:</h4>
                  <ul className="space-y-1">
                    {insight.quickWins.slice(0, 2).map((win, index) => (
                      <li key={index} className="text-xs text-neutral-600 flex items-center gap-1">
                        <Star className="h-3 w-3 text-green-500 flex-shrink-0" />
                        {win}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </Button>
          <Button
            variant={selectedCategory === 'security' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('security')}
          >
            Security
          </Button>
          <Button
            variant={selectedCategory === 'privacy' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('privacy')}
          >
            Privacy
          </Button>
          <Button
            variant={selectedCategory === 'compliance' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('compliance')}
          >
            Compliance
          </Button>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <Button
            variant={selectedPriority === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPriority('all')}
          >
            All Priorities
          </Button>
          <Button
            variant={selectedPriority === 'high' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPriority('high')}
          >
            High
          </Button>
          <Button
            variant={selectedPriority === 'medium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPriority('medium')}
          >
            Medium
          </Button>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecommendations.map((recommendation) => (
          <Card key={recommendation.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getCategoryIcon(recommendation.category)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{recommendation.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getPriorityColor(recommendation.priority)} variant="secondary">
                        {recommendation.priority.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-neutral-500 capitalize">
                        {recommendation.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                {recommendation.description}
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{recommendation.impact}%</div>
                  <div className="text-xs text-neutral-500">Impact</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{recommendation.effort}%</div>
                  <div className="text-xs text-neutral-500">Effort</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{recommendation.timeline}</div>
                  <div className="text-xs text-neutral-500">Timeline</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-neutral-900 mb-2">Frameworks:</div>
                <div className="flex gap-1">
                  {recommendation.frameworks.map((framework) => (
                    <Badge key={framework} variant="outline" className="text-xs">
                      {framework}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-neutral-900 mb-2">Risk Reduction:</div>
                <div className="flex items-center gap-2">
                  <Progress value={recommendation.riskReduction} className="flex-1 h-2" />
                  <span className="text-sm font-medium">{recommendation.riskReduction}%</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => implementRecommendationMutation.mutate(recommendation.id)}
                  disabled={implementRecommendationMutation.isPending}
                  className="flex-1"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Implement
                </Button>
                <Button variant="outline" className="flex-1">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No recommendations found</h3>
            <p className="text-neutral-600 mb-4">
              Try adjusting your filters or generate new recommendations using AI.
            </p>
            <Button onClick={() => generateRecommendationsMutation.mutate()}>
              Generate New Recommendations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}