import { createClient } from '@supabase/supabase-js';
import { Simulation } from './types';

// Using identation is not production ready approach, but it's fine for the case of simplification
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      simulations: {
        Row: Simulation;
        Insert: Omit<Simulation, 'id' | 'created_at'>;
        Update: Partial<Omit<Simulation, 'id' | 'created_at'>>;
      };
    };
  };
};

