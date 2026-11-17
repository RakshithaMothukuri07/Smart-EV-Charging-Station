// pages/AdminLocations.jsx - FIXED & FULLY WORKING (Invalid coords filtered out)
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { 
  MapPin, 
  Plus, 
  Building2, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Navigation
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AdminNavbar from "./AdminNavbar";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function AdminLocations() {
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    cityId: ""
  });

  useEffect(() => {
    fetchCities();
    fetchLocations();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/cities");
      setCities(res.data.cities || []);
    } catch (err) {
      console.log("Error fetching cities");
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/locations");
      // Your API returns "location" array, not "locations"
      setLocations(res.data.location || []);
    } catch (err) {
      console.log("Error fetching locations");
      setLocations([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.cityId || !formData.latitude || !formData.longitude) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        "http://localhost:8080/api/admin/locations",
        {
          name: formData.name,
          address: formData.address || null,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          city: { id: parseInt(formData.cityId) }
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess("Location added successfully!");
      setFormData({ name: "", address: "", latitude: "", longitude: "", cityId: "" });
      fetchLocations(); // Refresh list
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add location");
    } finally {
      setLoading(false);
    }
  };

  // Helper: Check if coordinates are valid
  const isValidCoord = (lat, lng) => {
    return (
      typeof lat === "number" &&
      typeof lng === "number" &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180 &&
      !isNaN(lat) && !isNaN(lng)
    );
  };

  // Auto-fit map bounds - ONLY using valid coordinates
  function MapBounds({ locations }) {
    const map = useMap();
    useEffect(() => {
      const validLocations = locations.filter(loc => isValidCoord(loc.latitude, loc.longitude));
      
      if (validLocations.length === 0) return;

      const validCoords = validLocations.map(loc => [loc.latitude, loc.longitude]);
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }, [locations, map]);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <AdminNavbar />

      <div className="pl-20 pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Manage Locations</h1>
            <p className="text-lg md:text-xl text-gray-600">Add and view charging zones in cities</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add Location Form */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add New Location</h2>
                  <p className="text-gray-600">Define charging zones</p>
                </div>
              </div>

              {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700">
                  <CheckCircle className="w-6 h-6" />
                  {success}
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-6 h-6" />
                  {error}
                </div>
              )}

              <form onSubmit={handleAddLocation} className="space-y-6">
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">Location Name</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Bandra West"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">Select City</label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base"
                    required
                  >
                    <option value="">Choose city</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">Address (Optional)</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g., Near Railway Station"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="19.0607"
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="72.8362"
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-emerald-400 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      Add Location
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Map + Locations List */}
            <div className="space-y-8">
              {/* Map */}
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
                <div className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-blue-50">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <MapPin className="w-8 h-8 text-emerald-600" />
                    Locations on Map
                  </h2>
                </div>
                <div className="h-96">
                  <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapBounds locations={locations} />

                    {/* Only render markers with VALID coordinates */}
                    {locations.map(loc => {
                      if (!isValidCoord(loc.latitude, loc.longitude)) return null;
                      return (
                        <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                          <Popup>
                            <div className="text-center">
                              <p className="font-bold text-emerald-600 text-lg">{loc.name}</p>
                              <p className="text-sm text-gray-600">{loc.city?.name || "Unknown City"}</p>
                              {loc.address && <p className="text-xs text-gray-500 mt-1">{loc.address}</p>}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
              </motion.div>

              {/* Locations Grid */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Locations ({locations.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {locations.map((loc, i) => (
                    <motion.div
                      key={loc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <MapPin className="w-10 h-10 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                          {loc.city?.name || "Unknown"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{loc.name}</h3>
                      {loc.address && <p className="text-sm text-gray-600 mb-3">{loc.address}</p>}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Navigation className="w-4 h-4" />
                        <span>
                          {isValidCoord(loc.latitude, loc.longitude)
                            ? `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`
                            : "Invalid coordinates"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}