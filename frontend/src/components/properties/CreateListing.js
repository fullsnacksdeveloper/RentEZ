import React, { useState } from 'react';
import { Home, MapPin, DollarSign, Bed, Bath, Square, Plus, Trash2 } from 'lucide-react';
import './CreateListing.css';
import { useDispatch } from 'react-redux';
import { createProperty } from '../../store/slices/propertiesSlice'; // adjust the path as needed


export default function PropertyListingCreator() {
  
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    description: '',
    type: 'house',
    features: []
  });
  const [newFeature, setNewFeature] = useState('');

  const dispatch = useDispatch(); // ✅ add this below useState


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

 /* const handleSubmit = () => {
    if (formData.title && formData.price && formData.address) {
      const newListing = {
        ...formData,
        id: Date.now(),
        price: parseFloat(formData.price)
      };
      setListings(prev => [...prev, newListing]);
      setFormData({
        title: '',
        price: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        sqft: '',
        description: '',
        type: 'house',
        features: []
      });
    }
  };*/

  const handleSubmit = async () => {
  if (formData.title && formData.price && formData.address) {
    try {
      await dispatch(createProperty(formData)).unwrap();
      alert('Listing created successfully!');
      setFormData({
        title: '',
        price: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        sqft: '',
        description: '',
        type: 'house',
        features: []
      });
    } catch (err) {
      console.error('❌ Error creating listing:', err);
      alert('Failed to create listing');
    }
  } else {
    alert('Please fill out required fields: title, price, and address.');
  }
};






  const deleteListing = (id) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Home className="text-blue-600" />
            Property Listing Creator
          </h1>
          <p className="text-gray-600">Create and manage your property listings</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Property</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Beautiful 3BR Home in Downtown"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="450000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Main St, City, State 12345"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sq Ft
                  </label>
                  <input
                    type="number"
                    name="sqft"
                    value={formData.sqft}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the property features, location benefits, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a feature (e.g., Pool, Garage, etc.)"
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Create Listing
              </button>
            </div>
          </div>

          {/* Listings Display */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Your Listings ({listings.length})
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {listings.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Home size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No listings yet. Create your first property listing!</p>
                </div>
              ) : (
                listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {listing.title}
                      </h3>
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-green-600 font-bold text-xl mb-2">
                      <DollarSign size={20} />
                      {listing.price.toLocaleString()}
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin size={16} />
                      {listing.address}
                    </div>
                    
                    <div className="flex gap-4 text-sm text-gray-600 mb-2">
                      {listing.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed size={16} />
                          {listing.bedrooms} bed
                        </div>
                      )}
                      {listing.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath size={16} />
                          {listing.bathrooms} bath
                        </div>
                      )}
                      {listing.sqft && (
                        <div className="flex items-center gap-1">
                          <Square size={16} />
                          {listing.sqft} sq ft
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-2 capitalize">
                      {listing.type}
                    </div>
                    
                    {listing.description && (
                      <p className="text-gray-600 text-sm mb-2">
                        {listing.description}
                      </p>
                    )}
                    
                    {listing.features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {listing.features.map((feature, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}