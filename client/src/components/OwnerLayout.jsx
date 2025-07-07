import { Link, Outlet } from 'react-router-dom';
import { FaHome, FaBuilding, FaCalendarAlt, FaEnvelope, FaUser } from 'react-icons/fa';

export default function OwnerLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 p-4 border-r">
        <nav className="space-y-2">
          <Link to="/owner" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaHome /> Dashboard
          </Link>
          <Link to="/owner/listings" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaBuilding /> My Listings
          </Link>
          <Link to="/owner/bookings" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaCalendarAlt /> Booking Requests
          </Link>
          <Link to="/chat" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaEnvelope /> Messages
          </Link>
          <Link to="/owner/profile" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaUser /> Profile
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}