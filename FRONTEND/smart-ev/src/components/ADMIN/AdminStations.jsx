// pages/AdminStations.jsx - FINAL WITH CHARGER TYPE & PRICE
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { 
  Zap, Plus, MapPin, Building2, CheckCircle, AlertCircle, Loader2,
  BatteryCharging, IndianRupee
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

export default function AdminStations() {
  const [cities, setCities] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    stationName: "",
    address: "",
    totalSlots: "",
    chargerType: "AC Type 2",
    pricePerHour: "150",
    locationId: ""
  });

  // Charger Type Options
  const chargerTypes = [
    "AC Type 2",
    "DC Fast 50kW",
    "DC Fast 120kW",
    "CCS Combo",
    "CHAdeMO",
    "Tesla Supercharger"
  ];

  useEffect(() => {
    fetchCities();
    fetchAllLocations();
    fetchStations();
  }, []);

  useEffect(() => {
    if (selectedCityId && allLocations.length > 0) {
      const filtered = allLocations.filter(loc => loc.city.id == selectedCityId);
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
      setSelectedLocation(null);
    }
  }, [selectedCityId, allLocations]);

  const fetchCities = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/cities");
      setCities(res.data.cities || []);
    } catch (err) {
      console.log("Error fetching cities");
    }
  };

  const fetchAllLocations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/locations");
      setAllLocations(res.data.location || []);
    } catch (err) {
      console.log("Error fetching locations");
    }
  };

  const fetchStations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/stations");
      setStations(res.data.stations || []);
    } catch (err) {
      console.log("Error fetching stations");
    }
  };

  const handleLocationSelect = (locationId) => {
    const loc = filteredLocations.find(l => l.id == locationId);
    setSelectedLocation(loc);
    setFormData(prev => ({ ...prev, locationId }));
  };

  const handleAddStation = async (e) => {
    e.preventDefault();

    if (!formData.stationName || !formData.locationId || !formData.totalSlots) {
      setError("Station name, location, and total slots are required");
      return;
    }

    if (!selectedLocation?.latitude || !selectedLocation?.longitude) {
      setError("Selected location has invalid coordinates");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:8080/api/admin/stations", {
        stationName: formData.stationName,
        address: formData.address || null,
        totalSlots: parseInt(formData.totalSlots),
        chargerType: formData.chargerType,
        pricePerHour: parseFloat(formData.pricePerHour),
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        location: { id: parseInt(formData.locationId) }
      }, {
        headers: { "Content-Type": "application/json" }
      });

      setSuccess("Charging station added successfully!");
      setFormData({
        stationName: "",
        address: "",
        totalSlots: "",
        chargerType: "AC Type 2",
        pricePerHour: "150",
        locationId: ""
      });
      setSelectedCityId("");
      setSelectedLocation(null);
      fetchStations();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add station");
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <AdminNavbar />

      <div className="pl-20 pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Manage Charging Stations</h1>
            <p className="text-lg md:text-xl text-gray-600">Add and monitor EV charging stations</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add Station Form */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add New Station</h2>
                  <p className="text-gray-600">Deploy new EV charging points</p>
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

              <form onSubmit={handleAddStation} className="space-y-6">
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">Station Name</label>
                  <input
                    type="text"
                    value={formData.stationName}
                    onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
                    placeholder="e.g., Tata Power Bandra"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">Select City</label>
                  <select
                    value={selectedCityId}
                    onChange={(e) => setSelectedCityId(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base"
                    required
                  >
                    <option value="">Choose a city</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">Select Location</label>
                  <select
                    value={formData.locationId}
                    onChange={(e) => handleLocationSelect(e.target.value)}
                    disabled={!selectedCityId}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base disabled:opacity-50"
                    required
                  >
                    <option value="">{selectedCityId ? "Choose location" : "Select city first"}</option>
                    {filteredLocations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.city.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Coordinates Display */}
                {selectedLocation && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Latitude</p>
                      <p className="text-lg font-bold text-emerald-700">{selectedLocation.latitude.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Longitude</p>
                      <p className="text-lg font-bold text-emerald-700">{selectedLocation.longitude.toFixed(6)}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">Total Charging Slots</label>
                  <input
                    type="number"
                    value={formData.totalSlots}
                    onChange={(e) => setFormData({ ...formData, totalSlots: e.target.value })}
                    placeholder="e.g., 8"
                    min="1"
                    max="50"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base"
                    required
                  />
                </div>

                {/* NEW: Charger Type */}
                <div>
                  <label className="flex items-center gap-3 text-base font-semibold text-gray-800 mb-3">
                    <BatteryCharging className="w-6 h-6 text-emerald-600" />
                    Charger Type
                  </label>
                  <select
                    value={formData.chargerType}
                    onChange={(e) => setFormData({ ...formData, chargerType: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base"
                  >
                    {chargerTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* NEW: Price per Hour */}
                <div>
                  <label className="flex items-center gap-3 text-base font-semibold text-gray-800 mb-3">
                    <IndianRupee className="w-6 h-6 text-emerald-600" />
                    Price per Hour (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                    placeholder="e.g., 150"
                    min="50"
                    step="10"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">Address (Optional)</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g., Near Metro Station"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !selectedLocation}
                  className="w-full py-5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-emerald-400 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Adding Station...
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      Add Charging Station
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Right Side: Map + Stations */}
            <div className="space-y-8">
              {/* Map */}
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
                <div className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-blue-50">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Zap className="w-8 h-8 text-emerald-600" />
                    Charging Stations on Map
                  </h2>
                </div>
                <div className="h-96">
                  <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {stations.map(station => {
                      const lat = station.latitude || station.location?.latitude;
                      const lng = station.longitude || station.location?.longitude;
                      if (!lat || !lng) return null;
                      return (
                        <Marker key={station.id} position={[lat, lng]}>
                          <Popup>
                            <div className="text-center p-2">
                              <p className="font-bold text-emerald-600 text-lg">{station.stationName}</p>
                              <p className="text-sm text-gray-600">{station.location?.name}</p>
                              <p className="text-xs font-bold text-emerald-600 mt-2">{station.totalSlots} Slots • {station.chargerType}</p>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
              </motion.div>

              {/* Stations List */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Charging Stations ({stations.length})</h2>
                {stations.length === 0 ? (
                  <div className="bg-white rounded-2xl p-16 text-center border-2 border-dashed border-emerald-200">
                    <Zap className="w-20 h-20 text-emerald-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">No stations added yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stations.map((station, i) => (
                      <motion.div
                        key={station.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Zap className="w-12 h-12 text-emerald-500" />
                          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                            {station.totalSlots} Slots
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{station.stationName}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {station.location?.name || "Unknown"}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {station.location?.city?.name || "Unknown"}
                          </p>
                          <p className="flex items-center gap-2">
                            <BatteryCharging className="w-4 h-4 text-emerald-600" />
                            {station.chargerType || "AC Type 2"}
                          </p>
                          <p className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-emerald-600" />
                            ₹{station.pricePerHour || 150}/hour
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}