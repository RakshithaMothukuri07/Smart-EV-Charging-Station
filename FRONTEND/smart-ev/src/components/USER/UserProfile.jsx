// pages/UserProfile.jsx - FINAL & FULLY UNIFIED (Profile + Password in One Form)
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  User, Mail, Phone, Calendar, Lock,
  Save, CheckCircle, AlertCircle, Loader2, Edit3
} from "lucide-react";
import UserNavbar from "./UserNavbar";


export default function UserProfile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    joinedDate: ""
  });
  const [originalUser, setOriginalUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password fields (only shown when editing)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/users/profile/${userId}`);
      const profile = res.data["User profile"];

      const userData = {
        username: profile.username || "User",
        email: profile.email || "",
        phone: profile.phone || "",
        joinedDate: profile.joinedDate || "January 2025"
      };

      setUser(userData);
      setOriginalUser(userData);
    } catch (err) {
      setError("Failed to load profile");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // Validate password if user wants to change it
    if (newPassword || confirmPassword || oldPassword) {
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match");
        setSaving(false);
        return;
      }
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        setSaving(false);
        return;
      }
    }

    try {
      const payload = {
        username: user.username,
        email: user.email,
        phone: user.phone
      };

      // Only send password if user entered it
      if (newPassword) {
        payload.oldPassword = oldPassword;
        payload.newPassword = newPassword;
      }

      await axios.put(`http://localhost:8080/api/users/update-profile/${userId}`, payload, {
        headers: { "Content-Type": "application/json" }
      });

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setOriginalUser(user);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setUser(originalUser);
    setIsEditing(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      <UserNavbar />

      <div className="pl-20 pt-20 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">My Profile</h1>
            <p className="text-lg text-gray-600">Update your personal information and password</p>
          </motion.div>

          {success && (
            <motion.div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700">
              <CheckCircle className="w-7 h-7" />
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-7 h-7" />
              {error}
            </motion.div>
          )}

          {/* Single Unified Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-10 text-white">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-6xl font-black shadow-2xl">
                  {user.username[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-4xl font-black mb-2">{user.username}</h2>
                  <p className="text-xl opacity-90">{user.email}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <Calendar className="w-6 h-6" />
                    <span className="text-lg">Joined {user.joinedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Account Settings</h3>
                {!isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    Edit Profile
                  </motion.button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-8">
                  {/* Personal Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-3">
                        <User className="w-6 h-6 text-emerald-600" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base disabled:opacity-70"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-3">
                        <Mail className="w-6 h-6 text-emerald-600" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base disabled:opacity-70"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-3">
                        <Phone className="w-6 h-6 text-emerald-600" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="+91 9876543210"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base disabled:opacity-70"
                      />
                    </div>
                  </div>

                  {/* Password Section - Only when editing */}
                  {isEditing && (
                    <>
                      <div className="border-t pt-8 mt-8">
                        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <Lock className="w-7 h-7 text-red-600" />
                          Update Password (Optional)
                        </h4>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Current Password</label>
                            <input
                              type="password"
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                              placeholder="Leave blank to keep current"
                            />
                          </div>

                          <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">New Password</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
                              placeholder="Leave blank to keep current"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-base font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
                              placeholder="Re-enter new password"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={saving}
                          className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                          {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                          {saving ? "Saving..." : "Save All Changes"}
                        </motion.button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}