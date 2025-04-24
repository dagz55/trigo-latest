export default function DispatcherDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Dispatcher Dashboard</h1>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Welcome to your TriGo Dispatcher dashboard!</h2>
          <p className="text-gray-300 mb-6">
            From here you can coordinate rides, manage operations, and monitor trider activity.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="font-medium text-cyan-300 mb-2">Active Rides</h3>
              <p className="text-sm text-gray-300">Monitor and manage ongoing rides</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="font-medium text-cyan-300 mb-2">Available Triders</h3>
              <p className="text-sm text-gray-300">View active triders and their locations</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="font-medium text-cyan-300 mb-2">Ride Assignments</h3>
              <p className="text-sm text-gray-300">Manually assign rides to triders</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="font-medium text-cyan-300 mb-2">Service Analytics</h3>
              <p className="text-sm text-gray-300">View service performance metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}