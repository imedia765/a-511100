import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MemberProfileCard from './MemberProfileCard';
import { Button } from "@/components/ui/button";

interface DashboardViewProps {
  onLogout: () => void;
}

const DashboardView = ({ onLogout }: DashboardViewProps) => {
  const { toast } = useToast();

  const { data: memberProfile, isError } = useQuery({
    queryKey: ['memberProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching member profile:', error);
        toast({
          title: "Error",
          description: "Failed to load member profile",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  return (
    <div>
      {isError && <p>Error loading member profile.</p>}
      {memberProfile && <MemberProfileCard memberProfile={memberProfile} />}
      <Button onClick={onLogout}>Logout</Button>
    </div>
  );
};

export default DashboardView;