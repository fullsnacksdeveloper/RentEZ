// components/dashboard/TenantDashboard.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Calendar, 
  DollarSign,
  Bell,
  User,
  Search
} from 'lucide-react';
import { fetchUserApplications, fetchUserMessages } from '../../store/slices/userSlice';

const TenantDashboard = () => {
  const dispatch = useDispatch();
  const { user, applications, messages } = useSelector(state => state.user);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchUserApplications());
    dispatch(fetchUserMessages());
  }, [dispatch]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Applications</p>
            <p className="text-2xl font-bold text-blue-600">
              {applications?.filter(app => app.status === 'pending').length || 0}
            </p>
          </div>
          <FileText className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Unread Messages</p>
            <p className="text-2xl font-bold text-green-600">
              {messages?.filter(msg => !msg.read).length || 0}
            </p>
          </div>
          <MessageSquare className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Upcoming Viewings</p>
            <p className="text-2xl font-bold text-purple-600">2</p>
          </div>
          <Calendar className="w-8 h-8 text-purple-500" />
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold">My Applications</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {applications?.map(application => (
          <div key={application.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {application.property.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {application.property.address}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Applied: {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  application.status === 'approved' 
                    ? 'bg-green-100 text-green-800'
                    : application.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">Manage your rental applications and communications</p>
        </div>

        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'applications' && renderApplications()}
          {/* Other tab content would be implemented similarly */}
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
