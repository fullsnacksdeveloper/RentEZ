import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropertyDetails from '../../components/properties/PropertyDetails'; // adjust if needed

const PropertyDetailsWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);

  /*useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/listing/${id}`);
        const data = await res.json();
        console.log('Fetched property data:', data); // 👈 Add this line

        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
      }
    };

    fetchProperty();
  }, [id]);  */

  useEffect(() => {
  const fetchProperty = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/listing/${id}`);
      const data = await res.json();

      console.log("raw data fetched ",data)
      // Normalize field names
      const normalized = {
        id: data.property_id,
        price: parseFloat(data.monthly_rent),
        sqft: parseInt(data.square_footage),
        title: data.rental_type,
        description: data.description,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        type: data.rental_type,
        address: `${data.address_line}, ${data.city}, ${data.parish}`,
        lotSize: data.lot_size ?? "N/A",
        features: data.amenities || [],
        images: (data.images || []).map(img => img.file_path),
        agent: null, // You can replace this with real data later
        landlord_id: data.landlord_id
      };

      console.log("Normalized property:", normalized);
      setProperty(normalized);
    } catch (err) {
      console.error("Error fetching property:", err);
    }
  };

  fetchProperty();
}, [id]);



  console.log("Fetched property data:", property); // this should show landlord_id
  if (!property) return <div>Loading...</div>;


  return <PropertyDetails property={property} onBack={() => navigate(-1)} />;
};

export default PropertyDetailsWrapper;
