import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Users, 
  History,
  Settings,
  Wallet,
  LogOut
} from "lucide-react";
import { UserRole } from "@/hooks/useRoleAccess";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SidePanelProps {
  onTabChange: (tab: string) => void;
  userRole: UserRole;
}

const SidePanel = ({ onTabChange, userRole }: SidePanelProps) => {
  const isAdmin = userRole === 'admin';
  const isCollector = userRole === 'collector';
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-dashboard-card border-r border-white/10">
      <div className="p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-white mb-1">
          Dashboard
        </h2>
        <p className="text-sm text-dashboard-muted">
          Manage your account
        </p>
      </div>
      
      <ScrollArea className="flex-1 px-4 lg:px-6">
        <div className="space-y-1.5">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm group"
            onClick={() => onTabChange('dashboard')}
          >
            <LayoutDashboard className="h-4 w-4 text-[#9b87f5] group-hover:text-[#D6BCFA]" />
            Overview
          </Button>

          {(isAdmin || isCollector) && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm group"
              onClick={() => onTabChange('users')}
            >
              <Users className="h-4 w-4 text-[#7E69AB] group-hover:text-[#D6BCFA]" />
              Members
            </Button>
          )}

          {isAdmin && (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sm group"
                onClick={() => onTabChange('financials')}
              >
                <Wallet className="h-4 w-4 text-[#6E59A5] group-hover:text-[#D6BCFA]" />
                Collectors & Financials
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sm group"
                onClick={() => onTabChange('audit')}
              >
                <History className="h-4 w-4 text-[#8B5CF6] group-hover:text-[#D6BCFA]" />
                Audit Logs
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sm group"
                onClick={() => onTabChange('system')}
              >
                <Settings className="h-4 w-4 text-[#E5DEFF] group-hover:text-[#D6BCFA]" />
                System
              </Button>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 lg:p-6 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm text-dashboard-muted hover:text-white group"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 text-[#7E69AB] group-hover:text-[#D6BCFA]" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SidePanel;