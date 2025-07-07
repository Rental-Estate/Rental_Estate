import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      toast.success("Reset link sent to email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md font-medium hover:opacity-90 transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
