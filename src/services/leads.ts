import { supabase } from './supabase';
import type { AnalysisResult } from '../types';

export interface Lead {
  id: string;
  user_id: string;
  url: string;
  business_name: string;
  analysis_id?: string;
  created_at: string;
}

export async function saveLead(
  userId: string,
  result: AnalysisResult,
  analysisId?: string
): Promise<Lead | null> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        user_id: userId,
        url: result.url,
        business_name: result.businessName,
        analysis_id: analysisId,
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error saving lead:', err);
    throw err;
  }
}

export async function getLeads(userId: string): Promise<Lead[]> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching leads:', err);
    return [];
  }
}

export async function deleteLead(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    console.error('Error deleting lead:', err);
    throw err;
  }
}