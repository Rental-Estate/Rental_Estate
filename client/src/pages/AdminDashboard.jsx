
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaUserCheck, FaUserClock, FaUserTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [note, setNote] = useState('');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchOwners = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/api/auth/pending-owners`, {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { search, status: statusFilter, page, limit },
      });
      setOwners(data.owners);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (err) {
      toast.error('Failed to fetch owners');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/auth/owner-stats`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStats(data);
    } catch (err) {
      console.error('Stats fetch error');
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/auth/approve-owner/${id}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success('Owner approved');
      fetchOwners();
      fetchStats();
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/auth/reject-owner/${id}`, { reason: note }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success('Owner rejected');
      setNote('');
      fetchOwners();
      fetchStats();
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Phone'],
      ...owners.map((o) => [o.fullName, o.email, o.phone])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'owners.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchOwners();
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [user?.token, search, statusFilter, page]);

  const statBoxStyles = [
    'bg-gradient-to-br from-indigo-500 to-purple-500',
    'bg-gradient-to-br from-yellow-400 to-yellow-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-red-400 to-red-600',
  ];

  const statIcons = [
    <FaUsers className="text-white text-2xl" />,
    <FaUserClock className="text-white text-2xl" />,
    <FaUserCheck className="text-white text-2xl" />,
    <FaUserTimes className="text-white text-2xl" />
  ];

  const statLabels = ['Total', 'Pending', 'Approved', 'Rejected'];
  const statValues = [stats.total, stats.pending, stats.approved, stats.rejected];

  return (
    <motion.div className="p-8 min-h-screen  bg-gradient-to-br from-[#fce7f3] via-[#bfdbfe] to-[#a7f3d0] dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white">
      {/* Header */}
      <motion.div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded shadow mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </motion.div>

      {/* Stat Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statLabels.map((label, idx) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-lg shadow text-white ${statBoxStyles[idx]} flex items-center gap-4`}
          >
            {statIcons[idx]}
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-2xl font-bold">{statValues[idx]}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={() => setPage(1)} className="bg-blue-600 text-white px-4 py-2 rounded">Refresh</button>
        <button onClick={handleExport} className="bg-gray-700 text-white px-4 py-2 rounded">Export CSV</button>
      </div>

      {/* Owner List */}
      {loading ? (
        <p>Loading...</p>
      ) : owners.length === 0 ? (
        <p>No owners found</p>
      ) : (
        <div className="space-y-4">
          {owners.map((owner) => (
            <div key={owner._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <div>
                <h2 className="text-lg font-semibold">{owner.fullName}</h2>
                <p>{owner.email}</p>
                <p>{owner.phone}</p>
                <span className={`inline-block text-xs px-2 py-1 mt-2 rounded font-medium ${owner.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-white' : owner.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-white' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-white'}`}>
                  {owner.status}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="text-blue-600 underline" onClick={() => setSelectedOwner(owner)}>View</button>
                <button onClick={() => handleApprove(owner._id)} className="bg-green-600 text-white px-4 py-1 rounded">Approve</button>
                <button onClick={() => {
                  const reason = prompt('Reason for rejection?');
                  if (reason) {
                    setNote(reason);
                    handleReject(owner._id);
                  }
                }} className="bg-red-600 text-white px-4 py-1 rounded">Reject</button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`px-3 py-1 rounded ${pg === page ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                {pg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Owner Detail Modal */}
      {selectedOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-2">Owner Details</h2>
            <p><strong>Name:</strong> {selectedOwner.fullName}</p>
            <p><strong>Email:</strong> {selectedOwner.email}</p>
            <p><strong>Phone:</strong> {selectedOwner.phone}</p>
            <p><strong>Status:</strong> {selectedOwner.status}</p>
            <p><strong>Registered:</strong> {new Date(selectedOwner.createdAt).toLocaleString()}</p>
            <button onClick={() => setSelectedOwner(null)} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded">Close</button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;