// pages/FindStations.jsx - FINAL & 100% WORKING (NO SYNTAX ERRORS)
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin, Zap, BatteryCharging, Building2, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function FindStations() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchLocations(selectedCity);
    } else {
      setLocations([]);
      setStations([]);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedLocation) {
      fetchStations(selectedLocation);
    } else {
      setStations([]);
    }
  }, [selectedLocation]);

  const fetchCities = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users/cities");
      setCities(res.data.cities || []);
    } catch (err) {
      console.log("Error fetching cities");
    }
  };

  const fetchLocations = async (cityId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/users/locations/${cityId}`
      );
      setLocations(res.data.locations || []);
    } catch (err) {
      setLocations([]);
    }
  };

  const fetchStations = async (locationId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/users/stations/${locationId}`
      );
      setStations(res.data.stations || []);
    } catch (err) {
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (stationId) => {
    navigate(`/user/book-slot?station=${stationId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      <UserNavbar />

      {/* Compact Layout */}
      <div className="pl-20 pt-20 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Find Charging Stations
            </h1>
            <p className="text-lg text-gray-600">
              Discover nearby EV charging points
            </p>
          </motion.div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedLocation("");
                }}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
              >
                <option value="">Choose City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                disabled={!selectedCity}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base disabled:opacity-50"
              >
                <option value="">
                  {selectedCity ? "Choose Location" : "Select city first"}
                </option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Map + Stations */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                  Stations on Map
                </h2>
              </div>
              <div className="h-80">
                <MapContainer
                  center={[20.5937, 78.9629]}
                  zoom={5}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {stations.map((station) => {
                    const lat = station.latitude || station.location?.latitude;
                    const lng =
                      station.longitude || station.location?.longitude;
                    if (!lat || !lng) return null;
                    return (
                      <Marker key={station.id} position={[lat, lng]}>
                        <Popup>
                          <div className="text-center">
                            <p className="font-bold text-emerald-600">
                              {station.stationName}
                            </p>
                            <p className="text-sm">{station.location?.name}</p>
                            <p className="text-xs font-bold text-emerald-600 mt-1">
                              {station.totalSlots} Slots
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </motion.div>

            {/* Stations List */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Available Stations
                </h2>
                <span className="text-emerald-600 font-semibold">
                  {stations.length} found
                </span>
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
                </div>
              ) : stations.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border-2 border-dashed border-gray-200">
                  <Zap className="w-20 h-20 text-emerald-200 mx-auto mb-4" />
                  <p className="text-lg text-gray-500">No stations found</p>
                  <p className="text-gray-400">
                    Try selecting a city and location
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {stations.map((station, i) => (
                    <motion.div
                      key={station.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                            <Zap className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {station.stationName}
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1 mt-1">
                              <p className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                {station.location?.name}
                              </p>
                              <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {station.location?.city?.name}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-3">
                            <BatteryCharging className="w-7 h-7 text-emerald-600" />
                            <span className="text-2xl font-bold text-emerald-600">
                              {station.totalSlots}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              navigate(`/user/book-slot?station=${station.id}`)
                            }
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl"
                          >
                            View & Book
                          </button>
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
    </div>
  );
}
