import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { getUser, logout, isAdmin } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChartPie, 
  FileText, 
  ClipboardCheck, 
  AlertTriangle, 
  Users, 
  History, 
  Folder,
  Shield,
  LogOut,
  User,
  Crown
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: ChartPie },
  { name: "Policy Management", href: "/policy-management", icon: FileText },
  { name: "Compliance Frameworks", href: "/compliance-frameworks", icon: ClipboardCheck },
  { name: "Risk Assessment", href: "/risk-assessment", icon: AlertTriangle },
  { name: "Vendor Management", href: "/vendor-management", icon: Users },
  { name: "Team Collaboration", href: "/team-collaboration", icon: Users, agencyOnly: true },
  { name: "Audit Reports", href: "/audit-reports", icon: History },
  { name: "Document Library", href: "/document-library", icon: Folder },
];

export default function Sidebar() {
  const [location] = useLocation();
  const user = getUser();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-neutral-200 flex flex-col">
      {/* Logo Header */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <img 
            src="/attached_assets/regready-screenshot.png" 
            alt="RegReady Logo" 
            className="w-12 h-9 object-contain"
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-neutral-900">RegReady</h1>
            <p className="text-xs text-neutral-500">Compliance Platform</p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
                {item.agencyOnly && (
                  <Badge className="ml-auto bg-yellow-100 text-yellow-800 text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Agency
                  </Badge>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg mb-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900">{user?.username || 'User'}</p>
            <p className="text-xs text-neutral-500 capitalize">{user?.subscriptionTier || 'Free'} Plan</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="w-full justify-start text-neutral-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
