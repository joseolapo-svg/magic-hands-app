import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Vite exposes env vars prefixed with VITE_ to the browser.
// Set these in a local .env file (see .env.example) or in your host's
// environment variables (Vercel / Netlify / Cloudflare Pages).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// When the keys are missing the app still runs using the in-memory seed data,
// so the build never breaks before you finish configuring Supabase.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null
