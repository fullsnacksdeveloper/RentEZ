// components/dashboard/LandlordDashboard.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Building, 
  Users, 
  DollarSign, 
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // ✅ import here


const LandlordDashboard = () => {
  const dispatch = useDispatch();

  
  //const { user, properties, applications, earnings } = useSelector(state => state.user);

  const { user } = useAuth();
  // ✅ TEMP fallback data to prevent crash
  //const properties = [];
  const applications = [];
  const earnings = { monthly: 0 };

  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState([]);

  useEffect(() => {
  const fetchListings = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/listing/landlord/${user?.id}`);
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      console.error("Error fetching landlord listings:", err);
    }
  };

  if (user?.id) {
    fetchListings();
  }
}, [user]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'properties', label: 'Properties', icon: Building },
    { id: 'applications', label: 'Applications', icon: Users },
    { id: 'earnings', label: 'Earnings', icon: DollarSign }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Properties</p>
            <p className="text-2xl font-bold text-blue-600">
              {properties?.length || 0}
            </p>
          </div>
          <Building className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Listings</p>
            <p className="text-2xl font-bold text-green-600">
              {properties?.filter(p => p.status === 'active').length || 0}
            </p>
          </div>
          <Eye className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending Applications</p>
            <p className="text-2xl font-bold text-yellow-600">
              {applications?.filter(app => app.status === 'pending').length || 0}
            </p>
          </div>
          <Users className="w-8 h-8 text-yellow-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
            <p className="text-2xl font-bold text-purple-600">
              ${earnings?.monthly || 0}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-purple-500" />
        </div>
      </div>
    </div>
  );

  const renderProperties = () => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold">My Properties</h3>
        <Link
          to="/properties"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        > 
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Link>

      </div>
      <div className="divide-y divide-gray-200">
        {properties?.map(property => (
          <div key={property.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                      <div className="flex items-center">
                    <img 
                      src={property.images?.[0]?.file_path || 'https://via.placeholder.com/150'} 
                      alt="property"
                      className="w-32 h-24 object-cover rounded mr-4"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{property.address_line}</h4>
                      <p className="text-sm text-gray-600">{property.city}, {property.parish}</p>
                      <p className="text-sm font-medium text-green-600 mt-1">
                        ${property.monthly_rent?.toLocaleString()}
                      </p>
                    </div>
                  </div>


                <p className="text-sm text-gray-600">{property.address}</p>
                <p className="text-sm font-medium text-green-600 mt-1">
                  ${property.rent}/month
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  property.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : property.status === 'rented'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {property.status}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
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
            Landlord Dashboard
          </h1>
          <p className="text-gray-600">Manage your properties and tenant applications</p>
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
          {activeTab === 'properties' && renderProperties()}
          {/* Other tab content would be implemented */}
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;