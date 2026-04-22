import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Volume2, Globe, Star, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Translation() {
  const [sourceLanguage, setSourceLanguage] = useState("english");
  const [targetLanguage, setTargetLanguage] = useState("spanish");
  const [selectedPhrase, setSelectedPhrase] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  const { data: phrases, isLoading } = useQuery({
    queryKey: ["/api/translation/phrases", selectedCategory === "all" ? undefined : selectedCategory],
  });

  const languages = [
    { code: "english", name: "English", flag: "🇺🇸" },
    { code: "spanish", name: "Spanish", flag: "🇪🇸" },
    { code: "french", name: "French", flag: "🇫🇷" },
    { code: "mandarin", name: "Mandarin", flag: "🇨🇳" },
    { code: "portuguese", name: "Portuguese", flag: "🇵🇹" },
    { code: "arabic", name: "Arabic", flag: "🇸🇦" },
    { code: "german", name: "German", flag: "🇩🇪" },
    { code: "italian", name: "Italian", flag: "🇮🇹" },
    { code: "japanese", name: "Japanese", flag: "🇯🇵" },
    { code: "korean", name: "Korean", flag: "🇰🇷" },
    { code: "russian", name: "Russian", flag: "🇷🇺" },
    { code: "hindi", name: "Hindi", flag: "🇮🇳" },
    { code: "vietnamese", name: "Vietnamese", flag: "🇻🇳" },
    { code: "tagalog", name: "Tagalog", flag: "🇵🇭" },
    { code: "polish", name: "Polish", flag: "🇵🇱" },
    { code: "dutch", name: "Dutch", flag: "🇳🇱" },
    { code: "swedish", name: "Swedish", flag: "🇸🇪" },
    { code: "danish", name: "Danish", flag: "🇩🇰" },
    { code: "norwegian", name: "Norwegian", flag: "🇳🇴" },
    { code: "finnish", name: "Finnish", flag: "🇫🇮" },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "assessment", label: "Patient Assessment" },
    { value: "pain", label: "Pain Management" },
    { value: "medication", label: "Medication" },
    { value: "procedures", label: "Procedures" },
    { value: "emergency", label: "Emergency" },
    { value: "discharge", label: "Discharge Instructions" },
    { value: "comfort", label: "Comfort & Support" },
    { value: "basic", label: "Basic Communication" },
  ];

  const commonPhrases = [
    {
      id: "1",
      englishPhrase: "How are you feeling today?",
      category: "assessment",
      translations: {
        spanish: { text: "¿Cómo se siente hoy?", audio_url: "/audio/spanish/how-feeling.mp3" },
        french: { text: "Comment vous sentez-vous aujourd'hui?", audio_url: "/audio/french/how-feeling.mp3" },
        mandarin: { text: "您今天感觉怎么样？", audio_url: "/audio/mandarin/how-feeling.mp3" },
      }
    },
    {
      id: "2",
      englishPhrase: "Please describe your pain level from 1 to 10",
      category: "pain",
      translations: {
        spanish: { text: "Por favor, describa su nivel de dolor del 1 al 10", audio_url: "/audio/spanish/pain-level.mp3" },
        french: { text: "Veuillez décrire votre niveau de douleur de 1 à 10", audio_url: "/audio/french/pain-level.mp3" },
        mandarin: { text: "请描述您的疼痛程度，从1到10", audio_url: "/audio/mandarin/pain-level.mp3" },
      }
    },
    {
      id: "3",
      englishPhrase: "When did your symptoms start?",
      category: "assessment",
      translations: {
        spanish: { text: "¿Cuándo comenzaron sus síntomas?", audio_url: "/audio/spanish/symptoms-start.mp3" },
        french: { text: "Quand vos symptômes ont-ils commencé?", audio_url: "/audio/french/symptoms-start.mp3" },
        mandarin: { text: "您的症状什么时候开始的？", audio_url: "/audio/mandarin/symptoms-start.mp3" },
      }
    },
    {
      id: "4",
      englishPhrase: "Do you have any allergies?",
      category: "assessment",
      translations: {
        spanish: { text: "¿Tiene alguna alergia?", audio_url: "/audio/spanish/allergies.mp3" },
        french: { text: "Avez-vous des allergies?", audio_url: "/audio/french/allergies.mp3" },
        mandarin: { text: "您有过敏症吗？", audio_url: "/audio/mandarin/allergies.mp3" },
      }
    },
    {
      id: "5",
      englishPhrase: "Please take this medication with food",
      category: "medication",
      translations: {
        spanish: { text: "Por favor, tome este medicamento con comida", audio_url: "/audio/spanish/medication-food.mp3" },
        french: { text: "Veuillez prendre ce médicament avec de la nourriture", audio_url: "/audio/french/medication-food.mp3" },
        mandarin: { text: "请与食物一起服用此药", audio_url: "/audio/mandarin/medication-food.mp3" },
      }
    },
    {
      id: "6",
      englishPhrase: "This is an emergency. Call for help immediately.",
      category: "emergency",
      translations: {
        spanish: { text: "Esta es una emergencia. Pida ayuda inmediatamente.", audio_url: "/audio/spanish/emergency.mp3" },
        french: { text: "C'est une urgence. Appelez à l'aide immédiatement.", audio_url: "/audio/french/emergency.mp3" },
        mandarin: { text: "这是紧急情况。立即求救。", audio_url: "/audio/mandarin/emergency.mp3" },
      }
    }
  ];

  const getTranslation = (phrase: any) => {
    if (sourceLanguage === "english") {
      return phrase.translations?.[targetLanguage] || null;
    }
    return null; // For now, only support English as source
  };

  const playAudio = (phrase: any) => {
    const translation = getTranslation(phrase);
    if (translation?.audio_url) {
      // In a real app, this would play the audio file
      toast({
        title: "Audio Playback",
        description: "Playing audio pronunciation...",
      });
    } else {
      toast({
        title: "Audio Not Available",
        description: "Audio pronunciation not available for this translation",
        variant: "destructive",
      });
    }
  };

  const downloadOfflinePackage = () => {
    toast({
      title: "Download Started",
      description: "Downloading offline translation package...",
    });
  };

  const filteredPhrases = Array.isArray(phrases) ? phrases : commonPhrases.filter(phrase => 
    selectedCategory === "all" || phrase.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      
      <div className="lg:ml-72 min-h-screen">
        <Header 
          title="Medical Translation"
          subtitle="Pre-defined medical phrases in 20+ languages with audio support"
        />
        
        <main className="p-4 lg:p-6 space-y-6">
          {/* Translation Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe size={20} />
                <span>Language Selection</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">From</label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center space-x-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const temp = sourceLanguage;
                      setSourceLanguage(targetLanguage);
                      setTargetLanguage(temp);
                    }}
                  >
                    ⇄
                  </Button>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">To</label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center space-x-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  onClick={downloadOfflinePackage}
                  className="flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>Download Offline</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Translation */}
          {selectedPhrase && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary">Current Translation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-text-secondary">
                      {languages.find(l => l.code === sourceLanguage)?.flag} {languages.find(l => l.code === sourceLanguage)?.name}
                    </label>
                    <p className="text-lg font-medium text-text-primary">{selectedPhrase.englishPhrase}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <label className="text-sm font-medium text-text-secondary">
                      {languages.find(l => l.code === targetLanguage)?.flag} {languages.find(l => l.code === targetLanguage)?.name}
                    </label>
                    <div className="flex items-center space-x-3 mt-1">
                      <p className="text-lg font-medium text-primary flex-1">
                        {getTranslation(selectedPhrase)?.text || "Translation not available"}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playAudio(selectedPhrase)}
                        disabled={!getTranslation(selectedPhrase)?.audio_url}
                      >
                        <Volume2 size={16} className="mr-1" />
                        Play Audio
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Phrase Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(1).map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                className="p-4 h-auto flex-col"
                onClick={() => setSelectedCategory(category.value)}
              >
                <span className="text-sm font-medium text-center">{category.label}</span>
              </Button>
            ))}
          </div>

          {/* Phrases List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {categories.find(c => c.value === selectedCategory)?.label || "All Phrases"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPhrases.map((phrase: any) => {
                    const translation = getTranslation(phrase);
                    const isSelected = selectedPhrase?.id === phrase.id;
                    
                    return (
                      <div
                        key={phrase.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedPhrase(phrase)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div>
                              <p className="font-medium text-text-primary">{phrase.englishPhrase}</p>
                              {translation && (
                                <p className="text-text-secondary">{translation.text}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {categories.find(c => c.value === phrase.category)?.label}
                              </Badge>
                              {phrase.usage && phrase.usage > 10 && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star size={8} className="mr-1" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                playAudio(phrase);
                              }}
                              disabled={!translation?.audio_url}
                            >
                              <Volume2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredPhrases.length === 0 && (
                    <div className="text-center py-8">
                      <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-text-primary mb-2">No phrases found</h3>
                      <p className="text-text-secondary">
                        Try selecting a different category or language combination.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Phrases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonPhrases.filter(p => p.category === 'emergency').map((phrase) => {
                  const translation = getTranslation(phrase);
                  return (
                    <div
                      key={phrase.id}
                      className="p-4 border-2 border-red-200 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100"
                      onClick={() => setSelectedPhrase(phrase)}
                    >
                      <p className="font-medium text-red-900 mb-1">{phrase.englishPhrase}</p>
                      {translation && (
                        <p className="text-red-700 text-sm">{translation.text}</p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 border-red-300 text-red-700 hover:bg-red-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(phrase);
                        }}
                      >
                        <Volume2 size={14} className="mr-1" />
                        Emergency Audio
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
