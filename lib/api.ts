import { supabase } from './supabase';
import { Simulation, SimulationInputs, SimulationOutputs } from './types';

export async function createSimulation(
  inputs: SimulationInputs,
  outputs: SimulationOutputs
): Promise<Simulation> {
  const { data, error } = await supabase
    .from('simulations')
    .insert({ inputs, outputs })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSimulations(): Promise<Simulation[]> {
  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getSimulation(id: string): Promise<Simulation> {
  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateSimulation(
  id: string,
  inputs: SimulationInputs,
  outputs: SimulationOutputs
): Promise<Simulation> {
  const { data, error } = await supabase
    .from('simulations')
    .update({ inputs, outputs })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSimulation(id: string): Promise<void> {
  const { error } = await supabase
    .from('simulations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

