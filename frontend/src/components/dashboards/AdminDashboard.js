import React from 'react';
import { Users, Home, FileText, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { id: 1, title: 'Total Users', count: 240, icon: <Users className="h-6 w-6 text-blue-600" />, path: '/admin/users' },
  { id: 2, title: 'Total Properties', count: 120, icon: <Home className="h-6 w-6 text-green-600" />, path: '/admin/properties' },
  { id: 3, title: 'Applications', count: 85, icon: <FileText className="h-6 w-6 text-yellow-600" />, path: '/admin/applications' },
  { id: 4, title: 'Reports', count: 12, icon: <BarChart2 className="h-6 w-6 text-red-600" />, path: '/admin/reports' },
];

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <Link
            to={item.path}
            key={item.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
            </div>
            {item.icon}
          </Link>
        ))}
      </div>

      {/* Add more detailed sections if needed */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
          <li className="p-4">User JohnDoe created a new property listing</li>
          <li className="p-4">Tenant Jane applied for 2-bedroom apartment</li>
          <li className="p-4">Report submitted: Broken water heater</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
