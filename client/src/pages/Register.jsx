import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!fullName || !email || !phone || !password) {
      toast.error('Please fill all the fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        fullName,
        email,
        phone,
        password,
        role,
      });

      toast.success('Registered successfully!');

      // Redirect based on role
      if (role === 'user') {
        navigate('/browse');
      } else if (role === 'owner') {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token);

      const { data } = await axios.post(`${API_BASE_URL}/api/auth/google-login`, {
        email: decoded.email,
        name: decoded.name,
      });

      login({ ...data.user, token: data.token });
      toast.success('Google login successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Google login failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#fce7f3] via-[#bfdbfe] to-[#a7f3d0] dark:from-[#1a1a1a] dark:to-[#2a2a2a] transition duration-500 px-4 py-10">
      <header className="mb-8">
        <img src="/rentallogo.png" alt="Logo" className="h-40 dark:invert transition-all duration-300" />
      </header>

      <div className="flex mb-4 space-x-2 bg-white dark:bg-[#2d2d2d] rounded-lg overflow-hidden shadow-md">
        <Link to="/login" className="px-6 py-2 font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">Login</Link>
        <button className="px-6 py-2 font-medium bg-[#f2f4f8] dark:bg-[#444] text-black dark:text-white">Sign Up</button>
      </div>

      <div className="w-full max-w-sm bg-white dark:bg-[#2d2d2d] rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Create Account</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">Register to get started</p>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />

        <div className="mb-3 text-sm">
          <label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <input type="radio" name="role" value="user" checked={role === 'user'} onChange={() => setRole('user')} />
            User
          </label>
          <label className="flex items-center gap-1 text-gray-700 dark:text-gray-300 ml-4">
            <input type="radio" name="role" value="owner" checked={role === 'owner'} onChange={() => setRole('owner')} />
            Owner
          </label>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-2 rounded-md font-medium transition mb-3 ${
            loading ? 'bg-gray-600' : 'bg-black hover:opacity-90'
          } text-white`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400">Login</Link>
        </p>
      </div>

      <div className="mt-6 w-full max-w-sm text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Or continue with</p>
        <div className="flex gap-4 justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error('Google Login Failed')}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
