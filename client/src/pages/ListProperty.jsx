import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ListProperty = () => {
  return (
    <div className="min-h-screen font-sans text-primary bg-gradient-to-br from-[#fce7f3] via-[#bfdbfe] to-[#a7f3d0] dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white transition duration-300 px-4 py-10">
      
      {/* Dashboard Button */}
      <div className="flex justify-center mb-8">
        <Link to="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-gradientFrom to-gradientTo text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-lg"
          >
            Go to Dashboard
          </motion.button>
        </Link>
      </div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center mb-10"
      >
        List Your Property
      </motion.h1>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-3xl mx-auto bg-white/70 dark:bg-gray-800 rounded-2xl shadow-xl backdrop-blur-md p-8 space-y-6"
      >
        {/* Field: Title */}
        <div className="relative">
          <input
            type="text"
            id="title"
            placeholder=" "
            className="peer w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <label
            htmlFor="title"
            className="absolute text-sm text-gray-500 dark:text-gray-300 left-4 top-3 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
          >
            Property Title
          </label>
        </div>

        {/* Field: Description */}
        <div className="relative">
          <textarea
            id="description"
            rows="4"
            placeholder=" "
            className="peer w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          ></textarea>
          <label
            htmlFor="description"
            className="absolute text-sm text-gray-500 dark:text-gray-300 left-4 top-3 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
          >
            Description
          </label>
        </div>

        {/* Field: Location */}
        <div className="relative">
          <input
            type="text"
            id="location"
            placeholder=" "
            className="peer w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <label
            htmlFor="location"
            className="absolute text-sm text-gray-500 dark:text-gray-300 left-4 top-3 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
          >
            Location (City, Area)
          </label>
        </div>

        {/* Field: Rent */}
        <div className="relative">
          <input
            type="number"
            id="rent"
            placeholder=" "
            className="peer w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <label
            htmlFor="rent"
            className="absolute text-sm text-gray-500 dark:text-gray-300 left-4 top-3 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
          >
            Rent Price (₹ per month)
          </label>
        </div>

        {/* Field: Upload */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Upload Property Images
          </label>
          <input
            type="file"
            multiple
            className="w-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-700 p-2"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-to-r from-gradientFrom to-gradientTo text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md"
            type="submit"
          >
            Submit Property
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default ListProperty;