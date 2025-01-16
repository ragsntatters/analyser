import { supabase } from './supabase';
import type { AnalysisResult, GoogleDomain } from '../types';

export interface Analysis {
  id: string;
  user_id: string;
  keyword: string;
  domain: GoogleDomain;
  results: AnalysisResult[];
  created_at: string;
}

export async function saveAnalysis(
  userId: string,
  keyword: string,
  domain: GoogleDomain,
  results: AnalysisResult[]
): Promise<Analysis | null> {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .insert({
        user_id: userId,
        keyword,
        domain,
        results,
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error saving analysis:', err);
    throw err;
  }
}

export async function getAnalyses(userId: string): Promise<Analysis[]> {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching analyses:', err);
    return [];
  }
}

export async function deleteAnalysis(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('analyses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    console.error('Error deleting analysis:', err);
    throw err;
  }
}