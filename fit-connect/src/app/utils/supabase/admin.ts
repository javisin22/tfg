import { createClient as createAdminClient } from '@supabase/supabase-js';

export const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // your service role key
  { auth: { persistSession: false, detectSessionInUrl: false, autoRefreshToken: false } }
);
