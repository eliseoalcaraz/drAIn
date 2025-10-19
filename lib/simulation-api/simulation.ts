// swmmApi.ts

// Type definitions for the API
export interface NodeData {
  inv_elev: number;
  init_depth: number;
  ponding_area: number;
  surcharge_depth: number;
}

export interface LinkData {
  init_flow: number;
  upstrm_offset_depth: number;
  downstrm_offset_depth: number;
  avg_conduit_loss: number;
}

export interface RainfallData {
  total_precip: number;
  duration_hr: number;
}

export interface SimulationRequest {
  nodes: Record<string, NodeData>;
  links: Record<string, LinkData>;
  rainfall: RainfallData;
}

export interface SimulationResponse {
  [key: string]: any; // Adjust based on your actual response structure
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_RAILWAY_URL;

/**
 * Run SWMM simulation with provided network and rainfall data
 * @param nodes - Dictionary of node IDs and their properties
 * @param links - Dictionary of link IDs and their properties
 * @param rainfall - Rainfall data (total precipitation and duration)
 * @returns Simulation results including flooding summary
 */
export async function runSimulation(
  nodes: Record<string, NodeData>,
  links: Record<string, LinkData>,
  rainfall: RainfallData
): Promise<SimulationResponse> {
  try {
    // Ensure proper URL construction (remove trailing slash from base URL if present)
    const baseUrl = API_BASE_URL?.replace(/\/$/, '') || '';
    const response = await fetch(`${baseUrl}/run-simulation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodes,
        links,
        rainfall,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error running simulation:', error);
    throw error;
  }
}
