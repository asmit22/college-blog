import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// This will help us debug in the console
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Environment variables are missing! Check your .env file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)