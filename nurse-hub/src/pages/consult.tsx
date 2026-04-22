import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, AlertTriangle } from "lucide-react";

export default function Consult() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: protocols, isLoading } = useQuery({
    queryKey: ["/api/clinical/protocols", searchQuery],
    enabled: !!searchQuery,
  });

  const featuredProtocols = [
    {
      title: "Acute Chest Pain Protocol",
      category: "Cardiology",
      urgency: "high",
      content: "1. Check responsiveness and pulse\n2. Obtain 12-lead ECG within 10 minutes\n3. Administer oxygen if SpO2 < 94%\n4. Establish IV access\n5. Administer nitroglycerin if BP allows",
      lastUpdated: "2024-01-15"
    },
    {
      title: "Stroke Assessment (FAST)",
      category: "Neurology", 
      urgency: "critical",
      content: "F - Face drooping\nA - Arm weakness\nS - Speech difficulty\nT - Time to call emergency",
      lastUpdated: "2024-01-10"
    },
    {
      title: "Sepsis Screening",
      category: "Critical Care",
      urgency: "high",
      content: "qSOFA Score:\n- Altered mental status\n- Systolic BP ≤ 100 mmHg\n- Respiratory rate ≥ 22/min",
      lastUpdated: "2024-01-12"
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      
      <div className="lg:ml-72 min-h-screen">
        <Header 
          title="9-Minute Clinical Consult"
          subtitle="Quick access to evidence-based clinical protocols and decision support"
        />
        
        <main className="p-4 lg:p-6 space-y-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search size={20} />
                <span>Search Clinical Protocols</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  placeholder="Search for conditions, symptoms, or protocols..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-text-secondary" />
              </div>
              {searchQuery && (
                <div className="mt-4">
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Array.isArray(protocols) && protocols.length > 0 ? (
                        protocols.map((protocol: any) => (
                          <Card key={protocol.id} className="hover-lift cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-text-primary">{protocol.title}</h4>
                                <Badge variant="outline">{protocol.category}</Badge>
                              </div>
                              <p className="text-sm text-text-secondary line-clamp-2">{protocol.content}</p>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-text-secondary text-center py-4">No protocols found for "{searchQuery}"</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Featured Protocols */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Featured Protocols</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProtocols.map((protocol, index) => (
                <Card key={index} className="hover-lift cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{protocol.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {protocol.urgency === 'critical' && (
                          <AlertTriangle className="text-destructive" size={16} />
                        )}
                        <Badge variant={getUrgencyColor(protocol.urgency)}>
                          {protocol.urgency}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {protocol.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-text-secondary whitespace-pre-line">
                        {protocol.content}
                      </div>
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>Updated: {protocol.lastUpdated}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          View Full Protocol
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Access Categories */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                'Cardiology', 'Neurology', 'Respiratory', 'Critical Care', 
                'Emergency', 'Pediatric', 'Geriatric', 'Infectious Disease',
                'Pharmacology', 'Pain Management', 'Mental Health', 'Wound Care'
              ].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="p-4 h-auto flex-col"
                  onClick={() => setSearchQuery(category)}
                >
                  <span className="text-sm font-medium">{category}</span>
                </Button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
