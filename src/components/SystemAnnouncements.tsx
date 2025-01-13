import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const SystemAnnouncements = () => {
  const { data: announcements, refetch } = useQuery({
    queryKey: ['systemAnnouncements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_announcements')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('system_announcements_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'system_announcements'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <div className="dashboard-card h-[400px] transition-all duration-300 hover:shadow-lg overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6 text-dashboard-accent1">System Announcements</h2>
      <div className="space-y-4">
        {announcements?.map((announcement) => (
          <Alert 
            key={announcement.id} 
            variant={announcement.severity === "error" ? "destructive" : "default"}
            className="bg-dashboard-card border-dashboard-cardBorder"
          >
            <AlertCircle className="h-4 w-4 text-dashboard-accent2" />
            <AlertTitle className="text-dashboard-accent2">{announcement.title}</AlertTitle>
            <AlertDescription className="text-dashboard-text">
              {announcement.message}
            </AlertDescription>
          </Alert>
        ))}
        {(!announcements || announcements.length === 0) && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Announcements</AlertTitle>
            <AlertDescription>
              There are currently no system announcements.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default SystemAnnouncements;