import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaShieldAlt,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";

const cityAreaMap = {
  Chandigarh: ["Sector 17", "Sector 22", "Sector 34", "Manimajra"],
  Kharar: ["Sunny Enclave", "Sector 125", "Gillco Valley", "Balongi"],
};

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
};

const Home = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [properties, setProperties] = useState([]);

  const propertySectionRef = useRef(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/properties", {
          params: { limit: 3 },
        });
        setProperties(res.data);
      } catch (err) {
        console.error("Error fetching featured properties:", err);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/properties/search", {
        params: {
          city: selectedCity,
          area: selectedArea,
          type: propertyType,
        },
      });
      setProperties(res.data);
      propertySectionRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error searching properties:", err);
    }
  };

  return (
<div className="min-h-screen font-sans text-primary bg-gradient-to-br from-[#fce7f3] via-[#bfdbfe] to-[#a7f3d0] dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white">        

      {/* Hero Section */}
      <motion.section
        className="text-center py-20 px-4 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white">
          No Brokers. No Hassle.{" "}
          <span className="text-[#3D52A0] dark:text-yellow-400">Just Homes.</span>

        </motion.h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300 font-medium">
          Connect directly with property owners. Zero Brokerage, Verified Listings & Transparent Communication.
        </p>

        {/* Filters */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow-xl p-6 rounded-xl mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
          whileHover={{ scale: 1.01 }}
        >
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">City/State</label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedArea("");
              }}
              className="h-12 border border-gray-300 dark:border-gray-600 p-2 rounded w-full focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select City/State</option>
              {Object.keys(cityAreaMap).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">Area</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              disabled={!selectedCity}
              className="h-12 border border-gray-300 dark:border-gray-600 p-2 rounded w-full focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Area</option>
              {(cityAreaMap[selectedCity] || []).map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">Move-in From</label>
            <input
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="h-12 border border-gray-300 dark:border-gray-600 px-2 rounded w-full focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="h-12 border border-gray-300 dark:border-gray-600 p-2 rounded w-full focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select type</option>
              <option>PG</option>
              <option>Flats</option>
              <option>1RK</option>
              <option>1BHK</option>
              <option>2BHK</option>
              <option>3BHK</option>
            </select>
          </div>

          <div>
            <motion.button
              onClick={handleSearch}
              className="h-12 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold uppercase w-full py-2 px-4 rounded hover:scale-105 transition"
              whileTap={{ scale: 0.95 }}
            >
              Search
            </motion.button>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div className="mt-6 flex flex-wrap justify-center gap-4" variants={fadeIn}>
        <Link to="/list-property">
  <motion.button
    whileHover={{ scale: 1.05 }}
    className="bg-gradient-to-r from-gradientFrom to-gradientTo text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg"
  >
    List Your Property
  </motion.button>
</Link>
          <Link
            to="/browse"
            className="border border-green-500 text-green-500 px-6 py-2 rounded-md font-semibold hover:bg-green-500 hover:text-white transition"
          >
            Find a Room
          </Link>
          <Link
            to="/login"
            className="border border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-md font-semibold hover:bg-gray-700 hover:text-white transition"
          >
            Login / Register
          </Link>
        </motion.div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        className="text-center py-20 bg-white dark:bg-gray-900"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
          Why Choose <span className="text-[#3D52A0] dark:text-yellow-400">RentalEstate</span>
          ?
        </h2>
        <p className="max-w-2xl mx-auto mb-10 text-lg text-gray-600 dark:text-gray-300">
          We’re revolutionizing the rental market by connecting property owners and tenants directly.
        </p>
        <div className="grid md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
          {[
            {
              icon: <FaShieldAlt className="text-4xl text-[#3B82F6] mx-auto" />,
              title: "Verified Properties",
              desc: "All properties are verified by our team for authenticity.",
            },
            {
              icon: <FaPhoneAlt className="text-4xl text-[#3B82F6] mx-auto" />,
              title: "Direct Contact",
              desc: "Connect directly with property owners without brokers.",
            },
            {
              icon: <FaClock className="text-4xl text-[#3B82F6] mx-auto" />,
              title: "Quick Booking",
              desc: "Fast and hassle-free booking process.",
            },
          ].map(({ icon, title, desc }) => (
            <motion.div
              key={title}
              className="bg-[#F1F5F9] dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              {icon}
              <h3 className="text-xl font-bold mt-2 text-gray-800 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Property Cards */}
      <motion.section
        ref={propertySectionRef}
        className="py-20 px-4 text-center bg-transparent dark:bg-gray-900"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn}
      >
<h2 className="text-3xl md:text-4xl font-bold mb-10">
  {selectedCity || propertyType ? (
    <span className="text-[#3D52A0] dark:text-yellow-400">Search Results</span>
  ) : (
    <span className="text-[#3D52A0] dark:text-yellow-400">Featured Properties</span>
  )}
</h2>


        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {properties.length === 0 ? (
            <p className="col-span-3 text-gray-600 dark:text-gray-300 font-medium">No properties found.</p>
          ) : (
            properties.map((property, idx) => (
              <motion.div
                key={property._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8, ease: "easeOut" }}
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4 text-left">
                  <span className="text-sm bg-[#3B82F6] text-white px-2 py-1 rounded-full">
                    {property.type}
                  </span>
                  <h3 className="text-lg font-bold mt-2 text-gray-800 dark:text-white">{property.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-[#34D399]" /> {property.location || `${property.area}, ${property.city}`}
                                    </p>
                  <p className="mt-2 text-xl font-semibold text-[#10B981]">
                    {property.price} <span className="text-sm">/month</span>
                  </p>
                  <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">⭐ {property.rating}</p>
                  <Link to={`/property/${property._id}`}>
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 0px 12px rgba(59, 130, 246, 0.6)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-xl transition"
                    >
                      View Details
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Centered Button */}
        <div className="mt-10">
          <Link
            to="/browse"
            className="inline-block border border-[#10B981] text-[#10B981] px-6 py-2 rounded font-medium uppercase tracking-wide hover:bg-[#10B981] hover:text-white transition"
          >
            View All Properties
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
