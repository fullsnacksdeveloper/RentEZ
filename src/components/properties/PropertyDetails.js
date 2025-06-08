import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Phone,
  Mail,
  Share2,
  Heart,
  Camera,
  ChevronLeft,
  ChevronRight,
  Star,
  Car,
  Wifi,
  Tv,
  Coffee,
  Shield
} from 'lucide-react';

export default function PropertyDetails({ property, onBack }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Sample property data if none provided
  const defaultProperty = {
    id: 1,
    title: "Luxury Modern Villa with Ocean View",
    price: 850000,
    address: "123 Ocean Drive, Miami Beach, FL 33139",
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 2800,
    type: "house",
    yearBuilt: 2019,
    lotSize: "0.25 acres",
    description: "Stunning contemporary villa featuring panoramic ocean views, open-concept living spaces, and premium finishes throughout. This architectural masterpiece combines luxury with comfort, offering an unparalleled coastal living experience.",
    features: [
      "Ocean View",
      "Swimming Pool",
      "Garage",
      "Hardwood Floors",
      "Granite Countertops",
      "Stainless Steel Appliances",
      "Walk-in Closets",
      "Private Balcony"
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ],
    agent: {
      name: "Sarah Johnson",
      phone: "(305) 555-0123",
      email: "sarah.johnson@realty.com",
      rating: 4.9,
      reviews: 127
    },
    neighborhood: {
      schools: "Excellent",
      walkScore: 85,
      crimeRate: "Low",
      publicTransport: "Good"
    }
  };

  const propertyData = property || defaultProperty;

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = () => {
    // Handle contact form submission
    console.log('Contact form submitted:', contactForm);
    setShowContactForm(false);
    setContactForm({ name: '', email: '', phone: '', message: '' });
    alert('Message sent successfully!');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === propertyData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? propertyData.images.length - 1 : prev - 1
    );
  };

  const amenityIcons = {
    "Swimming Pool": <Tv className="w-5 h-5" />,
    "Garage": <Car className="w-5 h-5" />,
    "WiFi": <Wifi className="w-5 h-5" />,
    "Coffee Bar": <Coffee className="w-5 h-5" />,
    "Security": <Shield className="w-5 h-5" />
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Listings
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`p-2 rounded-full transition-colors ${
                isFavorited 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <img
                  src={propertyData.images[currentImageIndex]}
                  alt={propertyData.title}
                  className="w-full h-full object-cover"
                />
                
                {propertyData.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {propertyData.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm font-medium">
                  <Camera size={16} className="inline mr-1" />
                  {currentImageIndex + 1} / {propertyData.images.length}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {propertyData.title}
                </h1>
                
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin size={18} />
                  <span>{propertyData.address}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign size={24} className="text-green-600" />
                  <span className="text-3xl font-bold text-green-600">
                    {propertyData.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                    <Bed size={20} />
                    <span className="font-semibold">Bedrooms</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {propertyData.bedrooms}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                    <Bath size={20} />
                    <span className="font-semibold">Bathrooms</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {propertyData.bathrooms}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                    <Square size={20} />
                    <span className="font-semibold">Sq Ft</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {propertyData.sqft.toLocaleString()}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                    <Calendar size={20} />
                    <span className="font-semibold">Year Built</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {propertyData.yearBuilt}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {propertyData.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {propertyData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      {amenityIcons[feature] || <Shield size={16} className="text-blue-600" />}
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Neighborhood Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Neighborhood</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">Schools</div>
                    <div className="text-sm text-gray-600">{propertyData.neighborhood.schools}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">Walk Score</div>
                    <div className="text-sm text-gray-600">{propertyData.neighborhood.walkScore}/100</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">Crime Rate</div>
                    <div className="text-sm text-gray-600">{propertyData.neighborhood.crimeRate}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">Transit</div>
                    <div className="text-sm text-gray-600">{propertyData.neighborhood.publicTransport}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
              
              <div className="mb-4">
                <div className="font-semibold text-gray-900">{propertyData.agent.name}</div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star size={14} fill="currentColor" className="text-yellow-500" />
                  <span>{propertyData.agent.rating}</span>
                  <span>({propertyData.agent.reviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-700">{propertyData.agent.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-700">{propertyData.agent.email}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Send Message
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  Schedule Tour
                </button>
              </div>

              {/* Contact Form */}
              {showContactForm && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactFormChange}
                      placeholder="Your Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactFormChange}
                      placeholder="Your Email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactFormChange}
                      placeholder="Your Phone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactFormChange}
                      placeholder="Your Message"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleContactSubmit}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium capitalize">{propertyData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lot Size</span>
                  <span className="font-medium">{propertyData.lotSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built</span>
                  <span className="font-medium">{propertyData.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Sq Ft</span>
                  <span className="font-medium">
                    ${Math.round(propertyData.price / propertyData.sqft).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}