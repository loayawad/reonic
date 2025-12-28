import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSimulation,
  getSimulations,
  getSimulation,
  updateSimulation,
  deleteSimulation,
} from '../lib/api';
import { SimulationInputs, SimulationOutputs } from '../lib/types';

export function useSimulations() {
  return useQuery({
    queryKey: ['simulations'],
    queryFn: getSimulations,
  });
}

export function useSimulation(id: string | null) {
  return useQuery({
    queryKey: ['simulation', id],
    queryFn: () => getSimulation(id!),
    enabled: !!id,
  });
}

export function useCreateSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      inputs,
      outputs,
    }: {
      inputs: SimulationInputs;
      outputs: SimulationOutputs;
    }) => createSimulation(inputs, outputs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
    },
  });
}

export function useUpdateSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      inputs,
      outputs,
    }: {
      id: string;
      inputs: SimulationInputs;
      outputs: SimulationOutputs;
    }) => updateSimulation(id, inputs, outputs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
    },
  });
}

export function useDeleteSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSimulation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
    },
  });
}

