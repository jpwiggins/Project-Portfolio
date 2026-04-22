import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Pill, BriefcaseMedical, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function References() {
  const [drugQuery, setDrugQuery] = useState("");
  const [protocolQuery, setProtocolQuery] = useState("");
  const { toast } = useToast();

  const { data: drugs, isLoading: drugsLoading } = useQuery({
    queryKey: ["/api/clinical/drugs", drugQuery],
    enabled: !!drugQuery,
  });

  const { data: protocols, isLoading: protocolsLoading } = useQuery({
    queryKey: ["/api/clinical/protocols", protocolQuery],
    enabled: !!protocolQuery,
  });

  const commonDrugs = [
    {
      name: "Metformin",
      genericName: "Metformin HCl",
      category: "Antidiabetic",
      dosage: "500-2000mg daily with meals",
      indications: "Type 2 diabetes mellitus",
      contraindications: "Severe kidney disease, metabolic acidosis",
      sideEffects: "GI upset, lactic acidosis (rare)",
      interactions: "Alcohol, contrast dye"
    },
    {
      name: "Lisinopril",
      genericName: "Lisinopril",
      category: "ACE Inhibitor",
      dosage: "5-40mg daily",
      indications: "Hypertension, heart failure",
      contraindications: "Pregnancy, angioedema history",
      sideEffects: "Dry cough, hyperkalemia, angioedema",
      interactions: "NSAIDs, potassium supplements"
    },
    {
      name: "Furosemide",
      genericName: "Furosemide",
      category: "Loop Diuretic",
      dosage: "20-80mg daily",
      indications: "Edema, hypertension",
      contraindications: "Anuria, severe electrolyte depletion",
      sideEffects: "Dehydration, electrolyte imbalance",
      interactions: "Digoxin, lithium, aminoglycosides"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      
      <div className="lg:ml-72 min-h-screen">
        <Header 
          title="Clinical References"
          subtitle="Comprehensive drug information, protocols, and clinical guidelines"
        />
        
        <main className="p-4 lg:p-6">
          <Tabs defaultValue="drugs" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="drugs" className="flex items-center space-x-2">
                <Pill size={16} />
                <span>Drug Database</span>
              </TabsTrigger>
              <TabsTrigger value="protocols" className="flex items-center space-x-2">
                <BriefcaseMedical size={16} />
                <span>Clinical Protocols</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="drugs" className="space-y-6">
              {/* Drug Search */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search size={20} />
                    <span>Drug Information Search</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Input
                      placeholder="Search by drug name, generic name, or indication..."
                      value={drugQuery}
                      onChange={(e) => setDrugQuery(e.target.value)}
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-3 h-4 w-4 text-text-secondary" />
                  </div>
                  
                  {drugQuery && (
                    <div className="mt-4">
                      {drugsLoading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(drugs as any)?.length > 0 ? (
                            (drugs as any).map((drug: any) => (
                              <Card key={drug.id} className="hover-lift cursor-pointer">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="font-semibold text-text-primary">{drug.name}</h4>
                                      <p className="text-sm text-text-secondary">{drug.genericName}</p>
                                    </div>
                                    <Badge variant="outline">{drug.category}</Badge>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <span className="font-medium">Dosage:</span> {drug.dosage}
                                    </div>
                                    <div>
                                      <span className="font-medium">Indications:</span> {drug.indications}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <p className="text-text-secondary text-center py-4">No drugs found for "{drugQuery}"</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Common Drugs */}
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-4">Commonly Referenced Drugs</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {commonDrugs.map((drug, index) => (
                    <Card key={index} className="hover-lift cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{drug.name}</CardTitle>
                            <p className="text-sm text-text-secondary">{drug.genericName}</p>
                          </div>
                          <Badge variant="outline">{drug.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-text-primary">Dosage:</span>
                            <p className="text-text-secondary">{drug.dosage}</p>
                          </div>
                          <div>
                            <span className="font-medium text-text-primary">Indications:</span>
                            <p className="text-text-secondary">{drug.indications}</p>
                          </div>
                          <div>
                            <span className="font-medium text-text-primary flex items-center space-x-1">
                              <AlertTriangle size={14} className="text-yellow-600" />
                              <span>Contraindications:</span>
                            </span>
                            <p className="text-text-secondary">{drug.contraindications}</p>
                          </div>
                          <div>
                            <span className="font-medium text-text-primary">Side Effects:</span>
                            <p className="text-text-secondary">{drug.sideEffects}</p>
                          </div>
                          <div>
                            <span className="font-medium text-text-primary">Interactions:</span>
                            <p className="text-text-secondary">{drug.interactions}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          View Full Monograph
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="protocols" className="space-y-6">
              {/* Protocol Search */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search size={20} />
                    <span>Clinical Protocol Search</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Input
                      placeholder="Search protocols by condition, procedure, or keyword..."
                      value={protocolQuery}
                      onChange={(e) => setProtocolQuery(e.target.value)}
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-3 h-4 w-4 text-text-secondary" />
                  </div>
                  
                  {protocolQuery && (
                    <div className="mt-4">
                      {protocolsLoading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(protocols as any)?.length > 0 ? (
                            (protocols as any).map((protocol: any) => (
                              <Card key={protocol.id} className="hover-lift cursor-pointer">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-text-primary">{protocol.title}</h4>
                                    <Badge variant="outline">{protocol.category}</Badge>
                                  </div>
                                  <p className="text-sm text-text-secondary line-clamp-3">{protocol.content}</p>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <p className="text-text-secondary text-center py-4">No protocols found for "{protocolQuery}"</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Protocol Categories */}
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-4">Browse Protocol Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    'Emergency Procedures', 'Infection Control', 'Medication Administration',
                    'Pain Management', 'Wound Care', 'IV Therapy', 'Patient Safety',
                    'Discharge Planning', 'Fall Prevention', 'Pressure Ulcer Prevention',
                    'Cardiac Monitoring', 'Respiratory Care'
                  ].map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      className="p-4 h-auto flex-col text-center"
                      onClick={() => setProtocolQuery(category)}
                    >
                      <span className="text-sm font-medium">{category}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Reference */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info size={20} />
                    <span>Quick Reference</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Normal Vital Signs (Adult)</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>Heart Rate: 60-100 bpm</p>
                        <p>Blood Pressure: &lt;120/80 mmHg</p>
                        <p>Respiratory Rate: 12-20/min</p>
                        <p>Temperature: 36.1-37.2°C</p>
                        <p>SpO2: &gt;95%</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Pain Scale</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>0: No pain</p>
                        <p>1-3: Mild pain</p>
                        <p>4-6: Moderate pain</p>
                        <p>7-10: Severe pain</p>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Glasgow Coma Scale</h4>
                      <div className="text-sm text-purple-700 space-y-1">
                        <p>Eye Opening: 1-4</p>
                        <p>Verbal Response: 1-5</p>
                        <p>Motor Response: 1-6</p>
                        <p>Total Score: 3-15</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
