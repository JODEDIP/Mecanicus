
//import {EXPO_PUBLIC_SUPABASE_ANON_KEY , EXPO_PUBLIC_SUPABASE_URL} from "@env"


const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
