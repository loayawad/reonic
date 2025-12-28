import { SimulationInputs, SimulationOutputs, HourlyData } from './types';

// Simplified arrival pattern (percentage of max usage by hour)
const HOURLY_USAGE_PATTERN = [
  0.05, 0.03, 0.02, 0.02, 0.03, 0.05, // 00:00 - 06:00 (low usage at night)
  0.10, 0.15, 0.25, 0.30, 0.40, 0.45, // 06:00 - 12:00 (morning ramp up)
  0.50, 0.55, 0.60, 0.65, 0.70, 0.75, // 12:00 - 18:00 (peak hours)
  0.80, 0.60, 0.40, 0.25, 0.15, 0.08, // 18:00 - 24:00 (evening decline)
];

export function runMockSimulation(inputs: SimulationInputs): SimulationOutputs {
  const {
    chargePointsCount,
    arrivalMultiplier,
    carConsumption,
    chargingPower,
  } = inputs;

  const theoreticalMaxPower = chargePointsCount * chargingPower;

  // Generate hourly data for a typical day
  const hourlyData: HourlyData[] = HOURLY_USAGE_PATTERN.map((usage, hour) => {
    const adjustedUsage = usage * arrivalMultiplier;
    const activePoints = Math.min(
      Math.round(chargePointsCount * adjustedUsage),
      chargePointsCount
    );
    const powerDemand = activePoints * chargingPower;

    return {
      hour,
      powerDemand: Math.round(powerDemand * 100) / 100,
      activeChargePoints: activePoints,
    };
  });

  const actualMaxPower = Math.max(...hourlyData.map(d => d.powerDemand));
  const concurrencyFactor = (actualMaxPower / theoreticalMaxPower) * 100;
  const avgActivePoints = hourlyData.reduce((sum, d) => sum + d.activeChargePoints, 0) / 24;
  
  // Average energy per charging session (assuming mix of short/long charges)
  const avgEnergyPerSession = (carConsumption / 100) * 50; // Average 50km charge
  const avgChargingDuration = (avgEnergyPerSession / chargingPower) * 60; // in minutes
  
  // Events per day based on average active points and turnover
  const dailyEvents = Math.round(avgActivePoints * 3.5); // ~3.5 sessions per charger per day
  const weeklyEvents = dailyEvents * 7;
  const monthlyEvents = dailyEvents * 30;
  const totalChargingEvents = dailyEvents * 365;
  
  // Total energy: events * avg energy per event
  const totalEnergyCharged = totalChargingEvents * avgEnergyPerSession;

  return {
    totalEnergyCharged: Math.round(totalEnergyCharged * 100) / 100,
    theoreticalMaxPower: Math.round(theoreticalMaxPower * 100) / 100,
    actualMaxPower: Math.round(actualMaxPower * 100) / 100,
    concurrencyFactor: Math.round(concurrencyFactor * 100) / 100,
    totalChargingEvents,
    averageChargingDuration: Math.round(avgChargingDuration * 100) / 100,
    hourlyData,
    dailyEvents: Math.round(dailyEvents * 100) / 100,
    weeklyEvents: Math.round(weeklyEvents * 100) / 100,
    monthlyEvents: Math.round(monthlyEvents * 100) / 100,
  };
}

