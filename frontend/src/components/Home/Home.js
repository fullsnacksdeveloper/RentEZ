import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../App.css';
import Hero from './hero/Hero';



const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate loading or perform any initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scroll to top when navigating to home
    window.scrollTo(0, 0);
  }, [location]);

  if (isLoading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading RentEZ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <Hero />
      </section>


      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Find Your Perfect Home?</h2>
            <p>Join thousands of satisfied tenants and landlords using RentEZ</p>
            <div className="cta-buttons">
              <button 
                className="cta-btn primary"
                //onClick={() => window.location.href = '/properties'}
                //disabled for now currently takes you to create listing page
              >
                Browse Properties
              </button>
              <button 
                className="cta-btn secondary"
                onClick={() => window.location.href = '/landlord/create-listing'}
              >
                List Your Property
              </button>
            </div>
          </div>
          <div className="cta-stats">
            <div className="cta-stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Active Listings</span>
            </div>
            <div className="cta-stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="cta-stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;