export default function SimulationLoading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-white">Entering Simulation Mode...</p>
        <p className="text-sm text-gray-400">Loading vulnerability models and analysis tools</p>
      </div>
    </div>
  );
}
