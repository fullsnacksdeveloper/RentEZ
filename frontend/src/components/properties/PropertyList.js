import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PropertyList = () => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: 'Modern Apartment in Downtown',
      location: 'Kingston, Jamaica',
      price: '$1,200/month',
      image: '/assets/property1.jpg'
    },
    {
      id: 2,
      title: 'Cozy Studio near UWI',
      location: 'St. Andrew, Jamaica',
      price: '$750/month',
      image: '/assets/property2.jpg'
    },
    {
      id: 3,
      title: 'Spacious 3-Bedroom House',
      location: 'Montego Bay, Jamaica',
      price: '$2,000/month',
      image: '/assets/property3.jpg'
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Properties</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <img
              src={property.image}
              alt={property.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">{property.title}</h2>
              <p className="text-gray-600">{property.location}</p>
              <p className="text-blue-600 font-bold mt-2">{property.price}</p>
              <Link
                to={`/properties/${property.id}`}
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
