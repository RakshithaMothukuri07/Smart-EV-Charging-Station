// pages/AdminReviews.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Star,
  Search,
  Filter,
  Calendar,
  MessageSquare,
  User,
  AlertCircle,
  Loader2,
  MapPin,
  Building,
  Zap,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import AdminNavbar from "./AdminNavbar";

export default function AdminReviews() {
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stations, setStations] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // Selected filters
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  
  // Loading states
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingStations, setLoadingStations] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    fiveStar: 0,
    oneStar: 0
  });

  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch all cities
  const fetchCities = async () => {
    try {
      setLoadingCities(true);
      const res = await axios.get("http://localhost:8080/api/admin/cities");
      setCities(res.data.cities || []);
    } catch (err) {
      setError("Failed to fetch cities");
    } finally {
      setLoadingCities(false);
    }
  };

  // Fetch locations based on selected city
  const fetchLocations = async (cityId) => {
    if (!cityId) {
      setLocations([]);
      setSelectedLocation("");
      return;
    }

    try {
      setLoadingLocations(true);
      const res = await axios.get("http://localhost:8080/api/admin/locations");
      console.log(res.data,"loc")
    //   const filteredLocations = (res.data.location).filter(
    //     loc => loc.city?.id === cityId
    //   );
    //   console.log(filteredLocations,"fl")
      setLocations(res.data.location);
      setSelectedLocation("");
    } catch (err) {
      setError("Failed to fetch locations");
    } finally {
      setLoadingLocations(false);
    }
  };

  console.log(locations,"ref")

  // Fetch stations based on selected location
  const fetchStations = async (locationId) => {
    if (!locationId) {
      setStations([]);
      setSelectedStation("");
      return;
    }

    try {
      setLoadingStations(true);
      const res = await axios.get("http://localhost:8080/api/admin/stations");
      console.log(res.data,"station")
    //   const filteredStations = (res.data.stations || []).filter(
    //     station => station.location?.id === locationId
    //   );
      setStations(res.data.stations);
      setSelectedStation("");
    } catch (err) {
      setError("Failed to fetch stations");
    } finally {
      setLoadingStations(false);
    }
  };

  // Fetch reviews for selected station
  const fetchStationReviews = async (stationId) => {
    if (!stationId) {
      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
      return;
    }

    try {
      setLoadingReviews(true);
      setError("");
      const res = await axios.get(
        `http://localhost:8080/api/users/station-reviews/${stationId}`
      );

      if (res.data.reviews) {
        setReviews(res.data.reviews);
        setAverageRating(res.data.averageRating || 0);
        setTotalReviews(res.data.totalReviews || 0);
        
        // Calculate stats
        const fiveStar = res.data.reviews.filter(r => r.rating === 5).length;
        const oneStar = res.data.reviews.filter(r => r.rating === 1).length;
        
        setStats({
          total: res.data.totalReviews,
          average: res.data.averageRating,
          fiveStar,
          oneStar
        });
      }
    } catch (err) {
      setError("Failed to fetch reviews");
      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Handle city selection
  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    fetchLocations(cityId);
    setSelectedStation("");
    setReviews([]);
  };

  // Handle location selection
  const handleLocationChange = (e) => {
    const locationId = e.target.value;
    setSelectedLocation(locationId);
    fetchStations(locationId);
    setReviews([]);
  };

  // Handle station selection
  const handleStationChange = (e) => {
    const stationId = e.target.value;
    setSelectedStation(stationId);
    if (stationId) {
      fetchStationReviews(stationId);
    } else {
      setReviews([]);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Star display component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Get rating color based on value
  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-emerald-600";
    if (rating >= 3) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <AdminNavbar />

      <div className="pl-24 pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-5xl font-black text-gray-900 mb-3">
              Station Reviews
            </h1>
            <p className="text-xl text-gray-600">
              Monitor and analyze customer feedback across all charging stations
            </p>
          </motion.div>

          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Filter className="w-8 h-8 text-emerald-600" />
              <h2 className="text-2xl font-bold text-gray-900">Filter Reviews</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* City Selector */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Select City
                </label>
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  disabled={loadingCities}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {loadingCities && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading cities...
                  </div>
                )}
              </div>

              {/* Location Selector */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Select Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  disabled={!selectedCity || loadingLocations}
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                {loadingLocations && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading locations...
                  </div>
                )}
              </div>

              {/* Station Selector */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <Zap className="w-4 h-4 inline mr-2" />
                  Select Station
                </label>
                <select
                  value={selectedStation}
                  onChange={handleStationChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  disabled={!selectedLocation || loadingStations}
                >
                  <option value="">All Stations</option>
                  {stations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.stationName}
                    </option>
                  ))}
                </select>
                {loadingStations && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading stations...
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          {selectedStation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              {/* Total Reviews */}
              <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-medium">Total Reviews</p>
                    <h3 className="text-4xl font-black text-emerald-600 mt-2">
                      {stats.total}
                    </h3>
                  </div>
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Average Rating */}
              <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-medium">Average Rating</p>
                    <h3 className={`text-4xl font-black mt-2 ${getRatingColor(stats.average)}`}>
                      {stats.average.toFixed(1)}
                      <span className="text-lg text-gray-500">/5</span>
                    </h3>
                  </div>
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <Star className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
              </div>

              {/* 5-Star Reviews */}
              <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-medium">5-Star Reviews</p>
                    <h3 className="text-4xl font-black text-emerald-600 mt-2">
                      {stats.fiveStar}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {stats.total > 0 ? `${((stats.fiveStar / stats.total) * 100).toFixed(1)}%` : "0%"}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              {/* 1-Star Reviews */}
              <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-medium">1-Star Reviews</p>
                    <h3 className="text-4xl font-black text-red-600 mt-2">
                      {stats.oneStar}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {stats.total > 0 ? `${((stats.oneStar / stats.total) * 100).toFixed(1)}%` : "0%"}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                    <TrendingDown className="w-8 h-8 text-red-600" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <motion.div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-7 h-7" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700">
              <CheckCircle className="w-7 h-7" />
              {success}
            </motion.div>
          )}

          {/* Reviews Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden"
          >
            <div className="p-8 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-blue-50">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Star className="w-10 h-10 text-amber-600" />
                  Customer Reviews
                </h2>
                {selectedStation && (
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      Showing {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {loadingReviews ? (
              <div className="p-20 text-center">
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto" />
                <p className="text-xl text-gray-600 mt-4">Loading reviews...</p>
              </div>
            ) : !selectedStation ? (
              <div className="p-20 text-center">
                <Star className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500 mb-6">
                  Select a station to view reviews
                </p>
                <p className="text-gray-600">
                  Choose a city → location → station from the filters above
                </p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="p-20 text-center">
                <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">No reviews found for this station</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {reviews.map((review, i) => (
                  <motion.div
                    key={review.bookingId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-8 hover:bg-emerald-50/30 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                     

                      {/* Review Content */}
                      <div className="lg:w-3/4">
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">Reviewed on:</span>
                            <span>{formatDate(review.reviewDate)}</span>
                          </div>
                          
                          {review.comment && (
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                              <div className="flex items-center gap-2 text-gray-700 mb-2">
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-medium">Comment:</span>
                              </div>
                              <p className="text-gray-800">{review.comment}</p>
                            </div>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            <span>Station: {review.stationName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Booking ID: {review.bookingId}</span>
                          </div>
                        </div>
                      </div>

                       {/* User Info & Rating */}
                       <div className="lg:w-1/4">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {review.userName?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">
                              {review.userName || "Anonymous User"}
                            </p>
                            <p className="text-sm text-gray-600">
                              User ID: {review.userId}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <StarRating rating={review.rating} />
                          <div className={`text-2xl font-bold ${getRatingColor(review.rating)}`}>
                            {review.rating}/5
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}