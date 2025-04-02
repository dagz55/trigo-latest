export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          email: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
        }
      }
      locations: {
        Row: {
          id: string
          created_at: string
          user_id: string
          latitude: number
          longitude: number
          address: string | null
          toda_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          latitude: number
          longitude: number
          address?: string | null
          toda_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          latitude?: number
          longitude?: number
          address?: string | null
          toda_id?: string | null
        }
      }
      todas: {
        Row: {
          id: string
          name: string
          area: string
          center_latitude: number
          center_longitude: number
          radius: number
        }
        Insert: {
          id?: string
          name: string
          area: string
          center_latitude: number
          center_longitude: number
          radius: number
        }
        Update: {
          id?: string
          name?: string
          area?: string
          center_latitude?: number
          center_longitude?: number
          radius?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

