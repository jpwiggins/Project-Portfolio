import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

import {
  Home,
  Clock,
  Search,
  BriefcaseMedical,
  Calendar,
  FileText,
  Globe,
  Heart,
  Settings,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigationItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/consult", icon: Clock, label: "9-Min Consult" },
  { href: "/diagnostic", icon: Search, label: "Visual Diagnostics" },
  { href: "/references", icon: BriefcaseMedical, label: "Clinical References" },
  { href: "/scheduling", icon: Calendar, label: "Shift Scheduling" },

  { href: "/translation", icon: Globe, label: "Translation" },
  { href: "/wellness", icon: Heart, label: "Mental Health" },
];

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="default"
          size="icon"
          onClick={toggleMobile}
          className="bg-primary text-white shadow-lg"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-40 transition-transform duration-300 sidebar-transition",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-center">
            <img 
              src="/assets/nursehub-logo.png" 
              alt="NurseHub Logo" 
              className="h-14 w-auto"
            />
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-gray-100 text-text-secondary hover:text-primary"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.profileImageUrl || ""} />
                <AvatarFallback>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-text-secondary">
                  {user?.subscriptionStatus === 'active' ? 'Pro Plan' : 'Free Plan'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-text-secondary hover:text-primary"
                onClick={() => window.location.href = '/api/logout'}
              >
                <Settings size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
