-- Supabase Database Schema for EV Charging Simulator

-- Create simulations table
create table simulations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  inputs jsonb not null,
  outputs jsonb not null
);

-- Create index for faster queries sorted by creation date
create index simulations_created_at_idx on simulations(created_at desc);

-- Example of inputs jsonb structure:
-- {
--   "chargePointsCount": 20,
--   "arrivalMultiplier": 1.0,
--   "carConsumption": 18,
--   "chargingPower": 11
-- }

-- Example of outputs jsonb structure:
-- {
--   "totalEnergyCharged": 150000.50,
--   "theoreticalMaxPower": 220.0,
--   "actualMaxPower": 95.5,
--   "concurrencyFactor": 43.41,
--   "totalChargingEvents": 5000,
--   "averageChargingDuration": 45.5,
--   "hourlyData": [...],
--   "dailyEvents": 13.7,
--   "weeklyEvents": 95.9,
--   "monthlyEvents": 410.96
-- }

