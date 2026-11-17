// LoginPage.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Mail, 
  Lock, 
  Zap, 
  ArrowLeft, 
  User, 
  Shield, 
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let response;

      if (isAdmin) {
        // ADMIN: Send as JSON body
        response = await axios.post(
          "http://localhost:8080/api/admin/login",
          formData,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.message?.includes("successful") || response.data.msg) {
          setSuccess("Admin Login Successful!");
          localStorage.setItem("adminLoggedIn", "true");
          setTimeout(() => navigate("/admin/dashboard"), 1500);
        }
      } else {
        // USER: Send as QUERY PARAMETERS (your backend requirement)
        response = await axios.post(
          "http://localhost:8080/api/users/login",
          null, // no body
          {
            params: {
              email: formData.email,
              password: formData.password
            }
          }
        );

        if (response.data.msg?.includes("successfully")) {
          const userId = response.data.UserId;
          localStorage.setItem("userLoggedIn", "true");
          localStorage.setItem("userId", userId || "1");
          setSuccess("Welcome back!");
          setTimeout(() => navigate("/user/dashboard"), 1500);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.Error || 
                  err.response?.data?.message || 
                  "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // You can add a new password field later
      const newPassword = prompt("Enter new password:");
      if (!newPassword || newPassword.length < 6) {
        setError("Password must be 6+ characters");
        setLoading(false);
        return;
      }

      await axios.put("http://localhost:8080/api/users/forgot-password", null, {
        params: { email: formData.email, password: newPassword }
      });

      setSuccess("Password updated successfully! You can now login.");
      setShowForgot(false);
    } catch (err) {
      setError("Email not found or update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-blue-50 flex items-center justify-center px-4 py-12 font-['Poppins']">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 p-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Zap className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="text-gray-600 mt-1">Sign in to your account</p>
          </div>

          {/* Role Toggle */}
          <div className="flex items-center justify-center mb-8 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => { setIsAdmin(false); setShowForgot(false); setError(""); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium ${
                !isAdmin 
                  ? "bg-white text-emerald-600 shadow-md" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <User className="w-5 h-5" />
              User
            </button>
            <button
              onClick={() => { setIsAdmin(true); setShowForgot(false); setError(""); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium ${
                isAdmin 
                  ? "bg-white text-blue-600 shadow-md" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Shield className="w-5 h-5" />
              Admin
            </button>
          </div>

          {/* Messages */}
          {success && (
            <motion.div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Forgot Password - Only for User */}
            {!isAdmin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgot(!showForgot)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  {isAdmin ? "Login as Admin" : "Login as User"}
                </>
              )}
            </motion.button>
          </form>

          {/* Forgot Password Form */}
          {showForgot && !isAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p className="text-sm text-gray-700 mb-3">Reset your password</p>
              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all"
                >
                  {loading ? "Sending..." : "Reset Password"}
                </button>
              </form>
            </motion.div>
          )}

          {/* Register Link */}
          <p className="text-center mt-8 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}