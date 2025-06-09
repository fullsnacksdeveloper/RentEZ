import React, { useState, useEffect } from 'react';
import { Home, MapPin, DollarSign, Bed, Bath, Square, Plus, Trash2, Edit, Eye, Star, Calendar, Upload, X } from 'lucide-react';
import './ManageListing.css'

// API Service
const API_BASE_URL = 'http://localhost:3000/api';

const propertyAPI = {
  // Listings endpoints
  createListing: async (data) => {
    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  getListingsByLandlord: async (landlordId) => {
    const response = await fetch(`${API_BASE_URL}/listings/landlord/${landlordId}`);
    return response.json();
  },
  
  getPublicListing: async (propertyId) => {
    const response = await fetch(`${API_BASE_URL}/listings/public/${propertyId}`);
    return response.json();
  },
  
  editListing: async (propertyId, data) => {
    const response = await fetch(`${API_BASE_URL}/listings/${propertyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  deleteListing: async (propertyId) => {
    const response = await fetch(`${API_BASE_URL}/listings/${propertyId}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  
  searchListings: async (searchParams) => {
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await fetch(`${API_BASE_URL}/listings/search?${queryString}`);
    return response.json();
  },
  
  // Reviews endpoints
  createReview: async (propertyId, reviewData) => {
    const response = await fetch(`${API_BASE_URL}/listings/${propertyId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    return response.json();
  },
  
  getReviews: async (propertyId) => {
    const response = await fetch(`${API_BASE_URL}/listings/${propertyId}/reviews`);
    return response.json();
  },
  
  // Image endpoints
  uploadImages: async (propertyId, files) => {
    const formData = new FormData();
    for (let file of files) {
      formData.append('images', file);
    }
    const response = await fetch(`${API_BASE_URL}/listings/${propertyId}/images`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },
  
  getImages: async (propertyId) => {
    const response = await fetch(`${API_BASE_URL}/listings/${propertyId}/images`);
    return response.json();
  },
  
  deleteImage: async (propertyId, imageId) => {
    const response = await fetch(`${API_BASE_URL}/listings/${propertyId}/images/${imageId}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  
  // Calendar endpoints
  createCalendarEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/calendar/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    return response.json();
  }
};

// Main Property Management System Component
export default function PropertyManagementSystem() {
  const [currentView, setCurrentView] = useState('list');
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [landlordId] = useState(1); // This would come from authentication in real app

  // Fetch listings on component mount
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await propertyAPI.getListingsByLandlord(landlordId);
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
        setListings(listings.filter(listing => listing.property_id !== propertyId));
      } catch (err) {
        setError('Failed to delete listing');
      }
    }
  };

  // Create Listing Form Component
  const CreateListingForm = () => {
    const [formData, setFormData] = useState({
      landlord_id: landlordId,
      address_line: '',
      city: '',
      parish: '',
      rental_price: '',
      bedrooms: '',
      bathrooms: '',
      square_footage: '',
      property_type: 'apartment',
      description: '',
      amenities: [],
      lease_terms: '',
      availability_date: '',
      pet_policy: 'no_pets'
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const newListing = await propertyAPI.createListing(formData);
        setListings([...listings, newListing]);
        setCurrentView('list');
        setFormData({
          landlord_id: landlordId,
          address_line: '',
          city: '',
          parish: '',
          rental_price: '',
          bedrooms: '',
          bathrooms: '',
          square_footage: '',
          property_type: 'apartment',
          description: '',
          amenities: [],
          lease_terms: '',
          availability_date: '',
          pet_policy: 'no_pets'
        });
      } catch (err) {
        setError('Failed to create listing');
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAmenityToggle = (amenity) => {
      setFormData(prev => ({
        ...prev,
        amenities: prev.amenities.includes(amenity)
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      }));
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Listing</h2>
            <button
              onClick={() => setCurrentView('list')}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line
                </label>
                <input
                  type="text"
                  name="address_line"
                  value={formData.address_line}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parish
                </label>
                <select
                  name="parish"
                  value={formData.parish}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Parish</option>
                  <option value="Kingston">Kingston</option>
                  <option value="St. Andrew">St. Andrew</option>
                  <option value="St. Thomas">St. Thomas</option>
                  <option value="Portland">Portland</option>
                  <option value="St. Mary">St. Mary</option>
                  <option value="St. Ann">St. Ann</option>
                  <option value="Trelawny">Trelawny</option>
                  <option value="St. James">St. James</option>
                  <option value="Hanover">Hanover</option>
                  <option value="Westmoreland">Westmoreland</option>
                  <option value="St. Elizabeth">St. Elizabeth</option>
                  <option value="Manchester">Manchester</option>
                  <option value="Clarendon">Clarendon</option>
                  <option value="St. Catherine">St. Catherine</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rental Price (JMD)
                </label>
                <input
                  type="number"
                  name="rental_price"
                  value={formData.rental_price}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Footage
                </label>
                <input
                  type="number"
                  name="square_footage"
                  value={formData.square_footage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="condo">Condo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['WiFi', 'Parking', 'Pool', 'Gym', 'Laundry', 'AC', 'Security', 'Garden'].map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="mr-2"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Date
                </label>
                <input
                  type="date"
                  name="availability_date"
                  value={formData.availability_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Policy
                </label>
                <select
                  name="pet_policy"
                  value={formData.pet_policy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="no_pets">No Pets</option>
                  <option value="cats_only">Cats Only</option>
                  <option value="dogs_only">Dogs Only</option>
                  <option value="pets_allowed">Pets Allowed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setCurrentView('list')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Property List Component
  const PropertyList = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Property Listings</h1>
          <button
            onClick={() => setCurrentView('create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Listing</span>
          </button>
        </div>

        {loading && <div className="text-center py-8">Loading...</div>}
        {error && <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.property_id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Home className="w-16 h-16 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {listing.property_type.charAt(0).toUpperCase() + listing.property_type.slice(1)} in {listing.city}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{listing.address_line}, {listing.city}, {listing.parish}</span>
                </div>
                <div className="flex items-center text-green-600 font-bold mb-4">
                  <DollarSign className="w-4 h-4" />
                  <span>JMD {listing.rental_price?.toLocaleString()}/month</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span>{listing.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    <span>{listing.bathrooms} bath</span>
                  </div>
                  {listing.square_footage && (
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      <span>{listing.square_footage} sqft</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between space-x-2">
                  <button
                    onClick={() => {
                      setSelectedListing(listing);
                      setCurrentView('detail');
                    }}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedListing(listing);
                      setCurrentView('edit');
                    }}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteListing(listing.property_id)}
                    className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {listings.length === 0 && !loading && (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No listings yet</h3>
            <p className="text-gray-500 mb-4">Create your first property listing to get started</p>
            <button
              onClick={() => setCurrentView('create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Create First Listing
            </button>
          </div>
        )}
      </div>
    );
  };

  // Property Detail Component
  const PropertyDetail = () => {
    const [reviews, setReviews] = useState([]);
    const [images, setImages] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

    useEffect(() => {
      if (selectedListing) {
        fetchReviews();
        fetchImages();
      }
    }, [selectedListing]);

    const fetchReviews = async () => {
      try {
        const data = await propertyAPI.getReviews(selectedListing.property_id);
        setReviews(data);
      } catch (err) {
        console.error('Failed to fetch reviews');
      }
    };

    const fetchImages = async () => {
      try {
        const data = await propertyAPI.getImages(selectedListing.property_id);
        setImages(data);
      } catch (err) {
        console.error('Failed to fetch images');
      }
    };

    const handleReviewSubmit = async (e) => {
      e.preventDefault();
      try {
        await propertyAPI.createReview(selectedListing.property_id, reviewData);
        setShowReviewForm(false);
        setReviewData({ rating: 5, comment: '' });
        fetchReviews();
      } catch (err) {
        setError('Failed to submit review');
      }
    };

    if (!selectedListing) return null;

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => setCurrentView('list')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Listings
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            <Home className="w-24 h-24 text-gray-400" />
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedListing.property_type.charAt(0).toUpperCase() + selectedListing.property_type.slice(1)} in {selectedListing.city}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{selectedListing.address_line}, {selectedListing.city}, {selectedListing.parish}</span>
              </div>
              <div className="flex items-center text-green-600 font-bold text-2xl mb-4">
                <DollarSign className="w-6 h-6" />
                <span>JMD {selectedListing.rental_price?.toLocaleString()}/month</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-2" />
                    <span>{selectedListing.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-2" />
                    <span>{selectedListing.bathrooms} Bathrooms</span>
                  </div>
                  {selectedListing.square_footage && (
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-2" />
                      <span>{selectedListing.square_footage} sq ft</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedListing.description || 'No description available.'}
                </p>
              </div>
            </div>

            {selectedListing.amenities && selectedListing.amenities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedListing.amenities.map((amenity, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Review
                </button>
              </div>

              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                      value={reviewData.rating}
                      onChange={(e) => setReviewData({...reviewData, rating: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No reviews yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return <CreateListingForm />;
      case 'detail':
        return <PropertyDetail />;
      case 'edit':
        // You can implement edit form similar to create form
        return <div>Edit form (to be implemented)</div>;
      default:
        return <PropertyList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderCurrentView()}
    </div>
  );
}