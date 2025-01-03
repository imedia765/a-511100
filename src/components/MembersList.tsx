import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Member = Database['public']['Tables']['members']['Row'];
type AppRole = 'admin' | 'collector' | 'member';

interface MembersListProps {
  searchTerm: string;
  userRole: string | null;
}

const MembersList = ({ searchTerm, userRole }: MembersListProps) => {
  const { toast } = useToast();

  const { data: members, isLoading, error } = useQuery({
    queryKey: ['members', searchTerm, userRole],
    queryFn: async () => {
      console.log('Fetching members...');
      let query = supabase
        .from('members')
        .select('*');
      
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,member_number.ilike.%${searchTerm}%,collector.ilike.%${searchTerm}%`);
      }

      if (userRole === 'collector') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('collector_id', user.id);
        }
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }
      
      return data as Member[];
    },
  });

  const handleRoleChange = async (memberId: string, newRole: AppRole) => {
    if (!memberId) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, delete existing role
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', memberId);

      if (deleteError) throw deleteError;

      // Then insert new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: memberId,
          role: newRole
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: `Role updated to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div className="text-center py-4">Loading members...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading members: {error.message}</div>;
  if (!members?.length) return <div className="text-center py-4">No members found</div>;

  return (
    <ScrollArea className="h-[600px] w-full rounded-md">
      <Accordion type="single" collapsible className="space-y-4">
        {members.map((member) => (
          <AccordionItem 
            key={member.id} 
            value={member.id}
            className="bg-dashboard-card border-white/10 shadow-lg hover:border-dashboard-accent1/50 transition-all duration-300 p-6 rounded-lg border"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-6 w-full">
                <Avatar className="h-16 w-16 border-2 border-dashboard-accent1/20">
                  <AvatarFallback className="bg-dashboard-accent1/20 text-lg text-dashboard-accent1">
                    {member.full_name?.charAt(0) || 'M'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex justify-between items-center w-full">
                  <div>
                    <h3 className="text-xl font-medium text-dashboard-accent2 mb-1">{member.full_name}</h3>
                    <p className="bg-dashboard-accent1/10 px-3 py-1 rounded-full inline-flex items-center">
                      <span className="text-dashboard-accent1">Member #</span>
                      <span className="text-dashboard-accent2 font-medium ml-1">{member.member_number}</span>
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    member.status === 'active' 
                      ? 'bg-dashboard-accent3/20 text-dashboard-accent3' 
                      : 'bg-dashboard-muted/20 text-dashboard-muted'
                  }`}>
                    {member.status || 'Pending'}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-dashboard-muted mb-1">Contact Information</p>
                  <p className="text-dashboard-text">{member.email || 'No email provided'}</p>
                  <p className="text-dashboard-text">{member.phone || 'No phone provided'}</p>
                </div>
                <div>
                  <p className="text-dashboard-muted mb-1">Address</p>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-dashboard-text">
                      {member.address || 'No address provided'}
                      {member.town && `, ${member.town}`}
                      {member.postcode && ` ${member.postcode}`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-dashboard-muted mb-1">Membership Type</p>
                    <p className="text-dashboard-text">{member.membership_type || 'Standard'}</p>
                  </div>
                  <div>
                    <p className="text-dashboard-muted mb-1">Collector</p>
                    <p className="text-dashboard-text">{member.collector || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-dashboard-muted mb-1">Role</p>
                    {userRole === 'admin' && member.auth_user_id ? (
                      <Select onValueChange={(value) => handleRoleChange(member.auth_user_id!, value as AppRole)}>
                        <SelectTrigger className="w-[140px] h-8 bg-dashboard-accent1/10 border-dashboard-accent1/20">
                          <SelectValue placeholder="Change Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="collector">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Collector
                            </div>
                          </SelectItem>
                          <SelectItem value="member">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Member
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-dashboard-text">Member</p>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
};

export default MembersList;