'use client';

import { SimulationFormData, Simulation } from '@/lib/types';
import { useState, useEffect } from 'react';

interface SimulationFormProps {
  onSubmit: (data: SimulationFormData) => void;
  isLoading: boolean;
  savedSimulations: Simulation[];
  onLoadSimulation: (simulation: Simulation) => void;
  isLoadingSimulations: boolean;
}

export default function SimulationForm({
  onSubmit,
  isLoading,
  savedSimulations,
  onLoadSimulation,
  isLoadingSimulations,
}: SimulationFormProps) {
  const [formData, setFormData] = useState<SimulationFormData>({
    chargePointsCount: 20,
    arrivalMultiplier: 100,
    carConsumption: 18,
    chargingPower: 11,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: SimulationFormData = {
      ...formData,
      arrivalMultiplier: formData.arrivalMultiplier / 100, // Convert percentage to decimal
    };
    
    onSubmit(data);
  };

  const handleLoadSimulation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const simulationId = e.target.value;
    if (simulationId) {
      const simulation = savedSimulations.find((s) => s.id === simulationId);
      if (simulation) {
        onLoadSimulation(simulation);
        setFormData({
          chargePointsCount: simulation.inputs.chargePointsCount,
          arrivalMultiplier: simulation.inputs.arrivalMultiplier * 100, // Convert back to percentage
          carConsumption: simulation.inputs.carConsumption,
          chargingPower: simulation.inputs.chargingPower,
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Simulation Parameters
      </h2>

      {/* Load Previous Simulation */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Load Previous Simulation
        </label>
        <select
          onChange={handleLoadSimulation}
          disabled={isLoadingSimulations}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">Select a simulation...</option>
          {savedSimulations.map((sim) => (
            <option key={sim.id} value={sim.id}>
              {new Date(sim.created_at).toLocaleString()} -{' '}
              {sim.inputs.chargePointsCount} chargepoints
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-5 flex-1">
          {/* Charge Points Count */}
          <div>
            <label
              htmlFor="chargePointsCount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number of Charge Points
            </label>
            <input
              type="number"
              id="chargePointsCount"
              min="1"
              max="100"
              value={formData.chargePointsCount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  chargePointsCount: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Arrival Multiplier */}
          <div>
            <label
              htmlFor="arrivalMultiplier"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Arrival Probability Multiplier (%)
            </label>
            <input
              type="number"
              id="arrivalMultiplier"
              min="20"
              max="200"
              value={formData.arrivalMultiplier}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  arrivalMultiplier: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Range: 20% - 200% (default: 100%)
            </p>
          </div>

          {/* Car Consumption */}
          <div>
            <label
              htmlFor="carConsumption"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Car Consumption (kWh per 100km)
            </label>
            <input
              type="number"
              id="carConsumption"
              min="10"
              max="30"
              step="0.1"
              value={formData.carConsumption}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  carConsumption: parseFloat(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Charging Power */}
          <div>
            <label
              htmlFor="chargingPower"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Charging Power per Chargepoint (kW)
            </label>
            <input
              type="number"
              id="chargingPower"
              min="3.7"
              max="50"
              step="0.1"
              value={formData.chargingPower}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  chargingPower: parseFloat(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="hover:cursor-pointer w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isLoading ? 'Running Simulation...' : 'Run Simulation'}
        </button>
      </form>
    </div>
  );
}

