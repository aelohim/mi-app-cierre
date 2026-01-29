// src/lib/supabaseClient.ts   ← te recomiendo moverlo a /lib o /utils

import { createClient } from '@supabase/supabase-js';

/*
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
*/

const supabaseUrl = 'https://tlaywodioxlbdtwhlmnn.supabase.co';
const supabaseAnonKey = 'sb_publishable_pyJQSnKSw2GFEi3MO69Ggw_7vxomVQe';
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase. Revisa tu .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);