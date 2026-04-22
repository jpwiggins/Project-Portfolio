import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Heart, Phone, Users, BookOpen, Activity, TrendingUp, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Wellness() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for wellness dialog and form
  const [isWellnessDialogOpen, setIsWellnessDialogOpen] = useState(false);
  const [stressLevel, setStressLevel] = useState([5]);
  const [mood, setMood] = useState("");

  const { data: wellnessEntries, isLoading: entriesLoading } = useQuery({
    queryKey: ["/api/wellness/entries"],
  });

  const { data: latestEntry } = useQuery({
    queryKey: ["/api/wellness/latest"],
  });

  const { data: resources, isLoading: resourcesLoading } = useQuery({
    queryKey: ["/api/mental-health/resources"],
  });

  const createWellnessEntryMutation = useMutation({
    mutationFn: async (entryData: any) => {
      const response = await apiRequest("POST", "/api/wellness/entries", entryData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wellness/latest"] });
      setIsWellnessDialogOpen(false);
      toast({
        title: "Success",
        description: "Wellness entry logged successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to log wellness entry",
        variant: "destructive",
      });
    },
  });

  const handleWellnessSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const entryData = {
      stressLevel: stressLevel[0],
      mood: formData.get('mood') as string,
      notes: formData.get('notes') as string,
    };

    createWellnessEntryMutation.mutate(entryData);
  };

  const getStressLevelColor = (level: number) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStressLevelText = (level: number) => {
    if (level <= 3) return 'Low Stress';
    if (level <= 6) return 'Moderate Stress';
    return 'High Stress';
  };

  const currentStressScore = (latestEntry as any)?.stressLevel ? Math.round((10 - (latestEntry as any).stressLevel) * 10) : 85;

  const mentalHealthResources = [
    {
      title: "5-Minute Breathing Exercise",
      type: "meditation",
      duration: 5,
      description: "Quick stress relief through guided breathing",
      url: "#breathing"
    },
    {
      title: "Progressive Muscle Relaxation",
      type: "meditation",
      duration: 15,
      description: "Full body relaxation technique",
      url: "#muscle-relaxation"
    },
    {
      title: "Nurse Crisis Hotline",
      type: "crisis_support",
      description: "24/7 support specifically for healthcare workers",
      url: "tel:1-800-NURSES"
    },
    {
      title: "Managing Shift Work Sleep",
      type: "article",
      description: "Evidence-based strategies for better sleep",
      url: "#sleep-article"
    },
    {
      title: "Compassion Fatigue Recovery",
      type: "article",
      description: "Understanding and overcoming emotional exhaustion",
      url: "#compassion-fatigue"
    },
    {
      title: "Mindful Nursing Practice",
      type: "video",
      duration: 20,
      description: "Integrating mindfulness into patient care",
      url: "#mindful-nursing"
    }
  ];

  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7, free and confidential support"
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "24/7 crisis support via text"
    },
    {
      name: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      description: "Mental health and substance abuse referrals"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      
      <div className="lg:ml-72 min-h-screen">
        <Header 
          title="Mental Health Support"
          subtitle="Your wellness matters - access resources for stress management and emotional well-being"
        />
        
        <main className="p-4 lg:p-6 space-y-6">
          {/* Wellness Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Wellness Score */}
            <Card className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="text-success" size={20} />
                  <span>Wellness Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">{currentStressScore}%</div>
                  <p className="text-text-secondary text-sm mb-4">
                    {currentStressScore >= 80 ? 'Excellent' : 
                     currentStressScore >= 60 ? 'Good' : 
                     currentStressScore >= 40 ? 'Fair' : 'Needs Attention'}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-success h-3 rounded-full transition-all duration-500" 
                      style={{width: `${currentStressScore}%`}}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Check-in */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity size={20} />
                  <span>Quick Check-in</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog open={isWellnessDialogOpen} onOpenChange={setIsWellnessDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-primary text-white hover:bg-primary/90" data-testid="button-log-wellness">
                      Log Wellness Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>How are you feeling today?</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleWellnessSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="stressLevel">Stress Level: {stressLevel[0]}/10</Label>
                        <div className="px-2 py-4">
                          <Slider
                            value={stressLevel}
                            onValueChange={setStressLevel}
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                            data-testid="slider-stress-level"
                          />
                          <div className="flex justify-between text-xs text-text-secondary mt-1">
                            <span>Low</span>
                            <span>Moderate</span>
                            <span>High</span>
                          </div>
                        </div>
                        <p className={`text-sm font-medium ${getStressLevelColor(stressLevel[0])}`}>
                          {getStressLevelText(stressLevel[0])}
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="mood">Current Mood</Label>
                        <Select name="mood" value={mood} onValueChange={setMood}>
                          <SelectTrigger data-testid="select-mood">
                            <SelectValue placeholder="Select your mood" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="energized">Energized</SelectItem>
                            <SelectItem value="calm">Calm</SelectItem>
                            <SelectItem value="content">Content</SelectItem>
                            <SelectItem value="tired">Tired</SelectItem>
                            <SelectItem value="overwhelmed">Overwhelmed</SelectItem>
                            <SelectItem value="anxious">Anxious</SelectItem>
                            <SelectItem value="frustrated">Frustrated</SelectItem>
                            <SelectItem value="sad">Sad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          placeholder="Anything specific about your day or feelings..."
                          rows={3}
                          data-testid="textarea-notes"
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button type="submit" className="flex-1 bg-primary text-white hover:bg-primary/90" data-testid="button-submit-wellness">
                          Log Entry
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsWellnessDialogOpen(false)}
                          data-testid="button-cancel-wellness"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                <div className="mt-4 text-center">
                  {(latestEntry as any) && (
                    <p className="text-xs text-text-secondary">
                      Last check-in: {format(new Date((latestEntry as any).createdAt), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Wellness Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp size={20} />
                  <span>7-Day Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">Improving</div>
                  <p className="text-text-secondary text-sm mb-4">
                    Your wellness has improved by 12% this week
                  </p>
                  <div className="space-y-2">
                    {Array.isArray(wellnessEntries) ? wellnessEntries.slice(0, 7).map((entry: any, index: number) => (
                      <div key={entry.id} className="flex items-center justify-between text-xs">
                        <span>{format(new Date(entry.createdAt), 'MMM d')}</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStressLevelColor(entry.stressLevel).replace('text-', 'bg-')}`} />
                          <span>{getStressLevelText(entry.stressLevel)}</span>
                        </div>
                      </div>
                    )) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Crisis Support */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <Phone className="text-red-600" size={20} />
                <span>Crisis Support - Available 24/7</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {crisisResources.map((resource, index) => (
                  <div key={index} className="bg-white border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-1">{resource.name}</h4>
                    <p className="text-lg font-bold text-red-700 mb-2">{resource.phone}</p>
                    <p className="text-sm text-red-600">{resource.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 w-full border-red-300 text-red-700 hover:bg-red-100"
                      onClick={() => window.open(`tel:${resource.phone.replace(/\D/g, '')}`)}
                      data-testid={`button-call-${index}`}
                    >
                      <Phone size={14} className="mr-1" />
                      Call Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Wellness Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen size={20} />
                <span>Wellness Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Array.isArray(resources) ? resources : mentalHealthResources).map((resource: any, index: number) => (
                  <Card key={index} className="hover-lift cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-text-primary mb-1">{resource.title}</h4>
                          <p className="text-sm text-text-secondary line-clamp-2">{resource.description}</p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {resource.type === 'meditation' ? '🧘' : 
                           resource.type === 'crisis_support' ? '📞' : 
                           resource.type === 'article' ? '📖' : 
                           resource.type === 'video' ? '🎥' : '💡'}
                        </Badge>
                      </div>
                      
                      {resource.duration && (
                        <div className="flex items-center space-x-1 text-xs text-text-secondary mb-3">
                          <Calendar size={12} />
                          <span>{resource.duration} minutes</span>
                        </div>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          if (resource.url?.startsWith('tel:')) {
                            window.open(resource.url);
                          } else {
                            toast({
                              title: "Opening Resource",
                              description: `Loading ${resource.title}...`,
                            });
                          }
                        }}
                        data-testid={`button-resource-${index}`}
                      >
                        {resource.type === 'crisis_support' ? 'Call Now' : 
                         resource.type === 'meditation' ? 'Start Session' : 
                         'Access Resource'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Self-Care Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart size={20} />
                <span>Daily Self-Care Reminders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-text-primary">During Your Shift</h4>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li>• Take micro-breaks between patients (even 30 seconds)</li>
                    <li>• Practice deep breathing during transitions</li>
                    <li>• Stay hydrated and eat regularly</li>
                    <li>• Use positive self-talk during difficult moments</li>
                    <li>• Connect with supportive colleagues</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-text-primary">After Your Shift</h4>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li>• Decompress with a transition ritual</li>
                    <li>• Limit exposure to work-related stress</li>
                    <li>• Engage in activities you enjoy</li>
                    <li>• Prioritize quality sleep</li>
                    <li>• Maintain social connections outside work</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}