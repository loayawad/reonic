import { createClient } from '@supabase/supabase-js';
import { Simulation } from './types';

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

