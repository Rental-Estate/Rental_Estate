
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '../components/PropertyCard';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { FaList, FaTh, FaMapMarkedAlt, FaSearch } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const cityAreaMap = {
  Chandigarh: ['Sector 17', 'Sector 22', 'Sector 34', 'Manimajra'],
  Kharar: ['Sunny Enclave', 'Sector 125', 'Gillco Valley', 'Balongi'],
};

const Browse = () => {
  const [filters, setFilters] = useState({});
  const [properties, setProperties] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [loading, setLoading] = useState(true);

  const handleCheckboxChange = (category, option) => {
    setFilters((prev) => {
      const current = prev[category] || [];
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [category]: updated };
    });
  };

  const clearAllFilters = () => setFilters({});

  const filterSection = (title, options, category) => (
    <div className="mb-4 border-b pb-2">
      <details className="group">
        <summary className="text-sm font-semibold text-gray-800 dark:text-white cursor-pointer flex items-center justify-between">
          {title}
          <span className="group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="flex flex-col gap-1 mt-2">
          {options.map((option) => (
            <label key={option} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters[category]?.includes(option) || false}
                onChange={() => handleCheckboxChange(category, option)}
                className="accent-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
            </label>
          ))}
        </div>
      </details>
    </div>
  );

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/properties`);
        let results = res.data || [];

        if (filters.city) results = results.filter(p => filters.city.includes(p.city));
        if (filters.area) results = results.filter(p => filters.area.includes(p.area));
        if (filters.type) results = results.filter(p => filters.type.includes(p.type));
        if (searchQuery) results = results.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
        if (budgetRange === 'lt10k') results = results.filter(p => p.price < 10000);
        if (budgetRange === '10k-20k') results = results.filter(p => p.price >= 10000 && p.price <= 20000);
        if (budgetRange === 'gt20k') results = results.filter(p => p.price > 20000);

        if (sortOption === 'low') results.sort((a, b) => a.price - b.price);
        if (sortOption === 'high') results.sort((a, b) => b.price - a.price);
        if (sortOption === 'newest') results = results.reverse();

        setProperties(results);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [filters, sortOption, searchQuery, budgetRange]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#fce7f3] via-[#bfdbfe] to-[#a7f3d0] dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar Filters */}
      <aside className="sticky top-0 w-full max-w-[280px] p-4 overflow-y-auto h-screen border-r bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Filters</h2>
          <button onClick={clearAllFilters} className="text-sm text-blue-600 underline">Clear All</button>
        </div>

        {filterSection('City', Object.keys(cityAreaMap), 'city')}
        {filterSection('Locality/Area', Object.values(cityAreaMap).flat(), 'area')}
        {filterSection('Landmark', ['Near College', 'Near Metro', 'Near Park'], 'landmark')}
        {filterSection('Property Type', ['PG', 'Flats', '1RK', '1BHK', '2BHK', '3BHK'], 'type')}
        {filterSection('Tenant Type', ['Family', 'Bachelors', 'Working Professionals', 'Students', 'Couple Friendly'], 'tenant')}
        {filterSection('Gender', ['Male', 'Female', 'Any'], 'gender')}
        {filterSection('BHK', ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'], 'bhk')}
        {filterSection('Furnishing', ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'], 'furnishing')}
        {filterSection('Amenities', ['Wi-Fi', 'Power Backup', 'Lift', 'Washing Machine', 'Fridge'], 'amenities')}
        {filterSection('Community Amenities', ['Gym', 'Parking', 'Security'], 'community')}
        {filterSection('Availability', ['Immediate', 'Within 1 month'], 'availability')}
        {filterSection('Agreement', ['With Agreement', 'No Agreement','E-Agreement Available','Police Verification Done','KYC Verified Landlord'], 'agreement')}
        {filterSection('Payment', ['Rent Negotiable','Rent Payable via UPI/Credit Card','Zero Brokerage','Zero Deposit', 'EMI Available'], 'payment')}
        {filterSection('Restrictions', ['No Smoking', 'No Alcohol'], 'restrictions')}
        {filterSection('View/Facing', ['Park Facing', 'East Facing'], 'facing')}
        {filterSection('Tags', ['Verified Property', 'Verified Landlord', 'Premium Listing'], 'tags')}
        {filterSection('Internet', ['High-Speed Wi-Fi', 'Jio Signal', 'Airtel Signal'], 'internet')}
        {filterSection('Bathroom/Kitchen', ['Attached Bathroom', 'Modular Kitchen'], 'bath_kitchen')}
        {filterSection('Access', ['24x7 Entry', 'Key Access'], 'access')}
        {filterSection('Nearby Essentials', ['Metro Station', 'Grocery Store', 'Hospital'], 'essentials')}
      </aside>

      {/* Property Listings */}
      <main className="flex-grow p-6">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <button className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-white text-black border dark:bg-gray-700 dark:text-white'}`} onClick={() => setViewMode('list')}>
              <FaList className="inline mr-1" /> List
            </button>
            <button className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-green-500 text-white' : 'bg-white text-black border dark:bg-gray-700 dark:text-white'}`} onClick={() => setViewMode('grid')}>
              <FaTh className="inline mr-1" /> Grid
            </button>
            <button className={`px-4 py-2 rounded ${viewMode === 'map' ? 'bg-green-500 text-white' : 'bg-white text-black border dark:bg-gray-700 dark:text-white'}`} onClick={() => setViewMode('map')}>
              <FaMapMarkedAlt className="inline mr-1" /> Map
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 rounded border text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select onChange={(e) => setBudgetRange(e.target.value)} className="p-2 rounded-md border text-sm dark:bg-gray-700 dark:text-white">
              <option value="">Budget Range</option>
              <option value="lt10k">Below ₹10,000</option>
              <option value="10k-20k">₹10,000 - ₹20,000</option>
              <option value="gt20k">Above ₹20,000</option>
            </select>
            <select onChange={(e) => setSortOption(e.target.value)} className="p-2 rounded-md border text-sm dark:bg-gray-700 dark:text-white">
              <option value="">Sort By</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="newest">Newest Listings</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(filters).flatMap(([cat, vals]) =>
            vals.map((val) => (
              <span
                key={cat + val}
                className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full cursor-pointer"
                onClick={() => handleCheckboxChange(cat, val)}
              >
                {val} ×
              </span>
            ))
          )}
        </div>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        ) : viewMode === 'map' ? (
          <div className="h-[600px]">
            <MapContainer center={[30.7333, 76.7794]} zoom={12} className="h-full w-full rounded shadow">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {properties.map((p) => (
                <Marker key={p._id} position={[30.7333 + Math.random() * 0.02, 76.7794 + Math.random() * 0.02]}>
                  <Popup>
                    <strong>{p.title}</strong><br />₹{p.price} <br />{p.area}, {p.city}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        ) : (
          <motion.div layout className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-6'}>
            <AnimatePresence>
              {properties.map((property) => (
                <motion.div key={property._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PropertyCard
                    image={property.image}
                    title={property.title}
                    price={property.price}
                    location={property.location}
                    type={property.type}
                    rating={property.rating}
                    id={property._id}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Browse;
