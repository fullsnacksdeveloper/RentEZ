import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  SlidersHorizontal, 
  Home, 
  Bed, 
  Bath, 
  Car, 
  Wifi, 
  Dog, 
  X,
  ChevronDown,
  Grid,
  List,
  Map,
  Star,
  DollarSign,
  Calendar
} from 'lucide-react';
import './PropertySearch.css';

const PropertySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [availableFrom, setAvailableFrom] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, map
  const [sortBy, setSortBy] = useState('relevance');
  const [savedSearches, setSavedSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const propertyTypes = ['Apartment', 'House', 'Condo', 'Townhouse', 'Studio'];
  const bedroomOptions = ['Studio', '1', '2', '3', '4', '5+'];
  const bathroomOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '4+'];
  const availableAmenities = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'pets', label: 'Pet Friendly', icon: Dog },
    { id: 'gym', label: 'Gym', icon: Home },
    { id: 'pool', label: 'Pool', icon: Home },
    { id: 'laundry', label: 'Laundry', icon: Home }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const handleAmenityToggle = (amenityId) => {
    setAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSearch = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const searchParams = {
      query: searchQuery,
      location,
      priceRange,
      propertyType,
      bedrooms,
      bathrooms,
      amenities,
      availableFrom,
      sortBy
    };
    
    console.log('Search params:', searchParams);
    // In real implementation, make API call with searchParams
    
    setIsLoading(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setPriceRange([0, 5000]);
    setPropertyType('');
    setBedrooms('');
    setBathrooms('');
    setAmenities([]);
    setAvailableFrom('');
    setSortBy('relevance');
  };

  const saveSearch = () => {
    const searchConfig = {
      id: Date.now(),
      name: searchQuery || `${location} search`,
      query: searchQuery,
      location,
      priceRange,
      propertyType,
      bedrooms,
      bathrooms,
      amenities,
      availableFrom,
      createdAt: new Date().toISOString()
    };
    
    setSavedSearches(prev => [...prev, searchConfig]);
  };

  const loadSavedSearch = (search) => {
    setSearchQuery(search.query);
    setLocation(search.location);
    setPriceRange(search.priceRange);
    setPropertyType(search.propertyType);
    setBedrooms(search.bedrooms);
    setBathrooms(search.bathrooms);
    setAmenities(search.amenities);
    setAvailableFrom(search.availableFrom);
  };

  useEffect(() => {
    // Auto-search when filters change (debounced)
    const timeoutId = setTimeout(() => {
      if (searchQuery || location) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, location, priceRange, propertyType, bedrooms, bathrooms, amenities, sortBy]);

  return (
    <div className="bg-white">
      {/* Main Search Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Find Your Perfect Rental
          </h1>
          
          {/* Primary Search */}
          <div className="bg-white rounded-2xl shadow-xl p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Natural Language Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Try 'three-bedroom apartment near parks with pet-friendly policies'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Location */}
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Search Button */}
              <div>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filter Toggle and View Controls */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              onClick={saveSearch}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              Save Search
            </button>
            
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
          
          {/* View Mode and Sort */}
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
              >
                <Map className="h-4 w-4" />
              </button>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  {bedroomOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  {bathroomOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Available From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available From
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {availableAmenities.map(amenity => (
                  <button
                    key={amenity.id}
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={`flex items-center px-3 py-2 rounded-lg border transition-colors duration-200 ${
                      amenities.includes(amenity.id)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <amenity.icon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Saved Searches</h3>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map(search => (
                <button
                  key={search.id}
                  onClick={() => loadSavedSearch(search)}
                  className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <Star className="h-4 w-4 mr-1" />
                  {search.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Placeholder */}
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Ready to Search
          </h3>
          <p className="text-gray-500">
            Use the search bar above to find your perfect rental property
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertySearch;