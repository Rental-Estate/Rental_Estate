import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';
const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/bookings/owner/bookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setBookings(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`${API_BASE_URL}/api/bookings/${id}`, { status }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Booking Requests</h1>
      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{b.propertyId.title}</h2>
              <p>{b.type} for {b.date} at {b.time}</p>
              <p>By {b.userId.name}</p>
            </div>
            <div className="flex gap-2">
              {b.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(b._id, 'accepted')} className="bg-green-500 text-white px-3 py-1 rounded">Accept</button>
                  <button onClick={() => updateStatus(b._id, 'declined')} className="bg-red-500 text-white px-3 py-1 rounded">Decline</button>
                </>
              )}
              {b.status !== 'pending' && <span className="capitalize font-bold">{b.status}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerBookings;