export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: {
          id: string
          user_id: string
          keyword: string
          domain: string
          created_at: string
          results: Json
        }
        Insert: {
          id?: string
          user_id: string
          keyword: string
          domain: string
          created_at?: string
          results: Json
        }
        Update: {
          id?: string
          user_id?: string
          keyword?: string
          domain?: string
          created_at?: string
          results?: Json
        }
      }
      leads: {
        Row: {
          id: string
          user_id: string
          url: string
          business_name: string
          created_at: string
          analysis_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          business_name: string
          created_at?: string
          analysis_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          business_name?: string
          created_at?: string
          analysis_id?: string | null
        }
      }
    }
  }
}