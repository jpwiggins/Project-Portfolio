import { Button } from "@/components/ui/button";
import { Plus, Bell, Settings } from "lucide-react";

interface HeaderProps {
  title: string;
  description?: string;
  onNewPolicyClick?: () => void;
}

export default function Header({ title, description, onNewPolicyClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
          {description && (
            <p className="text-neutral-600 mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {onNewPolicyClick && (
            <Button onClick={onNewPolicyClick} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Policy</span>
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
