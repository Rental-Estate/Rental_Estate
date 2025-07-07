import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({ listings: 0, bookings: 0, messages: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [listingsRes, bookingsRes, messagesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/properties/owner/count`, { headers }),
          axios.get(`${API_BASE_URL}/api/bookings/owner/count`, { headers }),
          axios.get(`${API_BASE_URL}/api/messages/owner/count`, { headers })
        ]);

        setStats({
          listings: listingsRes.data.count,
          bookings: bookingsRes.data.count,
          messages: messagesRes.data.count
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error.response?.data?.message || error.message);
      }
    }

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'My Listings', count: stats.listings },
          { label: 'Booking Requests', count: stats.bookings },
          { label: 'Messages', count: stats.messages }
        ].map(({ label, count }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center"
          >
            <div className="text-3xl font-bold">{count}</div>
            <div className="text-gray-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;