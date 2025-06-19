import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  //Grid,
  //List,
 // Map,
  Star,
 // DollarSign,
 // Calendar
} from 'lucide-react';
import './PropertySearch.css';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../Home/hero/Hero.css'; // if not already imported

const API_BASE_URL = 'http://localhost:5000/api';

const PropertySearch = () => {
  const locationObj = useLocation();
  const queryParams = new URLSearchParams(locationObj.search);

  // ✅ Now define all state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState(queryParams.get('city') || '');
  const [priceRange, setPriceRange] = useState(() => {
    const min = queryParams.get('minRent');
    const max = queryParams.get('maxRent');
    return min && max ? [Number(min), Number(max)] : [0, 5000];
  });
  const [rental_type, setRental_type] = useState(queryParams.get('rental_type') || '');
  const [bedrooms, setBedrooms] = useState(queryParams.get('bedrooms') || '');
  const [bathrooms, setBathrooms] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [availableFrom, setAvailableFrom] = useState('');
  const [showFilters, setShowFilters] = useState(false);
 // const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [savedSearches, setSavedSearches] = useState([]);
 const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);


  //const rental_types = ['Apartment', 'House', 'Condo', 'Townhouse', 'Studio'];
  //const bedroomOptions = ['Studio', '1', '2', '3', '4', '5+'];
  //const bathroomOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '4+'];
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  /*const handleSearch = async () => {
    setIsLoading(true);
    const searchParams = {
      query: searchQuery,
      location,
      priceRange,
      rental_type,
      bedrooms,
      bathrooms,
      amenities,
      availableFrom,
      sortBy
    };
    const res = await fetch(`${API_BASE_URL}/listing/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchParams)
    });
    const data = await res.json();
    setSearchResults(data);
    setIsLoading(false);
  };*/

  const handleSearch = async () => {
  setIsLoading(true);

  

  const queryParams = new URLSearchParams({
    city,
    parish: '', // optional
    rental_type,
    bedrooms,
    bathrooms,
    minRent: priceRange[0],
    maxRent: priceRange[1],
    pet_policy: '', // optional
    square_footage: '', // optional
  }).toString();

  console.log("🔍 Searching with filters:", {
  city,
  rental_type,
  bedrooms,
  bathrooms,
  priceRange
});

try {
   const res = await fetch(`${API_BASE_URL}/listing/search?${queryParams}`);
  const data = await res.json();

  console.log("✅ Search API response:", data); // <--- ADD THIs
   setSearchResults(data);
} catch (error) {
  console.error("❌ Search error:", error);
}finally {
    setIsLoading(false);
  }
 
}


  const clearFilters = () => {
    setSearchQuery('');
    setCity('');
    setPriceRange([0, 5000]);
    setRental_type('');
    setBedrooms('');
    setBathrooms('');
    setAmenities([]);
    setAvailableFrom('');
    setSortBy('relevance');
  };

  const saveSearch = () => {
    const searchConfig = {
      id: Date.now(),
      name: searchQuery || `${city} search`,
      query: searchQuery,
      city,
      priceRange,
      rental_type,
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
    setCity(search.city);
    setPriceRange(search.priceRange);
    setRental_type(search.rental_type);
    setBedrooms(search.bedrooms);
    setBathrooms(search.bathrooms);
    setAmenities(search.amenities);
    setAvailableFrom(search.availableFrom);
  };

  /*useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery || city) {
        handleSearch();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, city, priceRange, rental_type, bedrooms, bathrooms, amenities, sortBy]);*/

  useEffect(() => {
  handleSearch(); // run once on mount with URL-based filters
}, []);


  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between mb-6">
          {/*<div className="flex items-center space-x-4">
           {/*} <button onClick={() => setShowFilters(!showFilters)} className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
              <SlidersHorizontal className="h-5 w-5 mr-2" /> Filters
              <ChevronDown className={`h-4 w-4 ml-2 ${showFilters ? 'rotate-180' : ''}`} />
            </button> */}
            {/*<button onClick={saveSearch} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Save Search</button>
            <button onClick={clearFilters} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Clear All</button>
          </div>*/}
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/*<select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg">
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>*/}
          </div>
        </div>

        <form className="hero-search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        

          <div className="search-grid">
            <div className="search-box">
              <div className="input-content">
                <span className="input-label">city</span>
                <input type="text" placeholder="Enter Location" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            </div>
            <div className="search-box">
              <div className="input-content">
                <span className="input-label">Property Type</span>
                <select value={rental_type} onChange={(e) => setRental_type(e.target.value)}>
                  <option value='all'>All Types</option>
                  <option value='house'>House</option>
                  <option value='apartment'>Apartment</option>
                  <option value='condo'>Condo</option>
                  <option value='townhouse'>Townhouse</option>
                </select>
              </div>
            </div>
            <div className="search-box">
              <div className="input-content">
                <span className="input-label">Price Range</span>
                <select value={`${priceRange[0]}-${priceRange[1]}`} onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  setPriceRange([min, max]);
                }}>
                  <option value='any'>Any Price</option>
                  <option value='0-1000'>$0 - $1,000</option>
                  <option value='1000-2000'>$1,000 - $2,000</option>
                  <option value='2000-3300'>$2,000 - $3,000</option>
                  <option value='3000-5000'>$3,000+</option>
                </select>
              </div>
            </div>
            <div className="search-box">
              <div className="input-content">
                <span className="input-label">Bedrooms</span>
                <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                  <option value='any'>Any</option>
                  <option value='1'>1 Bedroom</option>
                  <option value='2'>2 Bedrooms</option>
                  <option value='3'>3 Bedrooms</option>
                  <option value='4+'>4+ Bedrooms</option>
                </select>
              </div>
            </div>
            <button type='submit' className='search-btn'>
              <Search className='search-icon' />
              <span>Search Properties</span>

            </button>
            
          </div>
        </form>

        {savedSearches.length > 0 && (
          <div className="mb-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Saved Searches</h3>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map(search => (
                <button key={search.id} onClick={() => loadSavedSearch(search)} className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                  <Star className="h-4 w-4 mr-1" /> {search.name}
                </button>
              ))}
            </div>
          </div>
        )}

      <div className="text-center py-12">
  {searchResults.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {searchResults.map((property) => (
      <Link to={`/property/${property.property_id}`} key={property.property_id}>
        <div key={property.property_id} className="property-card max-w-xs bg-white shadow-md rounded overflow-hidden">
          <div className="property-image">
           <img 
            src={
              property.images && property.images.length > 0 
                ? `http://localhost:5000${property.images[0].file_path}` 
                : 'https://via.placeholder.com/400x300'
            }
            alt="Property"
            className="w-full h-full object-cover"
/>

            <div className="flex items-center justify-between px-3 py-2  text-sm text-gray-700 font-medium">
              <span>${property.monthly_rent?.toLocaleString() || 'N/A'}</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span>{property.city}</span>
              </div>
            </div>

          </div>
          <div className="property-info">
            <div className="property-details">
              <span>{property.bedrooms} beds</span>
              <span>{property.bathrooms} baths</span>
              <span>{property.square_footage} sqft</span>
            </div>
            

            <div className="property-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="star filled" />
                ))}
              </div>
              <span className="rating-text"> No rating (0 reviews)</span>
            </div>
          </div>
        </div>
         </Link>
      ))}
    
    </div>
   
  ) : (
    <>
      <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
      <p className="text-gray-500">Use the search bar above to find your perfect rental property</p>
    </>
  )}
</div>

      </div>
    </div>
  );
};

export default PropertySearch;
