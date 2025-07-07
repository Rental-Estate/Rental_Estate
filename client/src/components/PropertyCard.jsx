
import { Link } from 'react-router-dom';

const PropertyCard = ({ image, title, price, location, type, id }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition hover:shadow-lg">
      <img src={image} alt={title} className="h-48 w-full object-cover" />
      <div className="p-4">
        <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{type}</span>
        <h3 className="text-lg font-bold mt-2 text-gray-800 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{location}</p>
        <p className="text-xl font-semibold text-green-500 mt-2">₹{price} <span className="text-sm text-gray-500">/month</span></p>
        
        {/* ✅ Dynamic link using the id */}
        <Link to={`/property/${id}`}>
          <button className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-xl transition hover:scale-105">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;