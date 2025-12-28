# EV Charging Simulator

A web application to simulate and analyze electric vehicle charging patterns, power demand, and energy consumption.

## Features

- **Simulation Parameters**: Configure number of charge points, arrival probability multiplier, car consumption, and charging power
- **Visual Results**: Interactive charts showing hourly power demand and active charge points
- **Key Metrics**: Total energy charged, concurrency factor, peak power demand, and charging event statistics
- **History**: Save and load previous simulations from the database

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **State Management**: TanStack React Query
- **Database**: Supabase
- **Simulation**: Mock simulation with realistic probability distributions

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

Create a Supabase project at [supabase.com](https://supabase.com) and run the following SQL to create the required table:

```sql
-- Create simulations table
create table simulations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  inputs jsonb not null,
  outputs jsonb not null
);

-- Create index for faster queries
create index simulations_created_at_idx on simulations(created_at desc);
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Set Parameters** (left panel):
   - Number of charge points (1-100)
   - Arrival probability multiplier (20-200%)
   - Car consumption (kWh per 100km)
   - Charging power per chargepoint (kW)

2. **Run Simulation**: Click the "Run Simulation" button

3. **View Results** (right panel):
   - Key metrics including total energy, concurrency factor, and peak power
   - Hourly power demand chart for a typical day
   - Active charge points distribution
   - Charging events breakdown (daily/weekly/monthly)

4. **Load Previous Simulations**: Use the dropdown to load and view past simulation results

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page entry point
│   ├── scene.tsx           # Main scene with business logic
│   ├── providers.tsx       # React Query provider setup
│   └── globals.css         # Global styles
├── components/
│   ├── SimulationForm.tsx  # Input parameters form
│   └── SimulationResults.tsx # Results visualization
├── hooks/
│   └── useSimulation.ts    # React Query hooks for API
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── supabase.ts         # Supabase client setup
│   ├── api.ts              # API functions
│   └── mockSimulation.ts   # Mock simulation logic
└── README.md
```

## Simulation Logic

The simulation uses probability distributions from real-world data:

- **Arrival Probabilities**: Hourly probabilities (peak during business hours)
- **Charging Demands**: Distribution of charging needs from 0-300km range
- **Time Resolution**: 15-minute intervals over a full year (35,040 ticks)

The mock simulation generates realistic outputs including:
- Total energy consumption
- Peak power demand vs. theoretical maximum
- Concurrency factor (actual/theoretical utilization)
- Charging event statistics

## Building for Production

```bash
npm run build
npm start
```

## Notes

- The simulation is mocked for demonstration purposes
- All inputs are validated and stored in the database
- Results are automatically saved when running a new simulation
- The UI is responsive and works on different screen sizes

