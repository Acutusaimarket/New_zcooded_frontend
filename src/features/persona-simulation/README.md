# Persona Simulation Feature

This feature provides a comprehensive simulation system that allows users to test how different personas interact with products using AI models.

## Features

- **Step-by-step Wizard**: Guided interface for configuring simulations
- **Persona Selection**: Choose multiple personas from the persona library
- **Product Selection**: Select products to simulate interactions with
- **Simulation Configuration**: Choose simulation type (overview/detailed) and AI model
- **Real-time Results**: View detailed simulation results with insights and recommendations

## Components

### Core Components

- **SimulationWizard**: Main wizard component that orchestrates the entire simulation flow
- **PersonaSelectionStep**: Step for selecting personas with search and filtering
- **ProductSelectionStep**: Step for selecting products with detailed information
- **SimulationConfigStep**: Step for configuring simulation type and AI model
- **SimulationResults**: Step for displaying simulation results and insights

### API Integration

- **useRunSimulation**: Hook for running simulations via the FastAPI MCP backend
- **useAvailableModels**: Hook for fetching available AI models

## API Endpoints

The feature integrates with the following FastAPI MCP endpoints:

- `POST /api/v1/simulation/run` - Run simulation
- `GET /api/v1/simulation/models` - Get available AI models
- `GET /api/v1/simulation/history` - Get simulation history
- `GET /api/v1/simulation/{id}` - Get specific simulation

## Simulation Types

### Overview Simulation
- Quick analysis with high-level insights
- Basic interest level assessment
- Purchase intent scoring
- Price perception analysis
- Estimated time: 2-3 minutes

### Detailed Simulation
- Comprehensive behavioral analysis
- Decision timeline prediction
- Motivation drivers analysis
- Individual persona breakdowns
- Estimated time: 5-8 minutes

## AI Models

- **GPT-4o**: Latest GPT-4 model with improved reasoning
- **GPT-5**: Next-generation model with enhanced simulation capabilities

## Usage

1. Navigate to `/dashboard/simulation`
2. Follow the step-by-step wizard:
   - Select personas from the library
   - Choose a product to simulate
   - Configure simulation type and AI model
   - Run the simulation and view results

## Results Structure

The simulation returns detailed insights including:

- Overall interest level and purchase intent
- Price perception analysis
- Key concerns and motivation drivers
- Decision timeline predictions
- Individual persona results
- Best-fit persona recommendations
- Overall recommendations and summary

## Dependencies

- React Query for API state management
- Lucide React for icons
- Shadcn/ui components for UI
- Existing persona and product APIs
