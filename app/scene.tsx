'use client';

import { useState } from 'react';
import SimulationForm from '@/components/SimulationForm';
import SimulationResults from '@/components/SimulationResults';
import { SimulationFormData, SimulationOutputs, Simulation } from '@/lib/types';
import { runMockSimulation } from '@/lib/mockSimulation';
import { useSimulations, useCreateSimulation } from '@/hooks/useSimulation';

export default function Scene() {
  const [currentOutputs, setCurrentOutputs] = useState<SimulationOutputs | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const { data: savedSimulations = [], isLoading: isLoadingSimulations } = useSimulations();
  const createSimulation = useCreateSimulation();

  const handleSubmit = async (formData: SimulationFormData) => {
    setIsSimulating(true);

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Run mock simulation
    const outputs = runMockSimulation(formData);
    setCurrentOutputs(outputs);

    // Save to database
    try {
      await createSimulation.mutateAsync({
        inputs: formData,
        outputs,
      });
    } catch (error) {
      console.error('Failed to save simulation:', error);
    }

    setIsSimulating(false);
  };

  const handleLoadSimulation = (simulation: Simulation) => {
    setCurrentOutputs(simulation.outputs);
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
              isLoadingSimulations={isLoadingSimulations}
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

