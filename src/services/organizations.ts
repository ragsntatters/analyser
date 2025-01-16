import { supabase } from './supabase';

export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  user?: {
    email: string;
  };
}

export async function getOrganization(userId: string): Promise<Organization | null> {
  try {
    const { data: member, error: memberError } = await supabase
      .from('organization_members')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (memberError || !member) {
      // Create default organization for user
      const { data: org, error: createOrgError } = await supabase
        .from('organizations')
        .insert([{ name: 'My Organization' }])
        .select()
        .single();

      if (createOrgError) {
        console.error('Error creating organization:', createOrgError);
        return null;
      }

      // Add user as owner
      const { error: addMemberError } = await supabase
        .from('organization_members')
        .insert([{
          organization_id: org.id,
          user_id: userId,
          role: 'owner'
        }]);

      if (addMemberError) {
        console.error('Error adding member:', addMemberError);
        return null;
      }

      return org;
    }

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', member.organization_id)
      .maybeSingle();

    if (orgError) {
      console.error('Error fetching organization:', orgError);
      return null;
    }
    
    return org;
  } catch (err) {
    console.error('Error in getOrganization:', err);
    return null;
  }
}

export async function getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  try {
    const { data, error } = await supabase
      .from('organization_members')
      .select(`
        id,
        organization_id,
        user_id,
        role,
        created_at,
        user:users!user_id (
          email
        )
      `)
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Error fetching members:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getOrganizationMembers:', err);
    return [];
  }
}

export async function updateOrganization(id: string, name: string): Promise<Organization | null> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .update({ name })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating organization:', error);
      throw new Error('Failed to update organization');
    }
    
    return data;
  } catch (err) {
    console.error('Error in updateOrganization:', err);
    throw err;
  }
}

export async function inviteMember(
  organizationId: string,
  email: string,
  role: 'admin' | 'member' = 'member'
): Promise<boolean> {
  try {
    // First check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userError) {
      console.error('Error checking user:', userError);
      return false;
    }

    if (!user) {
      console.error('User not found');
      throw new Error('User not found');
    }

    // Add member to organization
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert([{
        organization_id: organizationId,
        user_id: user.id,
        role
      }]);

    if (memberError) {
      console.error('Error adding member:', memberError);
      throw new Error('Failed to add member');
    }

    return true;
  } catch (err) {
    console.error('Error in inviteMember:', err);
    throw err;
  }
}

export async function updateMemberRole(memberId: string, role: 'admin' | 'member'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('organization_members')
      .update({ role })
      .eq('id', memberId);

    if (error) {
      console.error('Error updating role:', error);
      throw new Error('Failed to update member role');
    }

    return true;
  } catch (err) {
    console.error('Error in updateMemberRole:', err);
    throw err;
  }
}

export async function removeMember(memberId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('id', memberId);

    if (error) {
      console.error('Error removing member:', error);
      throw new Error('Failed to remove member');
    }

    return true;
  } catch (err) {
    console.error('Error in removeMember:', err);
    throw err;
  }
}