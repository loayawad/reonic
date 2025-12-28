import { describe, it, expect } from 'vitest';
import { runMockSimulation, HOURLY_USAGE_PATTERN } from './mockSimulation';
import { SimulationInputs } from './types';

describe('EV Charging Simulation', () => {
  describe('Standard Configuration (20 CP, 11kW)', () => {
    it('should return exact expected values for default parameters', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.theoreticalMaxPower).toBe(220);
      expect(result.actualMaxPower).toBe(176);
      expect(result.concurrencyFactor).toBe(80);
      expect(result.totalEnergyCharged).toBe(75555);
      expect(result.totalChargingEvents).toBe(8395);
      expect(result.averageChargingDuration).toBe(49.09);
      expect(result.dailyEvents).toBe(23);
      expect(result.weeklyEvents).toBe(161);
      expect(result.monthlyEvents).toBe(690);
    });

    it('should generate exactly 24 hours of data', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.hourlyData).toHaveLength(24);
      
      // Verify structure of each hour
      result.hourlyData.forEach((data, index) => {
        expect(data.hour).toBe(index);
        expect(typeof data.powerDemand).toBe('number');
        expect(typeof data.activeChargePoints).toBe('number');
      });
    });

    it('should have peak power at hour 18 (18:00)', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.hourlyData[18].powerDemand).toBe(176);
      expect(result.hourlyData[18].activeChargePoints).toBe(16);
    });

    it('should have lowest usage during night hours (2-3 AM)', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.hourlyData[2].powerDemand).toBe(0);
      expect(result.hourlyData[2].activeChargePoints).toBe(0);
      expect(result.hourlyData[3].powerDemand).toBe(0);
      expect(result.hourlyData[3].activeChargePoints).toBe(0);
    });
  });

  describe('Single Chargepoint', () => {
    it('should return exact values for 1 chargepoint', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 1,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.theoreticalMaxPower).toBe(11);
      expect(result.actualMaxPower).toBe(11);
      expect(result.concurrencyFactor).toBe(100);
      expect(result.averageChargingDuration).toBe(49.09);
    });
  });

  describe('5 Chargepoints', () => {
    it('should return exact values for 5 chargepoints', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 5,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.theoreticalMaxPower).toBe(55);
      expect(result.actualMaxPower).toBe(44);
      expect(result.concurrencyFactor).toBe(80);
      expect(result.dailyEvents).toBe(6);
      expect(result.totalChargingEvents).toBe(2190);
      expect(result.totalEnergyCharged).toBe(19710);
    });
  });

  describe('30 Chargepoints', () => {
    it('should return exact values for 30 chargepoints', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 30,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.theoreticalMaxPower).toBe(330);
      expect(result.actualMaxPower).toBe(264);
      expect(result.concurrencyFactor).toBe(80);
      expect(result.dailyEvents).toBe(35);
      expect(result.weeklyEvents).toBe(245);
      expect(result.monthlyEvents).toBe(1050);
    });
  });

  describe('Low Arrival Multiplier (20%)', () => {
    it('should return exact values with 20% arrival multiplier', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 0.2,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.theoreticalMaxPower).toBe(220);
      expect(result.actualMaxPower).toBe(33);
      expect(result.concurrencyFactor).toBe(15);
      expect(result.totalEnergyCharged).toBe(16425);
      expect(result.dailyEvents).toBe(5);
      expect(result.weeklyEvents).toBe(35);
      expect(result.monthlyEvents).toBe(150);
    });
  });

  describe('High Arrival Multiplier (200%)', () => {
    it('should return exact values with 200% arrival multiplier', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 2.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.theoreticalMaxPower).toBe(220);
      expect(result.actualMaxPower).toBe(220);
      expect(result.concurrencyFactor).toBe(100);
      expect(result.dailyEvents).toBe(39);
      expect(result.totalChargingEvents).toBe(14235);
      expect(result.totalEnergyCharged).toBe(128115);
    });
  });

  describe('Different Charging Power (22kW)', () => {
    it('should return exact values with 22kW charging power', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 10,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 22,
      };

      const result = runMockSimulation(inputs);

      expect(result.theoreticalMaxPower).toBe(220);
      expect(result.actualMaxPower).toBe(176);
      expect(result.concurrencyFactor).toBe(80);
      expect(result.averageChargingDuration).toBe(24.55);
    });
  });

  describe('High Car Consumption (25 kWh)', () => {
    it('should return exact values with 25 kWh consumption', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 25,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.averageChargingDuration).toBe(68.18);
      expect(result.totalEnergyCharged).toBe(104937.5);
    });
  });

  describe('Low Car Consumption (15 kWh)', () => {
    it('should return exact values with 15 kWh consumption', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 15,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.averageChargingDuration).toBe(40.91);
      expect(result.totalEnergyCharged).toBe(62962.5);
    });
  });

  describe('Mathematical Relationships', () => {
    it('should have weeklyEvents = dailyEvents × 7', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.weeklyEvents).toBe(result.dailyEvents * 7);
    });

    it('should have monthlyEvents = dailyEvents × 30', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.monthlyEvents).toBe(result.dailyEvents * 30);
    });

    it('should have totalChargingEvents = dailyEvents × 365', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.totalChargingEvents).toBe(result.dailyEvents * 365);
    });

    it('should have actualMaxPower equal to max of hourly powerDemand', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      const maxFromHourly = Math.max(...result.hourlyData.map(d => d.powerDemand));
      expect(result.actualMaxPower).toBe(maxFromHourly);
    });

    it('should have concurrencyFactor = (actualMaxPower / theoreticalMaxPower) × 100', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      const expectedConcurrency = Math.round(
        (result.actualMaxPower / result.theoreticalMaxPower) * 100 * 100
      ) / 100;
      expect(result.concurrencyFactor).toBe(expectedConcurrency);
    });

    it('should have theoreticalMaxPower = chargePointsCount × chargingPower', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.theoreticalMaxPower).toBe(inputs.chargePointsCount * inputs.chargingPower);
    });
  });

  describe('Data Consistency', () => {
    it('should have all hourly data with valid hour indices (0-23)', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      result.hourlyData.forEach((data, index) => {
        expect(data.hour).toBe(index);
        expect(data.hour).toBeGreaterThanOrEqual(0);
        expect(data.hour).toBeLessThan(24);
      });
    });

    it('should have activeChargePoints not exceed total chargepoints', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      result.hourlyData.forEach((data) => {
        expect(data.activeChargePoints).toBeLessThanOrEqual(inputs.chargePointsCount);
        expect(data.activeChargePoints).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have powerDemand = activeChargePoints × chargingPower', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      result.hourlyData.forEach((data) => {
        const expectedPower = Math.round(data.activeChargePoints * inputs.chargingPower * 100) / 100;
        expect(data.powerDemand).toBe(expectedPower);
      });
    });

    it('should have all numeric values non-negative', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      expect(result.totalEnergyCharged).toBeGreaterThanOrEqual(0);
      expect(result.theoreticalMaxPower).toBeGreaterThan(0);
      expect(result.actualMaxPower).toBeGreaterThanOrEqual(0);
      expect(result.concurrencyFactor).toBeGreaterThanOrEqual(0);
      expect(result.concurrencyFactor).toBeLessThanOrEqual(100);
      expect(result.totalChargingEvents).toBeGreaterThanOrEqual(0);
      expect(result.averageChargingDuration).toBeGreaterThanOrEqual(0);
      expect(result.dailyEvents).toBeGreaterThanOrEqual(0);
      expect(result.weeklyEvents).toBeGreaterThanOrEqual(0);
      expect(result.monthlyEvents).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Usage Pattern Verification', () => {
    it('should respect the HOURLY_USAGE_PATTERN for active chargepoints', () => {
      const inputs: SimulationInputs = {
        chargePointsCount: 20,
        arrivalMultiplier: 1.0,
        carConsumption: 18,
        chargingPower: 11,
      };

      const result = runMockSimulation(inputs);

      result.hourlyData.forEach((data, hour) => {
        const expectedActive = Math.min(
          Math.round(inputs.chargePointsCount * HOURLY_USAGE_PATTERN[hour] * inputs.arrivalMultiplier),
          inputs.chargePointsCount
        );
        expect(data.activeChargePoints).toBe(expectedActive);
      });
    });
  });
});
