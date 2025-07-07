import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../utils/api";

const Login = () => {
  const [loginType, setLoginType] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setOtp("");
    setOtpSent(false);
  }, [loginType]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const redirectBasedOnRole = (role) => {
    if (role === "admin") return navigate("/admin-dashboard");
    if (role === "owner") return navigate("/dashboard");
    return navigate("/browse");
  };

  const handleEmailLogin = async () => {
    if (!email || !password) return toast.error("All fields are required!");
    if (!validateEmail(email)) return toast.error("Invalid email format");

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      login({ ...data.user, token: data.token });
      toast.success("Login successful!");
      redirectBasedOnRole(data.user.role);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSend = async () => {
    if (!validateEmail(email)) return toast.error("Enter a valid email");

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/send-otp`, { email });
      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!otp) return toast.error("Enter the OTP sent to your email");

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        otp,
      });

      login({ ...data.user, token: data.token });
      toast.success("OTP Verified! Logged in.");
      redirectBasedOnRole(data.user.role);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    try {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token);

      const { data } = await axios.post(`${API_BASE_URL}/api/auth/google-login`, {
        email: decoded.email,
        name: decoded.name,
      });

      login({ ...data.user, token: data.token });
      toast.success("Google login successful!");
      redirectBasedOnRole(data.user.role);
    } catch (err) {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#fce7f3] via-[#bfdbfe] to-[#a7f3d0] dark:from-[#1a1a1a] dark:to-[#2a2a2a] transition duration-500 px-4 py-10">
      <header className="mb-8">
        <img src="/rentallogo.png" alt="Logo" className="h-40 dark:invert transition-all duration-300" />
      </header>

      <div className="flex mb-4 space-x-2 bg-white dark:bg-[#2d2d2d] rounded-lg overflow-hidden shadow-md">
        <button className="px-6 py-2 font-medium bg-[#f2f4f8] dark:bg-[#444] text-black dark:text-white">
          Login
        </button>
        <Link
          to="/register"
          className="px-6 py-2 font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
        >
          Sign Up
        </Link>
      </div>

      <div className="w-full max-w-sm bg-white dark:bg-[#2d2d2d] rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Welcome Back</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
          Enter your credentials to access your account
        </p>

        <div className="flex items-center space-x-4 mb-4 text-sm">
          <label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              name="loginType"
              value="email"
              checked={loginType === "email"}
              onChange={() => setLoginType("email")}
            />
            Email
          </label>
          <label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              name="loginType"
              value="otp"
              checked={loginType === "otp"}
              onChange={() => setLoginType("otp")}
            />
            OTP
          </label>
        </div>

        {loginType === "email" ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <button
              disabled={loading}
              onClick={handleEmailLogin}
              className="w-full bg-black text-white py-2 rounded-md font-medium hover:opacity-90 transition mb-3"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email for OTP"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            {!otpSent ? (
              <button
                disabled={loading}
                onClick={handleOtpSend}
                className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:opacity-90 transition mb-3"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 mb-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <button
                  disabled={loading}
                  onClick={handleOtpVerify}
                  className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:opacity-90 transition mb-3"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}
          </>
        )}

        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </p>
      </div>

      <div className="mt-6 w-full max-w-sm text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Or continue with</p>
        <div className="flex gap-4 justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google Login Failed")}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;