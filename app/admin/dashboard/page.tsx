export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Admin Dashboard</h1>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Welcome to the TriGo Admin dashboard!</h2>
          <p className="text-gray-300 mb-6">
            From here you can manage all aspects of the TriGo platform, including users, operations, and system settings.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="font-medium text-cyan-300 mb-2">User Management</h3>
              <p className="text-sm text-gray-300">Manage passengers, triders, and dispatchers</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="font-medium text-cyan-300 mb-2">System Statistics</h3>
              <p className="text-sm text-gray-300">View platform-wide performance metrics</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="font-medium text-cyan-300 mb-2">Configuration</h3>
              <p className="text-sm text-gray-300">Adjust system parameters and settings</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="font-medium text-cyan-300 mb-2">Financial Reports</h3>
              <p className="text-sm text-gray-300">Access transaction data and revenue metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}