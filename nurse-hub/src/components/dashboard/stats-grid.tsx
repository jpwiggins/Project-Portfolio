import { useQuery } from "@tanstack/react-query";
import { Calendar, Stethoscope, FileText, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function StatsGrid() {
  const { toast } = useToast();

  const { data: shifts, isLoading: shiftsLoading } = useQuery({
    queryKey: ["/api/shifts"],
    throwOnError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return false;
      }
      return true;
    },
  });

  const { data: notes, isLoading: notesLoading } = useQuery({
    queryKey: ["/api/notes"],
    throwOnError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return false;
      }
      return true;
    },
  });

  const { data: wellnessEntry } = useQuery({
    queryKey: ["/api/wellness/latest"],
    throwOnError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return false;
      }
      return true;
    },
  });

  const upcomingShifts = Array.isArray(shifts) ? shifts.filter((shift: any) => new Date(shift.startTime) > new Date()).length : 0;
  const totalNotes = Array.isArray(notes) ? notes.length : 0;
  const wellnessScore = (wellnessEntry as any)?.stressLevel ? Math.round((10 - (wellnessEntry as any).stressLevel) * 10) : 85;

  const stats = [
    {
      title: "Upcoming Shifts",
      value: shiftsLoading ? "..." : upcomingShifts.toString(),
      icon: Calendar,
      color: "primary",
      subtitle: upcomingShifts > 0 ? "Next: Tomorrow 7:00 AM" : "No upcoming shifts",
      trend: "up"
    },
    {
      title: "Quick Consults",
      value: "12",
      icon: Stethoscope,
      color: "secondary",
      subtitle: "+3 since yesterday",
      trend: "up"
    },
    {
      title: "Professional Resources",
      value: notesLoading ? "..." : totalNotes.toString(),
      icon: FileText,
      color: "accent",
      subtitle: totalNotes > 0 ? "Resources accessed: 2 hours ago" : "No resources accessed yet",
      trend: "neutral"
    },
    {
      title: "Wellness Score",
      value: `${wellnessScore}%`,
      icon: Heart,
      color: "success",
      subtitle: "Improving steadily",
      trend: "up"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          primary: "bg-primary/10 text-primary",
          secondary: "bg-secondary/10 text-secondary",
          accent: "bg-accent/10 text-accent",
          success: "bg-success/10 text-success"
        };

        return (
          <Card key={index} className="hover-lift cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4 text-sm text-text-secondary">
                {stat.trend === "up" && <span className="text-success">↗ </span>}
                {stat.trend === "down" && <span className="text-error">↘ </span>}
                {stat.trend === "neutral" && <span>📝 </span>}
                {stat.subtitle}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
