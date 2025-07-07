import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { FaMapMarkerAlt, FaStar, FaPhoneAlt, FaEnvelope, FaHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Modal from 'react-modal';
Modal.setAppElement('#root');

// Fix marker icon display
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [isSaved, setIsSaved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState('visit');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleBooking = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/bookings`, {
        propertyId: property._id,
        type: bookingType,
        date: bookingDate,
        time: bookingTime
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookingSuccess('Booking submitted!');
      setModalOpen(false);
    } catch (err) {
      setBookingSuccess('Booking failed');
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/properties/${id}`);
        if (!res.data || !res.data._id) throw new Error('Property not found');
        setProperty(res.data);
        fetchSimilar(res.data.city, res.data.area);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Property not found or may have been removed.');
      }
    };

    const fetchSimilar = async (city, area) => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/properties`);
        const filtered = res.data.filter(p => p._id !== id && (p.city === city || p.area === area));
        setSimilarProperties(filtered.slice(0, 3));
      } catch (err) {
        console.error('Error fetching similar properties');
      }
    };

    fetchProperty();
  }, [id]);

  const handleSaveClick = () => {
    setIsSaved(!isSaved);
  };

  if (error) return <p className="p-6 text-red-600 dark:text-red-400">{error}</p>;
  if (!property) return <p className="p-6 text-gray-600 dark:text-gray-300">Loading...</p>;

  return (
    <div className="min-h-screen p-4 md:p-10 bg-gradient-to-br from-[#fce7f3] via-[#bfdbfe] to-[#a7f3d0] text-gray-800 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white">

{/* Image Carousel */}
      <Swiper navigation={true} modules={[Navigation]} className="h-72 md:h-[400px] rounded-xl overflow-hidden mb-6">
        {(property.images || [property.image]).map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-1">{property.title}</h1>
            <button onClick={handleSaveClick} className={`text-xl ${isSaved ? 'text-red-500' : 'text-gray-400'} hover:scale-105`} title="Save to wishlist">
              <FaHeart />
            </button>
          </div>
          <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <FaMapMarkerAlt /> {property.area}, {property.city}
          </p>
          <p className="text-lg font-semibold text-green-600 mt-2">₹{property.price.toLocaleString()} <span className="text-sm text-gray-500">/month</span></p>
          <p className="text-sm mt-1 text-yellow-500 flex items-center gap-1">
            <FaStar /> {property.rating} Rating ({property.reviews?.length || 0})
          </p>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-300 dark:border-gray-600 flex gap-6 text-sm font-medium">
            {['description', 'amenities', 'rules', 'location', 'reviews'].map((tab) => (
              <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 capitalize transition duration-300 ${
                activeTab === tab
                  ? 'text-blue-600 font-bold border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-blue-400'
              }`}
            >
              {tab}
            </button>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === 'description' && (
              <div>
                <h3 className="font-semibold mb-2">About This Property</h3>
                <p>{property.description || 'No description available.'}</p>
              </div>
            )}

            {activeTab === 'amenities' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
  {(property.amenities || []).map((a, i) => (
    <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md font-medium dark:bg-blue-900 dark:text-blue-200">
      {a}
    </span>
  ))}
</div>
            )}

            {activeTab === 'rules' && (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
             {(property.rules || []).map((r, i) => (
               <span key={i} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-md font-medium dark:bg-red-900 dark:text-red-200">{r}</span>
             ))}
           </div>
            )}

            {activeTab === 'location' && (
              <div className="mt-4">
              <h4 className="font-semibold mb-2">Property Location</h4>
              <div className="rounded-lg shadow overflow-hidden h-64">
                <MapContainer center={[property.latitude, property.longitude]} zoom={15} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[property.latitude, property.longitude]}>
                    <Popup>{property.title}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {property.reviews?.length ? property.reviews.map((review, idx) => (
                  <div key={idx} className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    <p className="font-semibold">{review.name} <span className="text-yellow-400">★ {review.rating}</span></p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                )) : <p>No reviews yet.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Owner Sidebar */}
        <aside className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 shadow space-y-4">
          <div className="flex items-center gap-3">
            <img src={property.owner?.avatar || 'https://via.placeholder.com/40'} alt="Owner" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-bold">{property.owner?.name || 'Owner'}</p>
              {property.owner?.verified && <span className="text-green-500 text-xs font-semibold">Verified</span>}
              <p className="text-sm text-gray-500">⭐ {property.owner?.responseTime} response time</p>
            </div>
          </div>
          <div className="text-sm space-y-1">
            <p className="flex items-center gap-2"><FaPhoneAlt /> {property.owner?.phone}</p>
            <p className="flex items-center gap-2"><FaEnvelope /> {property.owner?.email}</p>
          </div>

          <Link to={`/chat?ownerId=${property.owner?._id || ''}`} className="block text-center py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Chat with Owner
          </Link>

          <button
  onClick={() => {
    setBookingType('visit');
    setModalOpen(true);
  }}
  className="w-full py-2 border border-black dark:border-white text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-700"
>
  Schedule Visit
</button>

<button
  onClick={() => {
    setBookingType('booking');
    setModalOpen(true);
  }}
  className="w-full py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
>
  Book Now
</button>


          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-bold mb-3">Similar Properties</h3>
              <div className="space-y-4">
                {similarProperties.map((sp) => (
                  <Link to={`/property/${sp._id}`} key={sp._id} className="block bg-white dark:bg-gray-700 p-2 rounded shadow hover:shadow-md">
                    <img src={sp.image} alt={sp.title} className="w-full h-24 object-cover rounded" />
                    <p className="font-semibold text-sm mt-2">{sp.title}</p>
                    <p className="text-xs text-gray-500">₹{sp.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          
        </aside>
      </div>
    

{/* Booking Modal */}
<Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow max-w-md mx-auto mt-32">
<h2 className="text-lg font-bold mb-4 capitalize">Confirm {bookingType}</h2>
<input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="mb-2 p-2 w-full border" />
<input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} className="mb-4 p-2 w-full border" />
<div className="flex justify-end gap-2">
  <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
  <button onClick={handleBooking} className="px-4 py-2 bg-green-600 text-white rounded">Confirm</button>
</div>
</Modal>
</div>
);
};




export default PropertyDetails;