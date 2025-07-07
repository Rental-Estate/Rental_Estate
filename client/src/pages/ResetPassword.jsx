import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        password,
      });
      toast.success("Password reset! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error("Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <button
          onClick={handleReset}
          className="w-full bg-black text-white py-2 rounded-md font-medium hover:opacity-90 transition"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
