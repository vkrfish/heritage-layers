import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env["VITE_SUPABASE_URL"] as string) || "https://mdqvyvwckuwofvrbpefv.supabase.co";
const supabaseAnonKey =
  (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcXZ5dndja3V3b2Z2cmJwZWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NDU0NjMsImV4cCI6MjEwNzUyMTQ2M30.lq5teWqZWCV-aoklaaWz3JxFTXXtQwhGZ-RnW69pX9g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
