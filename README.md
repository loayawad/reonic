# EV Charging Simulator

A web application to simulate and analyze electric vehicle charging patterns, power demand, and energy consumption.

## Features

- **Simulation Parameters**: Configure number of charge points, arrival probability multiplier, car consumption, and charging power
- **Visual Results**: Interactive charts showing hourly power demand and active charge points
- **Key Metrics**: Total energy charged, concurrency factor, peak power demand, and charging event statistics
- **Simulation Management**: Create, read, update, and delete simulations with full CRUD operations
- **History**: Browse saved simulations in a scrollable list with timestamp and key parameters
- **Edit Mode**: Load previous simulations and update them or save as new variations

## Tech Stack

- **Frontend**: Next.js 16.1.1, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **State Management**: TanStack React Query v5
- **Database**: Supabase (PostgreSQL)
- **Simulation**: Mock simulation with realistic probability distributions

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Setup Instructions

### 1. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
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

Using npm:
```bash
npm run dev
```

Or using yarn:
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### Creating a New Simulation

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

### Managing Saved Simulations

4. **Browse Simulations**: View all saved simulations in the scrollable list showing:
   - Date and time of creation
   - Number of chargepoints and charging power

5. **Load & Edit**: Click on any saved simulation to load it
   - Form switches to "Edit Simulation" mode
   - Modify parameters as needed
   - Click **"Update"** to save changes to the existing simulation
   - Or click **"Save as New"** to create a new simulation with modified parameters

6. **Delete**: Click the trash icon next to any simulation to delete it

7. **Start Fresh**: Click **"+ New"** button to clear the form and create a new simulation

## Project Structure

```
├── src/
│   └── app/
│       ├── layout.tsx          # Root layout with providers
│       ├── page.tsx            # Main page entry point
│       ├── scene.tsx           # Main scene with business logic
│       ├── providers.tsx       # React Query provider setup
│       └── globals.css         # Global styles
├── components/
│   ├── SimulationForm.tsx      # Input parameters form with CRUD operations
│   └── SimulationResults.tsx   # Results visualization with charts
├── hooks/
│   └── useSimulation.ts        # React Query hooks for API (CRUD operations)
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   ├── supabase.ts             # Supabase client setup
│   ├── api.ts                  # API functions (create, read, update, delete)
│   └── mockSimulation.ts       # Mock simulation logic
├── public/                     # Static assets
├── supabase-schema.sql         # Database schema
├── tailwind.config.ts          # Tailwind CSS configuration
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
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

Using npm:
```bash
npm run build
npm start
```

Or using yarn:
```bash
yarn build
yarn start
```

## API Endpoints (via Supabase)

The application implements full CRUD operations:

- **CREATE**: Save new simulation results to database
- **READ**: Fetch all saved simulations, sorted by creation date
- **UPDATE**: Modify existing simulation parameters and results
- **DELETE**: Remove simulations from database

## Notes

- The simulation is mocked for demonstration purposes
- All inputs are validated and stored in the database
- Full CRUD operations available: create, read, update, and delete simulations
- Results are automatically saved when running a new simulation
- The UI is responsive and works on different screen sizes (Thanks to tailwind)
- Uses Next.js 16 with Turbopack for faster development builds

