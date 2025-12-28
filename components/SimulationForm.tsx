'use client';

import React, { useState } from 'react';
import { SimulationFormData, Simulation } from '../lib/types';

interface SimulationFormProps {
  onSubmit: (data: SimulationFormData, shouldUpdate?: boolean) => void;
  isLoading: boolean;
  savedSimulations: Simulation[];
  onLoadSimulation: (simulation: Simulation) => void;
  onDeleteSimulation: (id: string) => void;
  onNewSimulation: () => void;
  isLoadingSimulations: boolean;
  loadedSimulationId: string | null;
}

export default function SimulationForm({
  onSubmit,
  isLoading,
  savedSimulations,
  onLoadSimulation,
  onDeleteSimulation,
  onNewSimulation,
  isLoadingSimulations,
  loadedSimulationId,
}: SimulationFormProps) {
  const [formData, setFormData] = useState<SimulationFormData>({
    chargePointsCount: 20,
    arrivalMultiplier: 100,
    carConsumption: 18,
    chargingPower: 11,
  });

  const handleSubmit = (e: React.FormEvent, shouldUpdate: boolean = false) => {
    e.preventDefault();
    
    const data: SimulationFormData = {
      ...formData,
      arrivalMultiplier: formData.arrivalMultiplier / 100, // Convert percentage to decimal
    };
    
    onSubmit(data, shouldUpdate);
  };

  const handleLoadSimulation = (simulation: Simulation) => {
    onLoadSimulation(simulation);
    setFormData({
      chargePointsCount: simulation.inputs.chargePointsCount,
      arrivalMultiplier: simulation.inputs.arrivalMultiplier * 100, // Convert back to percentage
      carConsumption: simulation.inputs.carConsumption,
      chargingPower: simulation.inputs.chargingPower,
    });
  };

  const handleNewSimulation = () => {
    onNewSimulation();
    setFormData({
      chargePointsCount: 20,
      arrivalMultiplier: 100,
      carConsumption: 18,
      chargingPower: 11,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {loadedSimulationId ? 'Edit Simulation' : 'New Simulation'}
        </h2>
        {loadedSimulationId && (
          <button
            onClick={handleNewSimulation}
            className="hover:cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + New
          </button>
        )}
      </div>

      {/* Saved Simulations List */}
      {savedSimulations.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Saved Simulations
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
            {savedSimulations.map((sim) => (
              <div
                key={sim.id}
                className={`flex items-center justify-between p-3 hover:cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                  loadedSimulationId === sim.id ? 'bg-blue-50' : ''
                }`}
              >
                <button
                  onClick={() => handleLoadSimulation(sim)}
                  className="flex-1 text-left text-sm text-gray-700 hover:cursor-pointer hover:text-gray-900"
                >
                  <div className="font-medium">
                    {new Date(sim.created_at).toLocaleDateString()} {new Date(sim.created_at).toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {sim.inputs.chargePointsCount} chargepoints, {sim.inputs.chargingPower}kW
                  </div>
                </button>
                <button
                  onClick={() => onDeleteSimulation(sim.id)}
                  className="ml-2 text-red-600 hover:cursor-pointer hover:text-red-700 p-1 hover:bg-red-50 rounded-md"
                  title="Delete simulation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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

        {loadedSimulationId ? (
          <div className="flex gap-3 mt-6">
            <button
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
              className="hover:cursor-pointer flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
            <button
              onClick={(e) => handleSubmit(e, false)}
              disabled={isLoading}
              className="hover:cursor-pointer flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save as New'}
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="hover:cursor-pointer w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isLoading ? 'Running Simulation...' : 'Run Simulation'}
          </button>
        )}
      </form>
    </div>
  );
}

