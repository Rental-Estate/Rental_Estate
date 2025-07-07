import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings', err);
      }
    };
    if (user?.role === 'admin') fetchBookings();
  }, [user]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="p-2 border">User</th>
            <th className="p-2 border">Property</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Time</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, idx) => (
            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-2 border">{b.userId?.name || b.userId}</td>
              <td className="p-2 border">{b.propertyId?.title || b.propertyId}</td>
              <td className="p-2 border">{b.type}</td>
              <td className="p-2 border">{b.date}</td>
              <td className="p-2 border">{b.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings;
