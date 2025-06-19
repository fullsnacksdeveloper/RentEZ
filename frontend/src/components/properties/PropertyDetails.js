import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
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
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function PropertyDetails({ property, onBack }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });

  const navigate = useNavigate();
  const { user: authUser, token } = useAuth();

  const propertyData = property || {};

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async () => {
    if (!authUser || !authUser.user_id) return alert("Please log in.");
    if (!contactForm.message.trim()) return alert("Enter a message.");

    try {
      const convRes = await fetch('http://localhost:5000/api/messages/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ user1_id: authUser.user_id, user2_id: property.landlord_id })
      });
      const conversation = await convRes.json();

      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          sender_id: authUser.user_id,
          conversation_id: conversation.id,
          text: contactForm.message
        })
      });

      setContactForm({ name: '', email: '', phone: '', message: '' });
      setShowContactForm(false);
      alert("Message sent!");
      navigate("/messages?refresh=true");
    } catch (err) {
      console.error("Error sending message", err);
      alert("Something went wrong.");
    }
  };

  const nextImage = () => setCurrentImageIndex(prev => prev === propertyData.images.length - 1 ? 0 : prev + 1);
  const prevImage = () => setCurrentImageIndex(prev => prev === 0 ? propertyData.images.length - 1 : prev - 1);

  const amenityIcons = {
    "Swimming Pool": <Tv className="w-5 h-5" />, "Garage": <Car className="w-5 h-5" />,
    "WiFi": <Wifi className="w-5 h-5" />, "Coffee Bar": <Coffee className="w-5 h-5" />, "Security": <Shield className="w-5 h-5" />
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft size={20} /> Back to Listings
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsFavorited(!isFavorited)} className={`p-2 rounded-full ${isFavorited ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Left/Main Panel */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <img src={propertyData.images?.[currentImageIndex]} alt={propertyData.title} className="w-full h-full object-cover" />
            {propertyData.images?.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"> <ChevronLeft size={20} /> </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"> <ChevronRight size={20} /> </button>
              </>
            )}
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm"> <Camera size={16} className="inline mr-1" /> {currentImageIndex + 1} / {propertyData.images?.length} </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{propertyData.title}</h1>
            <div className="flex items-center gap-2 text-gray-600 mb-4"> <MapPin size={18} /> <span>{propertyData.address}</span> </div>
            <div className="flex items-center gap-2 mb-6"> <DollarSign size={24} className="text-green-600" /> <span className="text-3xl font-bold text-green-600"> {typeof propertyData.price === 'number' ? propertyData.price.toLocaleString() : 'N/A'} </span> </div>

            <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 rounded-xl p-6 mb-8">
              <div><div className="text-sm text-gray-600">Bedrooms</div><div className="text-2xl font-bold">{propertyData.bedrooms}</div></div>
              <div><div className="text-sm text-gray-600">Bathrooms</div><div className="text-2xl font-bold">{propertyData.bathrooms}</div></div>
              <div><div className="text-sm text-gray-600">Sq Ft</div><div className="text-2xl font-bold">{propertyData.sqft ?? 'N/A'}</div></div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 mb-6">{propertyData.description}</p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.isArray(propertyData.features) && propertyData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 border rounded-lg px-4 py-2 shadow-sm">
                  <div className="text-blue-600">{amenityIcons[feature] || <Shield className="w-5 h-5" />}</div>
                  <span className="text-gray-800 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Landlord</h3>
            {propertyData.agent && (
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                <Star size={14} fill="currentColor" className="text-yellow-500" />
                <span>{propertyData.agent.rating}</span>
                <span>({propertyData.agent.reviews} reviews)</span>
              </div>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex gap-2 items-center"><Phone size={16} className="text-gray-400" /><span>{propertyData.agent?.phone}</span></div>
              <div className="flex gap-2 items-center"><Mail size={16} className="text-gray-400" /><span>{propertyData.agent?.email}</span></div>
            </div>

            <button onClick={() => setShowContactForm(true)} className="w-full bg-blue-600 text-white py-3 mt-5 rounded hover:bg-blue-700 font-semibold">Message Landlord</button>
            <Link to={`/apply/${property.id}`} className="w-full block text-center mt-3 bg-green-600 text-white py-3 rounded hover:bg-green-700 font-semibold">Apply for this Property</Link>

            {showContactForm && (
              <div className="mt-6 border-t pt-4">
                <input name="name" value={contactForm.name} onChange={handleContactFormChange} placeholder="Your Name" className="w-full border rounded p-2 mb-2" />
                <input name="email" value={contactForm.email} onChange={handleContactFormChange} placeholder="Your Email" className="w-full border rounded p-2 mb-2" />
                <input name="phone" value={contactForm.phone} onChange={handleContactFormChange} placeholder="Your Phone" className="w-full border rounded p-2 mb-2" />
                <textarea name="message" value={contactForm.message} onChange={handleContactFormChange} placeholder="Your Message" rows="3" className="w-full border rounded p-2 mb-2"></textarea>
                <button onClick={handleContactSubmit} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold">Send Message</button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Property Type</span><span className="font-medium capitalize">{propertyData.type}</span></div>
              {propertyData.lotSize && (
                <div className="flex justify-between"><span className="text-gray-600">Lot Size</span><span className="font-medium">{propertyData.lotSize}</span></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
