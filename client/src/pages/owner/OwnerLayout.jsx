import { Link, Outlet } from 'react-router-dom';
import { FaHome, FaBuilding, FaCalendarAlt, FaEnvelope, FaUser } from 'react-icons/fa';

const OwnerLayout = () => (
  <div className="flex min-h-screen bg-gradient-to-br from-[#fce7f3] via-[#bfdbfe] to-[#a7f3d0] dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white">
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 border-r">
      <nav className="space-y-4">
        <Link to="/owner" className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"> <FaHome /> Dashboard </Link>
        <Link to="/owner/listings" className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"> <FaBuilding /> Listings </Link>
        <Link to="/owner/bookings" className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"> <FaCalendarAlt /> Bookings </Link>
        <Link to="/chat" className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"> <FaEnvelope /> Messages </Link>
        <Link to="/owner/profile" className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"> <FaUser /> Profile </Link>
      </nav>
    </aside>
    <main className="flex-1 p-6"> <Outlet /> </main>
  </div>
);

export default OwnerLayout;

