import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  BatteryCharging,
  Star,
  Eye,
} from "lucide-react";
import { FaShieldAlt } from "react-icons/fa";
import UserNavbar from "./UserNavbar";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [blockchainBookings, setBlockchainBookings] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBC, setLoadingBC] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showViewReviewModal, setShowViewReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");

  const userId = localStorage.getItem("userId") || "1";

  useEffect(() => {
    fetchMyBookings();
    fetchBlockchainBooking();
    fetchUserReviews();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/users/my-bookings/${userId}`
      );
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Failed to load regular bookings:", err);
      setError("Some bookings may not load correctly");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/users/my-reviews/${userId}`
      );
      if (res.data.reviews && Array.isArray(res.data.reviews)) {
        setUserReviews(res.data.reviews);
      }
    } catch (err) {
      console.error("Failed to load user reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchBlockchainBooking = async () => {
    setLoadingBC(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/view_data/${userId}`);
      console.log("Blockchain response:", res.data);

      if (res.data.Success && Array.isArray(res.data.data)) {
        const bcData = res.data.data;

        const formattedBcBookings = bcData.map((data) => {
          let date = "Unknown Date";
          let startTime = "Unknown Time";
          if (data.booking_time) {
            const parts = data.booking_time.trim().split(" ");
            if (parts.length >= 1) date = parts[0];
            if (parts.length >= 2) startTime = parts[1];
          }

          return {
            id: data.id || data.realId || `bc-${data.user_id}`,
            bookingId: data.id,
            date: date,
            startTime: startTime,
            endTime: null,
            chargerNumber: data.slot_id ? `Slot ${data.slot_id}` : "N/A",
            amount: data.amount,
            status: data.status || "confirmed",
            duration_minutes: data.duration_minutes,
            stationName: "EV Charging Station",
            locationName: "SmartEV Network",
            isBlockchainVerified: true,
          };
        });

        setBlockchainBookings(formattedBcBookings);
      } else {
        setBlockchainBookings([]);
      }
    } catch (err) {
      console.warn(
        "No blockchain data or error:",
        err.response?.data || err.message
      );
      setBlockchainBookings([]);
    } finally {
      setLoadingBC(false);
    }
  };

  // Check if a booking already has a review
  const hasReview = (bookingId) => {
    return userReviews.some(review => review.bookingId === bookingId);
  };

  // Get review for a specific booking
  const getReviewForBooking = (bookingId) => {
    return userReviews.find(review => review.bookingId === bookingId);
  };

  const allBookings = [...bookings, ...blockchainBookings];

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;

    setLoading(true);
    try {
      setSuccess("Booking cancelled successfully!");
      fetchMyBookings();
      fetchBlockchainBooking();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError("Could not cancel booking");
    } finally {
      setLoading(false);
    }
  };

  // Open review modal for giving new review
  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setReviewRating(0);
    setReviewComment("");
    setHoverRating(0);
    setReviewSuccess("");
    setShowReviewModal(true);
  };

  // Open view review modal
  const handleViewReview = (booking) => {
    const review = getReviewForBooking(booking.id || booking.bookingId);
    if (review) {
      setSelectedBooking(booking);
      setReviewRating(review.rating);
      setReviewComment(review.comment || "");
      setShowViewReviewModal(true);
    }
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (!reviewRating) {
      setError("Please select a rating");
      return;
    }

    setSubmittingReview(true);
    setError("");

    try {
      const reviewData = {
        bookingId: selectedBooking.id || selectedBooking.bookingId,
        rating: reviewRating,
        comment: reviewComment,
      };

      const response = await axios.post(
        "http://localhost:8080/api/users/submit-review",
        reviewData
      );

      setReviewSuccess("Review submitted successfully!");

      // Refresh bookings and reviews
      setTimeout(() => {
        fetchMyBookings();
        fetchUserReviews();
        setShowReviewModal(false);
        setReviewSuccess("");
        setSuccess("Thank you for your feedback!");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Close review modal
  const handleCloseReview = () => {
    setShowReviewModal(false);
    setShowViewReviewModal(false);
    setSelectedBooking(null);
    setReviewRating(0);
    setReviewComment("");
    setError("");
    setReviewSuccess("");
  };

  const getStatusColor = (status) => {
    const lower = status?.toLowerCase();
    if (lower === "booked" || lower === "confirmed")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (lower === "completed")
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (lower === "cancelled") return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  // Star rating component for display
  const StarRatingDisplay = ({ rating }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-semibold text-gray-700">
          {rating}/5
        </span>
      </div>
    );
  };

  // Star rating component for input
  const StarRatingInput = ({
    rating,
    onRatingChange,
    hoverRating,
    onHoverChange,
  }) => {
    return (
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => onHoverChange(star)}
            onMouseLeave={() => onHoverChange(0)}
          >
            <Star
              className={`w-12 h-12 ${
                star <= (hoverRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
      <UserNavbar />

      {/* Review Modal for giving new review */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold">Rate Your Experience</h2>
              <p className="text-emerald-100 mt-1">
                {selectedBooking.stationName || "EV Charging Station"}
              </p>
            </div>

            <div className="p-6">
              {reviewSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-900">
                    {reviewSuccess}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Thank you for your feedback!
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      How was your charging experience?
                    </h3>

                    <StarRatingInput
                      rating={reviewRating}
                      onRatingChange={setReviewRating}
                      hoverRating={hoverRating}
                      onHoverChange={setHoverRating}
                    />

                    <div className="mt-2 text-gray-600">
                      {hoverRating > 0 ? (
                        <span className="font-semibold">
                          {hoverRating} star{hoverRating > 1 ? "s" : ""}
                        </span>
                      ) : reviewRating > 0 ? (
                        <span className="font-semibold text-emerald-600">
                          You selected {reviewRating} star
                          {reviewRating > 1 ? "s" : ""}
                        </span>
                      ) : (
                        "Select your rating"
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      rows="4"
                      placeholder="Share more details about your experience..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={handleCloseReview}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                      disabled={submittingReview}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      disabled={submittingReview || !reviewRating}
                      className={`flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-xl transition-all ${
                        submittingReview || !reviewRating
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:opacity-90"
                      }`}
                    >
                      {submittingReview ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* View Review Modal */}
      {showViewReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
              <h2 className="text-2xl font-bold">Your Review</h2>
              <p className="text-amber-100 mt-1">
                {selectedBooking.stationName || "EV Charging Station"}
              </p>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <StarRatingDisplay rating={reviewRating} />
                </div>
                
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your Comment:
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-gray-700">
                      {reviewComment || "No additional comment provided"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-left text-sm text-gray-500">
                  <p>
                    <span className="font-medium">Booking Date:</span>{" "}
                    {selectedBooking.date || "N/A"}
                  </p>
                  <p className="mt-1">
                    <span className="font-medium">Review Date:</span>{" "}
                    {userReviews.find(r => r.bookingId === (selectedBooking.id || selectedBooking.bookingId))?.reviewDate?.split('T')[0] || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleCloseReview}
                  className="py-3 px-8 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="pl-24 pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              My Bookings
            </h1>
            <p className="text-xl text-gray-600">
              Track and manage your charging reservations
            </p>
            <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2">
              <FaShieldAlt className="text-purple-600" />
              Bookings with shield are permanently verified on blockchain
            </p>
          </motion.div>

          {success && (
            <motion.div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4 text-emerald-700 shadow-lg">
              <CheckCircle className="w-8 h-8" />
              {success}
            </motion.div>
          )}
          {error && !showReviewModal && !showViewReviewModal && (
            <motion.div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4 text-red-700 shadow-lg">
              <AlertCircle className="w-8 h-8" />
              {error}
            </motion.div>
          )}

          {loading || loadingBC || loadingReviews ? (
            <div className="text-center py-32">
              <Loader2 className="w-20 h-20 text-emerald-500 animate-spin mx-auto" />
              <p className="text-xl text-gray-600 mt-6">
                Loading your bookings...
              </p>
              {loadingBC && (
                <p className="text-sm text-purple-600 mt-2">
                  Checking blockchain records...
                </p>
              )}
              {loadingReviews && (
                <p className="text-sm text-amber-600 mt-2">
                  Loading your reviews...
                </p>
              )}
            </div>
          ) : allBookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-24 text-center border-2 border-dashed border-emerald-200 shadow-xl"
            >
              <Calendar className="w-28 h-28 text-emerald-200 mx-auto mb-8" />
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                No Bookings Yet
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                You haven't booked any charging slot
              </p>
              <a
                href="/user/book-slot"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-emerald-400 transition-all"
              >
                <Zap className="w-8 h-8" />
                Book Your First Slot
              </a>
            </motion.div>
          ) : (
            <div className="grid gap-8">
              {allBookings.map((booking, i) => {
                const bookingId = booking.id || booking.bookingId;
                const alreadyReviewed = hasReview(bookingId);
                const review = getReviewForBooking(bookingId);
                
                return (
                  <motion.div
                    key={booking.id || `booking-${i}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden hover:shadow-3xl transition-all relative"
                  >
                    {booking.isBlockchainVerified && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg font-bold text-sm">
                          <FaShieldAlt className="w-5 h-5" />
                          Verified on Blockchain
                        </div>
                      </div>
                    )}

                    {alreadyReviewed && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg font-bold text-sm">
                          <Star className="w-4 h-4" />
                          Reviewed
                        </div>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-8 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-3xl font-black mb-2">
                            {booking.station?.stationName ||
                              booking.stationName ||
                              "EV Charging Station"}
                          </h3>
                          <div className="flex flex-wrap gap-6 text-emerald-100">
                            <span className="flex items-center gap-2">
                              <MapPin className="w-5 h-5" />
                              {booking.station?.location?.name ||
                                booking.locationName ||
                                "SmartEV Network"}
                            </span>
                            <span className="flex items-center gap-2">
                              <BatteryCharging className="w-5 h-5" />
                              {booking.chargerNumber || "Charger N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm opacity-90">Booking ID</p>
                          <p className="text-2xl font-black">
                            {booking.isBlockchainVerified
                              ? `BC-${booking.bookingId || booking.id || "N/A"}`
                              : `#${booking.id || booking.bookingId || "N/A"}`}
                          </p>
                          {booking.isBlockchainVerified && (
                            <p className="text-xs opacity-75 mt-1">
                              Blockchain Verified
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Date</p>
                            <p className="text-2xl font-black text-gray-900">
                              {booking.date || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <Clock className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Time Slot</p>
                            <p className="text-2xl font-black text-gray-900">
                              {booking.startTime || "N/A"} -{" "}
                              {booking.endTime || "60 min"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {["booked", "confirmed"].includes(
                              booking.status?.toLowerCase()
                            ) ? (
                              <CheckCircle className="w-8 h-8 text-emerald-700" />
                            ) : booking.status?.toLowerCase() === "completed" ? (
                              <CheckCircle className="w-8 h-8 text-blue-700" />
                            ) : (
                              <XCircle className="w-8 h-8 text-red-700" />
                            )}
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Status</p>
                            <p
                              className={`text-2xl font-black capitalize ${
                                ["booked", "confirmed"].includes(
                                  booking.status?.toLowerCase()
                                )
                                  ? "text-emerald-700"
                                  : booking.status?.toLowerCase() === "completed"
                                  ? "text-blue-700"
                                  : "text-red-700"
                              }`}
                            >
                              {booking.status || "Confirmed"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                            alreadyReviewed 
                              ? "bg-green-100" 
                              : "bg-amber-100"
                          }`}>
                            {alreadyReviewed ? (
                              <CheckCircle className="w-8 h-8 text-green-600" />
                            ) : (
                              <Star className="w-8 h-8 text-amber-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Feedback</p>
                            {alreadyReviewed ? (
                              <button
                                onClick={() => handleViewReview(booking)}
                                className="text-2xl font-black text-green-600 hover:text-green-700 transition-colors flex items-center gap-2"
                              >
                                <Eye className="w-6 h-6" />
                                View Review
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenReview(booking)}
                                className="text-2xl font-black text-amber-600 hover:text-amber-700 transition-colors"
                                disabled={!["completed", "confirmed", "booked"].includes(booking.status?.toLowerCase())}
                              >
                                Give Review
                              </button>
                            )}
                            {alreadyReviewed && review && (
                              <div className="mt-2">
                                <StarRatingDisplay rating={review.rating} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {booking.amount && (
                        <div className="mt-6 text-right">
                          <p className="text-lg text-gray-600">Amount Paid</p>
                          <p className="text-3xl font-bold text-emerald-600">
                            ₹{booking.amount}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}