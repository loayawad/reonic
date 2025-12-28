'use client';

import React, { useState } from 'react';
import SimulationForm from '../../components/SimulationForm';
import SimulationResults from '../../components/SimulationResults';
import { SimulationFormData, SimulationOutputs, Simulation } from '../../lib/types';
import { runMockSimulation } from '../../lib/mockSimulation';
import { useSimulations, useCreateSimulation, useUpdateSimulation, useDeleteSimulation } from '../../hooks/useSimulation';

export default function Scene() {
  const [currentOutputs, setCurrentOutputs] = useState<SimulationOutputs | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loadedSimulationId, setLoadedSimulationId] = useState<string | null>(null);

  const { data: savedSimulations = [], isLoading: isLoadingSimulations } = useSimulations();
  const createSimulation = useCreateSimulation();
  const updateSimulation = useUpdateSimulation();
  const deleteSimulation = useDeleteSimulation();

  const handleSubmit = async (formData: SimulationFormData, shouldUpdate: boolean = false) => {
    setIsSimulating(true);

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Run mock simulation
    const outputs = runMockSimulation(formData);
    setCurrentOutputs(outputs);

    // Save or update in database
    try {
      if (shouldUpdate && loadedSimulationId) {
        await updateSimulation.mutateAsync({
          id: loadedSimulationId,
          inputs: formData,
          outputs,
        });
      } else {
        const newSim = await createSimulation.mutateAsync({
          inputs: formData,
          outputs,
        });
        setLoadedSimulationId(newSim.id);
      }
    } catch (error) {
      console.error('Failed to save simulation:', error);
    }

    setIsSimulating(false);
  };

  const handleLoadSimulation = (simulation: Simulation) => {
    setCurrentOutputs(simulation.outputs);
    setLoadedSimulationId(simulation.id);
  };

  const handleDeleteSimulation = async (id: string) => {
    if (confirm('Are you sure you want to delete this simulation?')) {
      try {
        await deleteSimulation.mutateAsync(id);
        if (loadedSimulationId === id) {
          setLoadedSimulationId(null);
          setCurrentOutputs(null);
        }
      } catch (error) {
        console.error('Failed to delete simulation:', error);
      }
    }
  };

  const handleNewSimulation = () => {
    setLoadedSimulationId(null);
    setCurrentOutputs(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            EV Charging Simulation
          </h1>
          <p className="text-gray-600 mt-2">
            Simulate and analyze electric vehicle charging patterns
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Parameters (1/3) */}
          <div className="lg:col-span-1">
            <SimulationForm
              onSubmit={handleSubmit}
              isLoading={isSimulating}
              savedSimulations={savedSimulations}
              onLoadSimulation={handleLoadSimulation}
              onDeleteSimulation={handleDeleteSimulation}
              onNewSimulation={handleNewSimulation}
              isLoadingSimulations={isLoadingSimulations}
              loadedSimulationId={loadedSimulationId}
            />
          </div>

          {/* Right Side: Results (2/3) */}
          <div className="lg:col-span-2">
            <SimulationResults
              outputs={currentOutputs}
              isLoading={isSimulating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

