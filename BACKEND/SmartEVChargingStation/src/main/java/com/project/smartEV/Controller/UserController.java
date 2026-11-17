package com.project.smartEV.Controller;

import com.project.smartEV.DTO.BookingRequest;
import com.project.smartEV.DTO.ReviewRequest;
import com.project.smartEV.Entity.*;
import com.project.smartEV.Repository.BookingRepository;
import com.project.smartEV.Repository.SlotRepository;
import com.project.smartEV.Repository.UserRepository;
import com.project.smartEV.Service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private IUserService service;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private SlotRepository slotRepo;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private BookingRepository bookingRepo;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            user.setRole("USER");
            user.setPassword(encoder.encode(user.getPassword()));
            User registeredUser = service.registerTheUser(user);
            response.put("msg", "User registered successfully");
            response.put("User", registeredUser);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.put("Error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Optional<User> loggedUser = service.loginTheUser(email, password);
            response.put("msg", "User logged in successfully");
            response.put("UserId", loggedUser.get().getId());
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.put("Error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Optional<User> userProfile = service.getProfileById(userId);
            response.put("msg", "User profile fetched successfully");
            response.put("User profile", userProfile);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.put("Error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/update-profile/{userId}")
    public ResponseEntity<?> updateProfile(@RequestBody User user, @PathVariable Long userId) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            User updatedUser = service.updateUserProfile(user, userId);
            response.put("msg", "User profile updated successfully");
            response.put("UpdatedProfile", updatedUser);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.put("Error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email,@RequestParam String password){
        HashMap<String,Object> response = new HashMap<>();
        try{
            String encodedPassword = encoder.encode(password);
            User updatedPassword = service.forgotPasswordOfUser(email,encodedPassword);
            response.put("msg","User password updated successfully");
            response.put("Updated password",updatedPassword);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }
        catch (Exception e){
            response.put("Error",e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/cities")
    public ResponseEntity<?> getAllCities() {
        HashMap<String, Object> res = new HashMap<String, Object>();
        try {
            List<City> cities = service.getAllCities();
            res.put("msg", "Cities fetched successfully");
            res.put("cities", cities);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
    }

    @GetMapping("/locations/{cityId}")
    public ResponseEntity<?> getLocationsByCity(@PathVariable Long cityId) {
        HashMap<String, Object> res = new HashMap<String, Object>();
        try {
            List<Location> locations = service.getLocationsByCityId(cityId);
            res.put("msg", "Locations fetched");
            res.put("locations", locations);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
    }

    @GetMapping("/stations/{locationId}")
    public ResponseEntity<?> getStationsByLocation(@PathVariable Long locationId) {
        HashMap<String, Object> res = new HashMap<String, Object>();
        try {
            List<ChargingStation> stations = service.getStationsByLocationId(locationId);
            res.put("msg", "Stations fetched");
            res.put("stations", stations);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
    }

    @GetMapping("/slots/{stationId}")
    public ResponseEntity<?> getAvailableSlots(
            @PathVariable Long stationId,
            @RequestParam String date) { // YYYY-MM-DD
        HashMap<String, Object> res = new HashMap<String, Object>();
        try {
            List<Slot> slots = service.getAvailableSlots(stationId, date);
            res.put("msg", "Available slots fetched");
            res.put("slots", slots);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
    }

    @GetMapping("/station/{id}")
    public ResponseEntity<?> getStationById(@PathVariable Long id)  {
        HashMap<String, Object> res = new HashMap<String, Object>();
        try {
            ChargingStation station = service.getStationWithId(id);
            res.put("msg", "Your stations");
            res.put("station", station);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
    }

    @PostMapping("/book-slot")
    public ResponseEntity<?> bookSlot(@RequestBody BookingRequest request) {
        try {
            // 1. Validate Slot
            Slot slot = slotRepo.findById(request.getSlotId())
                    .orElseThrow(() -> new RuntimeException("Slot not found"));

            if (!"AVAILABLE".equals(slot.getStatus())) {
                throw new RuntimeException("This slot is already booked!");
            }

            // 2. Validate User
            User user = userRepo.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 3. Get Station to calculate price & charger type
            ChargingStation station = slot.getStation();
            if (station == null) {
                throw new RuntimeException("Station not linked to this slot");
            }

            // 4. Parse time
            LocalTime startTime = LocalTime.parse(request.getStartTime());
            LocalTime endTime = startTime.plusMinutes(request.getDurationMinutes());

            // 5. Calculate Payment Amount
            double pricePerHour = station.getPricePerHour() != null ? station.getPricePerHour() : 150.0; // fallback
            double durationHours = request.getDurationMinutes() / 60.0;
            double amount = pricePerHour * durationHours;

            // 6. Update Slot
            slot.setStatus("BOOKED");
            slot.setBookedBy(user);
            slot.setStartTime(startTime);
            slot.setEndTime(endTime);
            slotRepo.save(slot);

            // 7. Create Booking Record (Optional - Recommended)
            Booking booking = new Booking();
            booking.setSlot(slot);
            booking.setUser(user);
            booking.setAmount(amount);
            booking.setDurationMinutes(request.getDurationMinutes());
            booking.setStatus("CONFIRMED"); // or "CONFIRMED" after payment
            booking.setBookingTime(LocalDateTime.now());
            bookingRepo.save(booking);

            // 8. Return Booking + Payment Info
            Map<String, Object> response = new HashMap<>();
            response.put("msg", "Slot reserved successfully!");
            response.put("bookingId", booking.getId());
            response.put("amount", amount);
            response.put("currency", "INR");
            response.put("chargerType", station.getChargerType() != null ? station.getChargerType() : "AC Type 2");
            response.put("stationName", station.getStationName());
            response.put("startTime", startTime.toString());
            response.put("endTime", endTime.toString());
            response.put("chargerNumber", slot.getChargerNumber());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-bookings/{userId}")
    public ResponseEntity<?> getMyBookings(@PathVariable Long userId) {
        HashMap<String, Object> res = new HashMap<String, Object>();
        try {
            List<Slot> bookings = service.getMyBookings(userId);
            res.put("msg", "Your bookings");
            res.put("bookings", bookings);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
    }


        // ... (existing autowired dependencies remain same)

        // Add the review/feedback endpoint
        @PostMapping("/submit-review")
        public ResponseEntity<?> submitReview(@RequestBody ReviewRequest reviewRequest) {
            HashMap<String, Object> response = new HashMap<>();
            try {
                // 1. Validate rating range
                if (reviewRequest.getRating() < 1 || reviewRequest.getRating() > 5) {
                    throw new RuntimeException("Rating must be between 1 and 5 stars");
                }

                // 2. Find the booking
                Booking booking = bookingRepo.findById(reviewRequest.getBookingId())
                        .orElseThrow(() -> new RuntimeException("Booking not found"));

//                // 3. Check if booking is completed
//                if (!"CONFIRMED".equals(booking.getStatus()) && !"BOOKED".equals(booking.getStatus())) {
//                    throw new RuntimeException("You can only review completed bookings");
//                }

                // 4. Check if already reviewed
                if (booking.getRating() != null) {
                    throw new RuntimeException("You have already submitted a review for this booking");
                }

                // 5. Update booking with review
                booking.setRating(reviewRequest.getRating());
                booking.setReviewComment(reviewRequest.getComment());
                booking.setReviewDate(LocalDateTime.now());

//                // Update booking status if needed
                if ("CONFIRMED".equals(booking.getStatus())) {
                    booking.setStatus("CONFIRMED");
                }

                bookingRepo.save(booking);

                // 6. Prepare response
                response.put("msg", "Review submitted successfully");
                response.put("bookingId", booking.getId());
                response.put("rating", booking.getRating());
                response.put("comment", booking.getReviewComment());
                response.put("reviewDate", booking.getReviewDate());

                return ResponseEntity.status(HttpStatus.OK).body(response);

            } catch (Exception e) {
                response.put("error", e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        }

        // API to get reviews for a station
        @GetMapping("/station-reviews/{stationId}")
        public ResponseEntity<?> getStationReviews(@PathVariable Long stationId) {
            HashMap<String, Object> response = new HashMap<>();
            try {
                List<Booking> reviews = service.getStationReviews(stationId);
                List<Map<String, Object>> reviewList = reviews.stream()
                        .filter(b -> b.getRating() != null)
                        .map(b -> {
                            Map<String, Object> reviewMap = new HashMap<>();
                            reviewMap.put("bookingId", b.getId());
                            reviewMap.put("userId", b.getUser().getId());
                            reviewMap.put("userName", b.getUser().getUsername()); // Assuming User has getUsername()
                            reviewMap.put("rating", b.getRating());
                            reviewMap.put("comment", b.getReviewComment());
                            reviewMap.put("reviewDate", b.getReviewDate());
                            reviewMap.put("stationName", b.getSlot().getStation().getStationName());
                            return reviewMap;
                        })
                        .toList();

                // Calculate average rating
                double averageRating = reviews.stream()
                        .filter(b -> b.getRating() != null)
                        .mapToInt(Booking::getRating)
                        .average()
                        .orElse(0.0);

                response.put("msg", "Reviews fetched successfully");
                response.put("reviews", reviewList);
                response.put("totalReviews", reviewList.size());
                response.put("averageRating", Math.round(averageRating * 10.0) / 10.0);

                return ResponseEntity.status(HttpStatus.OK).body(response);

            } catch (Exception e) {
                response.put("error", e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        }

        // API to get user's reviews
        @GetMapping("/my-reviews/{userId}")
        public ResponseEntity<?> getUserReviews(@PathVariable Long userId) {
            HashMap<String, Object> response = new HashMap<>();
            try {
                List<Booking> userBookings = bookingRepo.findByUserId(userId);
                List<Map<String, Object>> reviews = userBookings.stream()
                        .filter(b -> b.getRating() != null)
                        .map(b -> {
                            Map<String, Object> reviewMap = new HashMap<>();
                            reviewMap.put("bookingId", b.getId());
                            reviewMap.put("stationId", b.getSlot().getStation().getId());
                            reviewMap.put("stationName", b.getSlot().getStation().getStationName());
                            reviewMap.put("rating", b.getRating());
                            reviewMap.put("comment", b.getReviewComment());
                            reviewMap.put("reviewDate", b.getReviewDate());
                            reviewMap.put("bookingDate", b.getBookingTime());
                            return reviewMap;
                        })
                        .toList();

                response.put("msg", "Your reviews fetched successfully");
                response.put("reviews", reviews);
                response.put("totalReviews", reviews.size());

                return ResponseEntity.status(HttpStatus.OK).body(response);

            } catch (Exception e) {
                response.put("error", e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        }

        // ... (rest of your existing methods remain same)


}
