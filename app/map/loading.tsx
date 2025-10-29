export default function MapLoading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-blue-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-gray-700">Loading Map...</p>
        <p className="text-sm text-gray-500">Initializing 3D terrain and drainage data</p>
      </div>
    </div>
  );
}
