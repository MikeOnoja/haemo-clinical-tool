import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iqikpluejyzqtgeccmkq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaWtwbHVlanl6cXRnZWNjbWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NDk4MjAsImV4cCI6MjA5NDAyNTgyMH0.tphBKhqC1qBZze0mEFDQ9OSt0M4Z8X4Gl7Y7kgp_kwU";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);