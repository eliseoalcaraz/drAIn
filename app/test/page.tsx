// app/test-simulation/page.tsx or pages/test-simulation.tsx

'use client'; // If using App Router

import { useState } from 'react';
import { runSimulation, type SimulationResponse } from '@/lib/simulation-api/simulation';

export default function TestSimulation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Sample data
    const nodes = {
      'I-0': { inv_elev: 0, init_depth: 0, ponding_area: 0, surcharge_depth: 0 },
      'I-1': { inv_elev: 16, init_depth: 2, ponding_area: 1, surcharge_depth: 0 },
      'I-2': { inv_elev: 30, init_depth: 0, ponding_area: 0, surcharge_depth: 0 },
      'I-4': { inv_elev: 30, init_depth: 0, ponding_area: 0, surcharge_depth: 2 },
    };

    const links = {
      'C-37': { init_flow: 0.5, upstrm_offset_depth: 5, downstrm_offset_depth: 5, avg_conduit_loss: 0 },
      'C-2': { init_flow: 0, upstrm_offset_depth: 10, downstrm_offset_depth: 2, avg_conduit_loss: 0.5 },
      'C-112': { init_flow: 1.5, upstrm_offset_depth: 0, downstrm_offset_depth: 0, avg_conduit_loss: 100 },
    };

    const rainfall = {
      total_precip: 140,
      duration_hr: 1,
    };

    try {
      const data = await runSimulation(nodes, links, rainfall);
      setResult(data);
      console.log('✅ Simulation successful:', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('❌ Simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">SWMM API Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={handleTest}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Running Simulation...' : 'Run Test Simulation'}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-blue-700">Running simulation...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-700 mb-2">❌ Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Success State */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">✅ Simulation Complete</h2>
            <div className="bg-white rounded p-4 overflow-auto max-h-96">
              <pre className="text-sm text-gray-800">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="font-semibold mb-2">📝 What this test does:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Sends sample nodes, links, and rainfall data to your Railway API</li>
            <li>Displays the flooding summary results</li>
            <li>Shows any errors that occur</li>
          </ul>
          
          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="text-sm text-gray-600">
              <strong>API Endpoint:</strong> https://web-production-2976d.up.railway.app/run-simulation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}