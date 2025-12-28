export interface SimulationInputs {
  chargePointsCount: number;
  arrivalMultiplier: number; // 20-200%, stored as decimal (0.2 - 2.0)
  carConsumption: number; // kWh per 100km
  chargingPower: number; // kW per chargepoint
}

export interface ChargingEvent {
  timestamp: Date;
  chargePointId: number;
  energyCharged: number; // kWh
  duration: number; // minutes
}

export interface HourlyData {
  hour: number;
  powerDemand: number; // kW
  activeChargePoints: number;
}

export interface SimulationOutputs {
  totalEnergyCharged: number; // kWh
  theoreticalMaxPower: number; // kW
  actualMaxPower: number; // kW
  concurrencyFactor: number; // percentage (0-100)
  totalChargingEvents: number;
  averageChargingDuration: number; // minutes
  hourlyData: HourlyData[]; // 24 hours of data for visualization
  dailyEvents: number; // average per day
  weeklyEvents: number; // average per week
  monthlyEvents: number; // average per month
}

export interface Simulation {
  id: string;
  created_at: string;
  inputs: SimulationInputs;
  outputs: SimulationOutputs;
}

export interface SimulationFormData {
  chargePointsCount: number;
  arrivalMultiplier: number;
  carConsumption: number;
  chargingPower: number;
}

