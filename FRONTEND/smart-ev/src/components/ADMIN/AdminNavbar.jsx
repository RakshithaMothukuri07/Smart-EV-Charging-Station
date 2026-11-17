// components/AdminNavbar.jsx - UPDATED RESPONSIVE VERSION
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, MapPin, Building2, Plug, Calendar, Users, UserStar,
  LogOut, BarChart3, Zap, Menu, X, ChevronLeft, ChevronRight, 
} from "lucide-react";



const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/cities", label: "Cities", icon: MapPin },
  { path: "/admin/locations", label: "Locations", icon: Building2 },
  { path: "/admin/stations", label: "Stations", icon: Plug },
  { path: "/admin/slots", label: "Generate Slots", icon: Calendar },
  { path: "/admin/users", label: "Manage Users", icon: Users },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/admin/reviews", label: "Reviews", icon: UserStar },
];

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/login");
  };

  const NavbarContent = () => (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed left-0 top-0 h-screen ${
        isMobile ? "w-72" : "w-[67%] max-w-[300px]"
      } bg-white/95 backdrop-blur-xl border-r border-emerald-100 shadow-2xl z-40 overflow-y-auto`}
    >
      {/* Header */}
      <div className="p-6 pt-8 border-b border-emerald-100 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Zap className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">SmartEV</h1>
              <p className="text-xs font-bold text-emerald-700">ADMIN PORTAL</p>
            </div>
          </div>
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center hover:bg-emerald-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-emerald-700" />
            </motion.button>
          )}
        </div>
        <div className="mt-4 text-sm text-emerald-600 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>System Active</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");

          return (
            <Link key={item.path} to={item.path} onClick={() => isMobile && setIsOpen(false)}>
              <motion.div
                whileHover={{ x: 6, backgroundColor: isActive ? "" : "#f0fdfa" }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg"
                    : "hover:bg-emerald-50 text-gray-700"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-emerald-600"}`} />
                <span className={`font-semibold text-base ${isActive ? "text-white" : "text-gray-800"}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

    
      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-100 bg-white/90 backdrop-blur-sm">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
        >
          <LogOut className="w-6 h-6" />
          Logout
        </motion.button>
        <div className="mt-3 text-xs text-center text-gray-500">

        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-50 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-emerald-300 hover:border-emerald-500 transition-all"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-emerald-700" />
        ) : (
          <Menu className="w-6 h-6 text-emerald-700" />
        )}
      </motion.button>

      {/* Collapsed Nav Indicator */}
      {!isOpen && !isMobile && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed top-20 left-5 z-50 w-10 h-10 bg-emerald-500 rounded-full shadow-xl flex items-center justify-center text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && <NavbarContent />}
      </AnimatePresence>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && isMobile && (
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