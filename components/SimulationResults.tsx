'use client';

import { SimulationOutputs } from '@/lib/types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SimulationResultsProps {
  outputs: SimulationOutputs | null;
  isLoading: boolean;
}

export default function SimulationResults({
  outputs,
  isLoading,
}: SimulationResultsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Running simulation...</p>
        </div>
      </div>
    );
  }

  if (!outputs) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">No Simulation Yet</h3>
          <p className="mt-2">
            Set your parameters and click &quot;Run Simulation&quot; to see results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Simulation Results
      </h2>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <MetricCard
          title="Total Energy Charged"
          value={`${outputs.totalEnergyCharged.toLocaleString()} kWh`}
          description="Annual energy consumption"
        />
        <MetricCard
          title="Concurrency Factor"
          value={`${outputs.concurrencyFactor}%`}
          description="Actual vs. theoretical max"
          highlight
        />
        <MetricCard
          title="Theoretical Max Power"
          value={`${outputs.theoreticalMaxPower} kW`}
          description="All chargers at full power"
        />
        <MetricCard
          title="Actual Max Power"
          value={`${outputs.actualMaxPower} kW`}
          description="Peak power demand observed"
        />
        <MetricCard
          title="Total Charging Events"
          value={outputs.totalChargingEvents.toLocaleString()}
          description="Per year"
        />
        <MetricCard
          title="Avg. Charging Duration"
          value={`${outputs.averageChargingDuration} min`}
          description="Per session"
        />
      </div>

      {/* Charging Events Breakdown */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Charging Events Breakdown
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Per Day</p>
            <p className="text-2xl font-bold text-gray-800">
              {outputs.dailyEvents}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Per Week</p>
            <p className="text-2xl font-bold text-gray-800">
              {outputs.weeklyEvents}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Per Month</p>
            <p className="text-2xl font-bold text-gray-800">
              {outputs.monthlyEvents}
            </p>
          </div>
        </div>
      </div>

      {/* Hourly Power Demand Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Average Hourly Power Demand (Typical Day)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={outputs.hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)} kW`}
              labelFormatter={(label) => `Hour: ${label}:00`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="powerDemand"
              stroke="#2563eb"
              strokeWidth={2}
              name="Power Demand"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Active Charge Points Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Average Active Charge Points (Typical Day)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={outputs.hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{
                value: 'Active Charge Points',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip
              labelFormatter={(label) => `Hour: ${label}:00`}
            />
            <Legend />
            <Bar
              dataKey="activeChargePoints"
              fill="#10b981"
              name="Active Charge Points"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  highlight = false,
}: {
  title: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-4 ${
        highlight
          ? 'bg-blue-50 border-2 border-blue-200'
          : 'bg-gray-50 border border-gray-200'
      }`}
    >
      <h4 className="text-sm font-medium text-gray-600 mb-1">{title}</h4>
      <p
        className={`text-2xl font-bold mb-1 ${
          highlight ? 'text-blue-600' : 'text-gray-800'
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

