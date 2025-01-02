import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import { UserCheck } from 'lucide-react';

type CollectorProfile = Database['public']['Tables']['profiles']['Row'];

const CollectorsList = () => {
  const { data: collectors, isLoading, error } = useQuery({
    queryKey: ['collectors_profiles'],
    queryFn: async () => {
      console.log('Fetching collectors profiles...');
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          prefix,
          collector_number,
          is_active,
          email,
          phone
        `)
        .order('collector_number', { ascending: true })
        .not('collector_number', 'is', null)
        .throwOnError();
      
      if (error) {
        console.error('Error fetching collectors:', error);
        throw error;
      }
      
      console.log('Fetched collectors:', data);
      return data as CollectorProfile[];
    },
  });

  if (isLoading) return <div className="text-center py-4">Loading collectors...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading collectors: {error.message}</div>;
  if (!collectors?.length) return <div className="text-center py-4">No collectors found</div>;

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {collectors.map((collector) => (
          <div 
            key={collector.id} 
            className="bg-dashboard-card p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
                  {collector.prefix}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">{collector.full_name}</p>
                    <span className="text-sm text-gray-400">#{collector.collector_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dashboard-text">
                    <UserCheck className="w-4 h-4" />
                    <span>Collector</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full ${
                  collector.is_active 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {collector.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectorsList;