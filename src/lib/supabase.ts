import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "https://ifqvnzunszqcrcllmejq.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcXZuenVuc3pxY3JjbGxtZWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NDQyOTcsImV4cCI6MjA3MjEyMDI5N30.hqhLkxhvvjsQ7iYcIfEiZwK0x7PbvtIE_ZlmPvrv0Mc"
);

export default supabase;
