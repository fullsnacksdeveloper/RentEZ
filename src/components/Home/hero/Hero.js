import React, { useState } from 'react';
import { Search, MapPin, Home, DollarSign, Bed, Filter, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../hero/Hero.css';

const Hero = () => {
  const [activeTab, setActiveTab] = useState('Browse Properties');
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
    bedrooms: ''
  });
  
  const navigate = useNavigate();

  // Recent listings data
  const propertyImages = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
  ];

  const recentListings = [
    { price: '$2,400', beds: 3, baths: 2, sqft: '1,200', image: propertyImages[0], location: 'Kingston' },
    { price: '$1,800', beds: 2, baths: 1, sqft: '900', image: propertyImages[1], location: 'Spanish Town' },
    { price: '$3,200', beds: 4, baths: 3, sqft: '1,800', image: propertyImages[2], location: 'Montego Bay' }
  ];

  const handleInputChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search page with filters as query parameters
    const searchParams = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  const tabs = [
    { name: 'Browse Properties', path: '/properties' },
    { name: 'List Property', path: '/landlord/create-listing' },
    { name: 'Find Locations', path: '/search' }
  ];

  return (
    <>
      <section className='hero'>
        <div className='hero-overlay'></div>
        <div className='container'>
          <header 
            title='Find rental housing that suits you'
            subtitle='Your very own perfect rentals - discover properties in your local area.'
          />
          
          {/* Search Tabs */}
          <div className='search-tabs-container'>
            <div className='search-tabs'>
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`search-tab ${activeTab === tab.name ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab.name);
                    if (tab.name !== 'Browse Properties') {
                      navigate(tab.path);
                    }
                  }}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Search Form */}
          <form className='hero-search-form' onSubmit={handleSearch}>
            <div className='search-grid'>
              <div className='search-box'>
                <div className='input-icon'>
                  <MapPin className='icon' />
                </div>
                <div className='input-content'>
                  <span className='input-label'>Location</span>
                  <input 
                    type='text' 
                    placeholder='Find your Location'
                    value={searchFilters.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </div>

              <div className='search-box'>
                <div className='input-icon'>
                  <Home className='icon' />
                </div>
                <div className='input-content'>
                  <span className='input-label'>Property Type</span>
                  <select 
                    value={searchFilters.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  >
                    <option value=''>All Types</option>
                    <option value='house'>House</option>
                    <option value='apartment'>Apartment</option>
                    <option value='condo'>Condo</option>
                    <option value='townhouse'>Townhouse</option>
                  </select>
                </div>
              </div>

              <div className='search-box'>
                <div className='input-icon'>
                  <DollarSign className='icon' />
                </div>
                <div className='input-content'>
                  <span className='input-label'>Price Range</span>
                  <select 
                    value={searchFilters.priceRange}
                    onChange={(e) => handleInputChange('priceRange', e.target.value)}
                  >
                    <option value=''>Any Price</option>
                    <option value='0-1000'>$0 - $1,000</option>
                    <option value='1000-2000'>$1,000 - $2,000</option>
                    <option value='2000-3000'>$2,000 - $3,000</option>
                    <option value='3000+'>$3,000+</option>
                  </select>
                </div>
              </div>

              <div className='search-box'>
                <div className='input-icon'>
                  <Bed className='icon' />
                </div>
                <div className='input-content'>
                  <span className='input-label'>Bedrooms</span>
                  <select 
                    value={searchFilters.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  >
                    <option value=''>Any</option>
                    <option value='1'>1 Bedroom</option>
                    <option value='2'>2 Bedrooms</option>
                    <option value='3'>3 Bedrooms</option>
                    <option value='4+'>4+ Bedrooms</option>
                  </select>
                </div>
              </div>

              <div className='search-box advance-filter'>
                <div className='input-icon'>
                  <Filter className='icon' />
                </div>
                <div className='input-content'>
                  <h4>Advanced Filters</h4>
                  <span className='filter-subtitle'>More options</span>
                </div>
              </div>

              <button type='submit' className='search-btn'>
                <Search className='search-icon' />
                <span>Search Properties</span>
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className='hero-stats'>
            <div className='stat-item'>
              <h3>500+</h3>
              <p>Properties Listed</p>
            </div>
            <div className='stat-item'>
              <h3>1,200+</h3>
              <p>Happy Tenants</p>
            </div>
            <div className='stat-item'>
              <h3>300+</h3>
              <p>Trusted Landlords</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Listings Section */}
      <section className="recent-listings">
        <div className="container">
          <div className="listings-header">
            <h2 className="listings-title">Recent Listings</h2>
            <button className="see-all-btn" onClick={() => navigate('/properties')}>
              See All listings
            </button>
          </div>

          <div className="property-grid">
            {recentListings.map((property, index) => (
              <div key={index} className="property-card">
                <div className="property-image">
                  <img src={property.image} alt="Property" />
                  <div className="property-price">{property.price}</div>
                </div>
                <div className="property-info">
                  <div className="property-details">
                    <span>{property.beds} beds</span>
                    <span>{property.baths} baths</span>
                    <span>{property.sqft} sqft</span>
                  </div>
                  <div className="property-location">
                    <MapPin className="location-icon" />
                    <span>{property.location}</span>
                  </div>
                  <div className="property-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="star filled" />
                      ))}
                    </div>
                    <span className="rating-text">4.8 (120 reviews)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;