import { supabase } from './supabase';

export interface UserSettings {
  id: string;
  user_id: string;
  google_api_key: string | null;
  search_engine_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Error loading settings:', err);
    return null;
  }
}

export async function saveUserSettings(
  userId: string,
  settings: Partial<Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<UserSettings | null> {
  try {
    // First check if settings exist
    const existing = await getUserSettings(userId);
    
    if (existing) {
      // Update existing settings
      const { data, error } = await supabase
        .from('user_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Error updating settings:', error);
        throw new Error('Failed to update settings');
      }
      return data;
    } else {
      // Insert new settings
      const { data, error } = await supabase
        .from('user_settings')
        .insert([{
          user_id: userId,
          ...settings,
        }])
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Error inserting settings:', error);
        throw new Error('Failed to create settings');
      }
      return data;
    }
  } catch (err) {
    console.error('Error saving settings:', err);
    throw err;
  }
}