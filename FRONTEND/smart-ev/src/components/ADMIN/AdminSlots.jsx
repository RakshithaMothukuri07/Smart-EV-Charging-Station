// pages/AdminGenerateSlots.jsx - UPDATED WITH BLOCKCHAIN SAVE FEATURE
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  BatteryCharging,
  Building2,
  MapPin,
} from "lucide-react";
import { FaShieldAlt } from "react-icons/fa"; // Added for blockchain icon
import AdminNavbar from "./AdminNavbar";

export default function AdminGenerateSlots() {
  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedSlots, setGeneratedSlots] = useState([]);

  // NEW: Blockchain save states (mirroring your StockAnalysis pattern)
  const [savingToBC, setSavingToBC] = useState(false);
  const [bcSuccess, setBcSuccess] = useState("");
  const [bcError, setBcError] = useState("");

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/stations");
      setStations(res.data.stations || []);
    } catch (err) {
      // Fallback: get from locations
      try {
        const res = await axios.get(
          "http://localhost:8080/api/admin/locations"
        );
        const locations = res.data.location || [];
        const allStations = [];
        locations.forEach((loc) => {
          if (loc.chargingStations) {
            loc.chargingStations.forEach((station) => {
              allStations.push({
                ...station,
                locationName: loc.name,
                cityName: loc.city?.name || "Unknown",
              });
            });
          }
        });
        setStations(allStations);
      } catch (err) {
        console.log("Both APIs failed");
        setStations([]);
      }
    }
  };

  const handleGenerateSlots = async (e) => {
    e.preventDefault();
    if (!selectedStationId || !selectedDate) {
      setError("Please select station and date");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setGeneratedSlots([]);
    setBcSuccess("");
    setBcError("");

    try {
      const res = await axios.post(
        `http://localhost:8080/api/admin/stations/${selectedStationId}/generate-slots`,
        null,
        {
          params: {
            date: selectedDate,
            slotDurationMinutes: parseInt(durationMinutes),
          },
        }
      );

      const slots = res.data.slots || [];
      setGeneratedSlots(slots);
      setSuccess(`${slots.length} slots generated successfully!`);
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate slots");
    } finally {
      setLoading(false);
    }
  };

  // NEW: Save slot generation record to blockchain (via your backend API)
  const saveSlotsToBlockchain = async () => {
    if (generatedSlots.length === 0) return;

    setSavingToBC(true);
    setBcError("");
    setBcSuccess("");

    const selectedStation = stations.find(
      (s) => s.id === parseInt(selectedStationId)
    );

    try {
      const payload = {
        eventType: "charging_slots_generated",
        stationId: selectedStationId,
        stationName: selectedStation?.stationName || "Unknown",
        locationName:
          selectedStation?.locationName ||
          selectedStation?.location?.name ||
          "Unknown",
        cityName:
          selectedStation?.cityName ||
          selectedStation?.location?.city?.name ||
          "Unknown",
        date: selectedDate,
        durationMinutes: parseInt(durationMinutes),
        totalSlotsGenerated: generatedSlots.length,
        slots: generatedSlots.map((slot) => ({
          startTime: slot.startTime || "N/A",
          endTime: slot.endTime || "N/A",
          chargerNumber: slot.chargerNumber || "Unknown",
          status: slot.status || "available",
        })),
        timestamp: new Date().toISOString(),
        generatedBy: "admin_panel",
      };

      // CHANGE THIS URL TO YOUR ACTUAL BACKEND ENDPOINT FOR BLOCKCHAIN LOGGING
      const response = await axios.post(
        "http://127.0.0.1:8000/api/slot_generation/",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        setBcSuccess("Slot generation event securely saved to blockchain!");
        setTimeout(() => setBcSuccess(""), 8000);
      }
    } catch (err) {
      console.error("Failed to save to blockchain:", err);
      setBcError(
        err.response?.data?.message ||
          "Failed to save to blockchain. Please check backend connection."
      );
      setTimeout(() => setBcError(""), 8000);
    } finally {
      setSavingToBC(false);
    }
  };

  const selectedStation = stations.find(
    (s) => s.id === parseInt(selectedStationId)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <AdminNavbar />

      <div className="pl-20 pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              Generate Charging Slots
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Create available time slots for your charging stations
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Generate Slots
                  </h2>
                  <p className="text-gray-600">
                    Select station, date, and duration
                  </p>
                </div>
              </div>

              {/* Success / Error Messages */}
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
              {bcSuccess && (
                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3 text-purple-700">
                  <FaShieldAlt className="w-6 h-6" />
                  {bcSuccess}
                </div>
              )}
              {bcError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-6 h-6" />
                  {bcError}
                </div>
              )}

              <form onSubmit={handleGenerateSlots} className="space-y-6">
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Charging Station
                  </label>
                  {stations.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No stations found. Add one first!
                    </p>
                  ) : (
                    <select
                      value={selectedStationId}
                      onChange={(e) => setSelectedStationId(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base"
                      required
                    >
                      <option value="">Choose a station</option>
                      {stations.map((station) => (
                        <option key={station.id} value={station.id}>
                          {station.stationName} •{" "}
                          {station.locationName || station.location?.name},{" "}
                          {station.cityName || station.location?.city?.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {selectedStation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-200"
                  >
                    <div className="flex items-center gap-4">
                      <Zap className="w-12 h-12 text-emerald-600" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedStation.stationName}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-700 mt-2">
                          <span className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {selectedStation.locationName ||
                              selectedStation.location?.name}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {selectedStation.cityName ||
                              selectedStation.location?.city?.name}
                          </span>
                          <span className="flex items-center gap-2">
                            <BatteryCharging className="w-4 h-4" />
                            {selectedStation.totalSlots} Chargers
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Slot Duration
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {["30", "60", "120"].map((val) => (
                      <motion.button
                        key={val}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDurationMinutes(val)}
                        className={`py-4 rounded-xl font-semibold transition-all ${
                          durationMinutes === val
                            ? "bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg"
                            : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-emerald-50"
                        }`}
                      >
                        {val === "30"
                          ? "30 min"
                          : val === "60"
                          ? "1 hour"
                          : "2 hours"}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !selectedStationId || !selectedDate}
                  className="w-full py-5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-emerald-400 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6" />
                      Generate Slots
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Generated Slots */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Generated Slots
                  </h2>
                  <p className="text-gray-600">
                    Time slots created for booking
                  </p>
                </div>
              </div>

              {generatedSlots.length === 0 ? (
                <div className="text-center py-20">
                  <Clock className="w-24 h-24 text-emerald-200 mx-auto mb-6" />
                  <p className="text-xl text-gray-500">
                    No slots generated yet
                  </p>
                  <p className="text-gray-400 mt-2">
                    Select a station and date to generate slots
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <p className="text-emerald-700 font-semibold">
                      {generatedSlots.length} slots created for{" "}
                      {selectedStation?.stationName}
                    </p>
                    <p className="text-sm text-emerald-600 mt-1">
                      Date: {selectedDate} • Duration: {durationMinutes} minutes
                    </p>
                  </div>

                  {/* NEW: Blockchain Save Button */}
                  <div className="mb-8 flex justify-end">
                    <button
                      onClick={saveSlotsToBlockchain}
                      disabled={savingToBC}
                      className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg ${
                        savingToBC
                          ? "bg-gray-500 cursor-not-allowed opacity-70"
                          : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      }`}
                    >
                      <FaShieldAlt className="text-xl" />
                      <span>
                        {savingToBC
                          ? "Saving to Blockchain..."
                          : "Save to Blockchain"}
                      </span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {generatedSlots.map((slot, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-4 border border-emerald-200 text-center"
                      >
                        <p className="text-lg font-bold text-emerald-700">
                          {slot.startTime || "N/A"} - {slot.endTime || "N/A"}
                        </p>
                        <p className="text-xs text-emerald-600 mt-1">
                          Charger {slot.chargerNumber}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
