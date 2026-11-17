// pages/AdminManageUsers.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  UserX,
  Loader2
} from "lucide-react";
import AdminNavbar from "./AdminNavbar";

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/admin/users");
      const userList = res.data.users || [];
      setUsers(userList);
      setFilteredUsers(userList);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    const filtered = users.filter(user =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(userId);
    setError("");
    setSuccess("");

    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${userId}`);
      setSuccess("User deleted successfully!");
      fetchUsers(); // Refresh list
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <AdminNavbar />

      <div className="pl-24 pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-5xl font-black text-gray-900 mb-3">Manage Users</h1>
            <p className="text-xl text-gray-600">View and control all registered EV drivers</p>
          </motion.div>

          {/* Stats & Search Bar */}
          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium">Total Registered Users</p>
                  <h2 className="text-5xl font-black text-emerald-600 mt-2">{users.length}</h2>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Users className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8 lg:col-span-2"
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-emerald-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-16 pr-8 py-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-lg"
                />
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center">
                Found {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
              </p>
            </motion.div>
          </div>

          {/* Messages */}
          {success && (
            <motion.div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700">
              <CheckCircle className="w-7 h-7" />
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-7 h-7" />
              {error}
            </motion.div>
          )}

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden"
          >
            <div className="p-8 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-blue-50">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-10 h-10 text-emerald-600" />
                All Registered Users
              </h2>
            </div>

            {loading ? (
              <div className="p-20 text-center">
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto" />
                <p className="text-xl text-gray-600 mt-4">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-20 text-center">
                <UserX className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-6 px-8 font-bold text-gray-700">User</th>
                      <th className="text-left py-6 px-8 font-bold text-gray-700">Contact</th>
                      <th className="text-left py-6 px-8 font-bold text-gray-700">Joined</th>
                      <th className="text-center py-6 px-8 font-bold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, i) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-gray-100 hover:bg-emerald-50/50 transition-all"
                      >
                        <td className="py-6 px-8">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {user.username?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-lg">{user.username || "Unknown"}</p>
                              <p className="text-sm text-gray-600">User ID: {user.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-6 px-8">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-emerald-600" />
                              <span className="text-gray-700">{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-6 px-8">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-5 h-5" />
                            <span>Joined recently</span>
                          </div>
                        </td>

                        <td className="py-6 px-8 text-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deletingId === user.id}
                            className="p-4 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-all group"
                          >
                            {deletingId === user.id ? (
                              <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                            ) : (
                              <Trash2 className="w-6 h-6 text-red-600 group-hover:text-red-700" />
                            )}
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}