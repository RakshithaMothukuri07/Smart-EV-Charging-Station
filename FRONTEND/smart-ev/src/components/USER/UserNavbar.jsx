// components/UserNavbar.jsx - FINAL & COMPACT (Perfect Size)
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  MapPin, 
  Zap, 
  History, 
  User, 
  LogOut,
  Menu,
  X,
  Car
} from "lucide-react";

const navItems = [
  { path: "/user/dashboard", label: "Dashboard", icon: Home },
  { path: "/user/stations", label: "Find Stations", icon: MapPin },
  { path: "/user/book-slot", label: "Book Slot", icon: Zap },
  { path: "/user/bookings", label: "My Bookings", icon: History },
  { path: "/user/profile", label: "Profile", icon: User },
];

export default function UserNavbar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-50 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-emerald-300 hover:border-emerald-500 transition-all"
      >
        {isOpen ? <X className="w-6 h-6 text-emerald-700" /> : <Menu className="w-6 h-6 text-emerald-700" />}
      </motion.button>

      {/* Sidebar - COMPACT & CLEAN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-screen w-72 bg-white shadow-2xl z-40 border-r border-gray-100"
          >
            {/* Header */}
            <div className="p-6 pt-20 border-b border-gray-100 bg-gradient-to-br from-emerald-50 to-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gray-900">SmartEV</h1>
                  <p className="text-xs font-bold text-emerald-700">USER PORTAL</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                  >
                    <motion.div
                      whileHover={{ x: 6 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg"
                          : "hover:bg-emerald-50 text-gray-700"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-emerald-600"}`} />
                      <span className={`font-semibold ${isActive ? "text-white" : "text-gray-800"}`}>
                        {item.label}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl shadow-lg hover:shadow-red-400 transition-all"
              >
                <LogOut className="w-6 h-6" />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && window.innerWidth < 768 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>
    </>
  );
}