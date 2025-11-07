import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan anon key Supabase kamu
const supabaseUrl = 'https://njdnhhbjdhtqaylhrxzv.supabase.co'; // Ganti dengan URL Supabase-mu
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qZG5oaGJqZGh0cWF5bGhyeHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjM5NzMsImV4cCI6MjA3NjMzOTk3M30.PnlGDPgr7fCEmEDJrYac9mLM5_9GkRJp_6nxQ4C61tU'; // Ganti dengan anon key Supabase-mu

export const supabase = createClient(supabaseUrl, supabaseKey);
