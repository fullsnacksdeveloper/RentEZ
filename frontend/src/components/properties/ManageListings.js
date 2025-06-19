// ... (other imports remain the same)

import React, { useState, useEffect } from 'react';
import { Home, MapPin, DollarSign, Bed, Bath, Square, Plus, Trash2, Edit, Eye, Star, Calendar, Upload, X } from 'lucide-react';
import './ManageListing.css';
import { useAuth } from '../../contexts/AuthContext';
import BackButton from '../../components/BackButton'; // adjust path if needed


const API_BASE_URL = 'http://localhost:5000/api';

const propertyAPI = {
  createListing: async (data) => {
    const response = await fetch(`${API_BASE_URL}/listing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  getListingsByLandlord: async (landlordId) => {
    const response = await fetch(`${API_BASE_URL}/listing/landlord/${landlordId}`);
    return response.json();
  },
  deleteListing: async (propertyId) => {
    const response = await fetch(`${API_BASE_URL}/listing/${propertyId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
  uploadImages: async (propertyId, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));
    const response = await fetch(`${API_BASE_URL}/listing/${propertyId}/images`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },
};

export default function PropertyManagementSystem() {
  const [currentView, setCurrentView] = useState('list');
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.user_id) fetchListings();
  }, [user]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await propertyAPI.getListingsByLandlord(user.user_id);
      setListings(data);
    } catch (err) {
      setError('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await propertyAPI.deleteListing(propertyId);
        setListings((prev) => prev.filter((l) => l.property_id !== propertyId));
      } catch (err) {
        setError('Failed to delete listing');
      }
    }
  };

  const handleCreate = () => setCurrentView('create');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <CreateListingForm
            user={user}
            setListings={setListings}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return (
          
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">

              <BackButton label="Back to Dashboard" />
              <h1 className="text-2xl font-bold">My Property Listings</h1>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleCreate}
              >
                <Plus className="inline-block mr-2" /> Add New Listing
              </button>
            </div>
            {loading ? (
              <p>Loading...</p>
         ) : listings.length === 0 ? (
              <div className="text-center">
                <p className="mb-4">No listings yet.</p>
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                >
                  Create First Listing
                </button>
              </div>
            ) : (
              listings.map((listing) => (
                <div key={listing.property_id} className="mb-4 p-4 bg-white rounded shadow">
                  <h2 className="text-lg font-semibold">{listing.address_line}</h2>
                  <p>{listing.city}, {listing.parish}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDeleteListing(listing.property_id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        );
    }
  };

  return <div className="min-h-screen bg-gray-100">{renderCurrentView()}</div>;
}

function CreateListingForm({ user, setListings, setCurrentView }) {
  const [formData, setFormData] = useState({
    address_line: '',
    city: '',
    parish: '',
    monthly_rent: '',
    bedrooms: '',
    bathrooms: '',
    square_footage: '',
    rental_type: 'apartment',
    description: '',
    amenities: [],
    availability_date: new Date().toISOString().split('T')[0],
    pet_policy: 'no_pets',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageRemove = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    document.getElementById('fileInput').value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, landlord_id: user.user_id };
      const newListing = await propertyAPI.createListing(payload);
      if (images.length > 0 && newListing?.property_id) {
        await propertyAPI.uploadImages(newListing.property_id, images);
      }
      setListings((prev) => [...prev, newListing]);
      setCurrentView('list');
    } catch (err) {
      setError('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Create New Listing</h2>
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" class='text-right'>
        <input name="address_line" value={formData.address_line} onChange={handleChange} placeholder="Address Line" className="w-full border p-4 rounded mb-4" required />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full border p-4 rounded mb-4" required />
        <select name="parish" value={formData.parish} onChange={handleChange} className="w-full border p-4 rounded mb-4" required>
          <option value="">Select Parish</option>
          {[ 'Kingston','St. Andrew','St. Thomas','Portland','St. Mary','St. Ann','Trelawny','St. James','Hanover','Westmoreland','St. Elizabeth','Manchester','Clarendon','St. Catherine' ].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input name="monthly_rent" value={formData.monthly_rent} onChange={handleChange} placeholder="Monthly Rent" type="number" className="w-full border p-4 rounded mb-4" required />
        <input name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Bedrooms" type="number" className="w-full border p-4 rounded mb-4" required />
        <input name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="Bathrooms" type="number" className="w-full border p-4 rounded mb-4" required />
        <input name="square_footage" value={formData.square_footage} onChange={handleChange} placeholder="Square Footage" type="number" className="w-full border p-4 rounded mb-4" />
        <input name="availability_date" value={formData.availability_date} onChange={handleChange} type="date" className="w-full border p-4 rounded" />
      </div>

      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />

      <select name="rental_type" value={formData.rental_type} onChange={handleChange} className="w-full border p-4 rounded">
        <option value="apartment">Apartment</option>
        <option value="house">House</option>
        <option value="studio">Studio</option>
        <option value="condo">Condo</option>
      </select>

      <select name="pet_policy" value={formData.pet_policy} onChange={handleChange} className="w-full border p-4 rounded">
        <option value="no_pets">No Pets</option>
        <option value="cats_only">Cats Only</option>
        <option value="dogs_only">Dogs Only</option>
        <option value="pets_allowed">Pets Allowed</option>
      </select>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {["WiFi", "Parking", "Pool", "Gym", "Laundry", "AC", "Security", "Garden"].map((a) => (
            <label key={a} className="">
              <input
                type="checkbox"
                checked={formData.amenities.includes(a)}
                onChange={() => setFormData((prev) => ({
                  ...prev,
                  amenities: prev.amenities.includes(a)
                    ? prev.amenities.filter(x => x !== a)
                    : [...prev.amenities, a],
                }))}
                className="mr-2"
              />
              {a}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Upload Images</label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages([...images, ...Array.from(e.target.files)])}
          className="w-full"
        />
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {images.map((file, i) => (
              <div key={i} className="relative">
                <img src={URL.createObjectURL(file)} alt="preview" className="h-24 w-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleImageRemove(i)}
                  className="absolute top-1 right-1 bg-white rounded-full text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex items-center justify-center shadow"
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => setCurrentView('list')} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
}
