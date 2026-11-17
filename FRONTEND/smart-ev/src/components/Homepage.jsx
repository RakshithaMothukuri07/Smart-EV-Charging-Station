// HomePage.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Zap, 
  MapPin, 
  Clock, 
  Shield, 
  ArrowRight, 
  BatteryCharging, 
  ChevronDown,
  Plug,
  Battery,
  Leaf,
  Navigation,
  Lock,
  Sparkles,
  Car,
  Power,
  Globe,
  Users,
  Route,
  Calendar,
  Search,
  BarChart3,
  Settings,
  Building,
  CheckCircle,
  Target,
  TrendingUp,
  CloudLightning
} from "lucide-react";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-blue-50 text-gray-900 overflow-x-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Circuit Pattern for EV Theme */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #10b981 1px, transparent 2px)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/95 backdrop-blur-xl py-3 shadow-lg shadow-emerald-100/30 border-b border-emerald-100" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-blue-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200"
              >
                <Zap className="w-6 h-6 text-white" fill="currentColor" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  EVCharge Locator
                </h1>
                <p className="text-xs text-emerald-600">Smart Station Finder & Booking</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-full border border-emerald-300 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-sm font-medium"
                >
                  User Login
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full font-semibold text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all relative overflow-hidden group text-sm"
                >
                  <span className="relative z-10">Register Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 mb-6">
                <CloudLightning className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Revolutionizing EV Charging</span>
              </div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
              >
                <span className="block text-gray-900">Find, Plan &</span>
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500">
                    Charge Your EV
                  </span>
                  <motion.div
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                </span>
                <span className="block mt-4 text-gray-900 text-3xl lg:text-4xl">Seamlessly</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-gray-600 mt-6 leading-relaxed"
              >
                Intelligent platform for locating EV charging stations, planning optimal routes, 
                and booking slots in advance. Experience hassle-free electric vehicle charging.
              </motion.p>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-4 mt-8"
              >
                {[
                  { number: "15K+", label: "Stations", icon: <Zap className="w-4 h-4" />, color: "emerald" },
                  { number: "120+", label: "Cities", icon: <Building className="w-4 h-4" />, color: "blue" },
                  { number: "99.8%", label: "Uptime", icon: <CheckCircle className="w-4 h-4" />, color: "green" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow border border-emerald-100">
                    <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>{stat.number}</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      {stat.icon}
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 mt-12"
              >
                <Link to="/stations" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl font-semibold text-white shadow-xl shadow-emerald-200 hover:shadow-emerald-300 flex items-center justify-center gap-2 group"
                  >
                    Find Stations Nearby
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link to="/features" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-white border-2 border-emerald-300 text-emerald-700 rounded-xl font-semibold shadow-lg hover:shadow-emerald-100 hover:bg-emerald-50 transition-all"
                  >
                    View Features
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right - Feature Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl border-2 border-emerald-100 p-8 shadow-2xl shadow-emerald-100">
                {/* Animated Charging Card */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Live Charging Status</h3>
                      <p className="text-emerald-600 font-medium">Real-time Station Availability</p>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full flex items-center justify-center shadow-md"
                    >
                      <BatteryCharging className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>

                  {/* Charging Animation */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>SuperStation • NYC Downtown</span>
                      <span className="text-emerald-600 font-semibold">Available Now</span>
                    </div>
                    <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </motion.div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">65% capacity available</div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Book Slot</div>
                          <div className="text-xs text-emerald-600">Reserve now</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Route className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Plan Route</div>
                          <div className="text-xs text-blue-600">Get directions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-emerald-500" />
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-4">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Key Benefits</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
              Why Choose Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">Platform</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the advantages of smart EV charging management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Time Efficiency",
                desc: "Reduce waiting time with real-time slot availability and advance booking",
                benefits: ["Instant station search", "No waiting queues", "Time slot optimization"],
                color: "emerald"
              },
              {
                icon: <Route className="w-8 h-8" />,
                title: "Optimal Routing",
                desc: "Intelligent route planning to nearest available charging stations",
                benefits: ["Traffic-aware routes", "Multiple station options", "Distance optimization"],
                color: "blue"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Reliable Service",
                desc: "Secure platform with verified stations and guaranteed availability",
                benefits: ["Verified stations", "Secure payments", "24/7 support"],
                color: "green"
              }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -5 }}
                className={`bg-white border-2 border-${benefit.color}-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br from-${benefit.color}-400 to-${benefit.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600 mb-6">{benefit.desc}</p>
                <ul className="space-y-2">
                  {benefit.benefits.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 text-${benefit.color}-500`} />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Simple <span className="text-emerald-600">3-Step</span> Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get from searching to charging in just a few clicks
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Search className="w-10 h-10" />,
                title: "Search & Locate",
                desc: "Select your city and location to find nearby charging stations",
                color: "emerald",
                features: ["City-based filtering", "Real-time availability", "Distance sorting"]
              },
              {
                step: "02",
                icon: <Route className="w-10 h-10" />,
                title: "Check & Confirm",
                desc: "Get optimized route to your chosen charging station",
                color: "blue",
                features: ["Optimal path finding", "Traffic updates", "Estimated time"]
              },
              {
                step: "03",
                icon: <Calendar className="w-10 h-10" />,
                title: "Book & Charge",
                desc: "Reserve your time slot and proceed to charging",
                color: "emerald",
                features: ["Advance booking", "Slot confirmation", "Secure payment"]
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className={`bg-white border-2 border-${step.color}-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
                  <div className={`absolute -top-4 -right-4 w-12 h-12 bg-${step.color}-500 text-white rounded-full flex items-center justify-center font-bold text-xl`}>
                    {step.step}
                  </div>
                  <div className={`w-16 h-16 bg-${step.color}-100 rounded-2xl flex items-center justify-center mb-6`}>
                    <div className={`text-${step.color}-600`}>
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 mb-6">{step.desc}</p>
                  <div className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-2 h-2 bg-${step.color}-400 rounded-full`}></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About System Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">Our System</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              A comprehensive solution designed to address the challenges of modern EV charging infrastructure
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Users className="w-8 h-8" />, number: "50K+", label: "Active Users", color: "emerald" },
              { icon: <Car className="w-8 h-8" />, number: "25K+", label: "EVs Charged", color: "blue" },
              { icon: <Globe className="w-8 h-8" />, number: "120+", label: "Cities Covered", color: "green" },
              { icon: <Power className="w-8 h-8" />, number: "1.2M+", label: "kWh Charged", color: "cyan" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 bg-${stat.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <div className={`text-${stat.color}-600`}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-4xl font-bold text-${stat.color}-600 mb-2`}>{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-blue-400/10 to-emerald-400/10"></div>
            
            <div className="relative z-10 text-center px-8 py-16 bg-white/90 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
                  Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">Smart Charging</span> Journey
                </h2>
                <p className="text-xl text-gray-600">
                  Join thousands of EV users who are charging smarter today
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/register" className="sm:w-auto w-full">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-lg font-bold text-white rounded-full shadow-xl shadow-emerald-200 hover:shadow-emerald-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Create Free Account</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                </Link>
                <Link to="/demo" className="sm:w-auto w-full">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-12 py-4 bg-white border-2 border-emerald-300 text-emerald-700 text-lg font-bold rounded-full shadow-lg hover:shadow-emerald-100 hover:bg-emerald-50 transition-all"
                  >
                    See Live Demo
                  </motion.button>
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-gray-500"
              >
                No credit card required • Free 30-day trial • Cancel anytime
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-emerald-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  EVCharge Locator
                </h3>
                <p className="text-xs text-gray-500">Smart Charging Station Management System</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-600">
                © 2025 Smart EV Charging System. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Empowering sustainable transportation through intelligent charging solutions
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}