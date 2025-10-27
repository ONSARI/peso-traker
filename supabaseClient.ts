import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your actual Supabase URL and Anon Key from your project settings.
// It is recommended to use environment variables for these in a real production app.
const supabaseUrl = 'https://onkwfruejsifzolsnhve.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ua3dmcnVlanNpZnpvbHNuaHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MDcyODQsImV4cCI6MjA3NzA4MzI4NH0.67qNZISl0TEIgdgzba-qWq7j9yGUVVYF17xKsCvb8DU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)