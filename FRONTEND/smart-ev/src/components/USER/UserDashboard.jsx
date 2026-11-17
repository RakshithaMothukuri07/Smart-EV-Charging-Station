// pages/UserDashboard.jsx - FINAL, COMPACT & EV-THEMED
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Zap, 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  BatteryCharging,
  User,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import UserNavbar from "./UserNavbar";


export default function UserDashboard() {
  const [user, setUser] = useState({ username: "Loading..." });
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    totalKwh: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchUserData();
    } else {
      setUser({ username: "Guest" });
      setLoading(false);
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const profileRes = await axios.get(`http://localhost:8080/api/users/profile/${userId}`);
      const userProfile = profileRes.data["User profile"];
      setUser({ username: userProfile?.username || "User" });

      const bookingsRes = await axios.get(`http://localhost:8080/api/users/my-bookings/${userId}`);
      const bookings = bookingsRes.data.bookings || [];

      const today = new Date().toISOString().split("T")[0];
      const upcoming = bookings.filter(b => b.date >= today);

      setStats({
        totalBookings: bookings.length,
        upcomingBookings: upcoming.length,
        totalKwh: bookings.length * 50
      });

      const recent = bookings
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4)
        .map(b => ({
          message: `Booked at ${b.station?.stationName || "Station"}`,
          time: b.date === today ? "Today" : new Date(b.date).toLocaleDateString()
        }));

      setRecentActivity(recent.length > 0 ? recent : [{ message: "No bookings yet", time: "—" }]);

    } catch (err) {
      console.log("Error:", err);
      setUser({ username: "Guest" });
      setRecentActivity([{ message: "Welcome! Book your first slot", time: "Now" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      <UserNavbar />

      {/* Compact Layout */}
      <div className="pl-20 pt-20 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">

          {/* Hero - Smaller & Cleaner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-10 text-white shadow-xl mb-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Welcome back, <span className="text-emerald-100">{loading ? "..." : user.username}</span>
                </h1>
                <p className="text-lg opacity-90 mt-2">Ready to charge today?</p>
              </div>
              <Car className="w-24 h-24 md:w-32 md:h-32 opacity-80" />
            </div>
          </motion.div>

          {/* Compact Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {[
              { label: "Total Bookings", value: stats.totalBookings, icon: Calendar, color: "emerald" },
              { label: "Upcoming", value: stats.upcomingBookings, icon: Clock, color: "teal" },
              { label: "kWh Charged", value: stats.totalKwh, icon: BatteryCharging, color: "cyan" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
                  </div>
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600 font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* EV-Themed Quick Actions */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            {[
              { title: "Find Stations", icon: MapPin, path: "/user/stations", gradient: "from-emerald-500 to-emerald-600" },
              { title: "Book Slot", icon: Zap, path: "/user/book-slot", gradient: "from-teal-500 to-cyan-600" },
              { title: "My Bookings", icon: Calendar, path: "/user/bookings", gradient: "from-blue-500 to-indigo-600" },
              { title: "Profile", icon: User, path: "/user/profile", gradient: "from-purple-500 to-pink-600" },
            ].map((action, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link to={action.path}>
                  <div className={`bg-gradient-to-br ${action.gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all text-center`}>
                    <action.icon className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="font-bold text-lg">{action.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Compact Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">Recent Activity</h2>
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
              </div>
            ) : recentActivity.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((act, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <p className="text-gray-700 flex-1">{act.message}</p>
                    <span className="text-xs text-gray-500">{act.time}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}