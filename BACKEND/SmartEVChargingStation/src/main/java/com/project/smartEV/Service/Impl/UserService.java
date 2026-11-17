package com.project.smartEV.Service.Impl;

import com.project.smartEV.Entity.*;
import com.project.smartEV.Repository.*;
import com.project.smartEV.Service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository repo;
    @Autowired
    private CityRepository cityRepo;
    @Autowired
    private LocationRepository locationRepo;
    @Autowired
    private ChargingStationRepository stationRepo;
    @Autowired
    private SlotRepository slotRepo;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public User registerTheUser(User user) {
        Optional<User> presentUser = repo.findByEmail(user.getEmail());
        if (presentUser.isPresent()) {
            throw new RuntimeException("User already present with this email! please login");
        } else {
            return repo.save(user);
        }
    }

    @Override
    public Optional<User> loginTheUser(String email, String password) {
        Optional<User> presentUser = repo.findByEmail(email);
        if (presentUser.isEmpty() || !encoder.matches(password, presentUser.get().getPassword())) {
            throw new RuntimeException("Invalid email or password");
        } else {
            return presentUser;
        }
    }

    @Override
    public Optional<User> getProfileById(Long userId) {
        Optional<User> presentProfile = repo.findById(userId);
        if (presentProfile.isEmpty()) {
            throw new RuntimeException("No user found with the provided id : " + userId);
        } else {
            return presentProfile;
        }
    }

    @Override
    public User updateUserProfile(User user, Long userId) {
        Optional<User> presentProfile = repo.findById(userId);
        if (presentProfile.isEmpty()) {
            throw new RuntimeException("No user found to update the profile with id : " + userId);
        } else {
            User needToUpdate = presentProfile.get();
            needToUpdate.setUsername(user.getUsername());
            needToUpdate.setEmail(user.getEmail());

            // Only update password if it's provided and not empty
            if (user.getPassword() != null && !user.getPassword().trim().isEmpty()) {
                System.out.println("UPDATING PASSWORD - Encoding new password");
                needToUpdate.setPassword(encoder.encode(user.getPassword()));
            } else {
                System.out.println("KEEPING CURRENT PASSWORD - No update needed");
                // Explicitly do nothing to keep current password
            }

            System.out.println("Final password in DB will be: " + (user.getPassword() != null && !user.getPassword().trim().isEmpty() ? "NEW" : "CURRENT"));
            System.out.println("=== END DEBUG ===");

            return repo.save(needToUpdate);
        }
    }

    @Override
    public User forgotPasswordOfUser(String email, String encodedPassword) {
        Optional<User> presentEmail = repo.findByEmail(email);
        if (presentEmail.isEmpty()) {
            throw new RuntimeException("No user found to update the password");
        } else {
            User needToUpdate = presentEmail.get();
            needToUpdate.setPassword(encodedPassword);
            return repo.save(needToUpdate);
        }
    }

    @Override
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public void deleteUser(Long userId) {
        User user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        repo.delete(user);
    }

    @Override
    public List<City> getAllCities() {
        return cityRepo.findAll();
    }

    @Override
    public List<Location> getLocationsByCityId(Long cityId) {
        return locationRepo.findByCityId(cityId);
    }

    @Override
    public List<ChargingStation> getStationsByLocationId(Long locationId) {
        return stationRepo.findByLocationId(locationId);
    }

    @Override
    public List<Slot> getAvailableSlots(Long stationId, String dateStr) {
        LocalDate date = LocalDate.parse(dateStr);
        return slotRepo.findByStationIdAndDateAndStatus(stationId, date, "AVAILABLE");
    }

    @Override
    public Slot bookSlot(Long slotId, Long userId) {
        Slot slot = slotRepo.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!"AVAILABLE".equals(slot.getStatus())) {
            throw new RuntimeException("Slot is already booked!");
        }

        User user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        slot.setStatus("BOOKED");
        slot.setBookedBy(user);
        return slotRepo.save(slot);
    }

    @Override
    public List<Slot> getMyBookings(Long userId) {
        return slotRepo.findByBookedById(userId);
    }

    @Override
    public City saveCity(City city) {
        return cityRepo.save(city);
    }

    @Override
    public void deleteCity(Long id) {
        cityRepo.deleteById(id);
    }

    @Override
    public Location saveLocation(Location location) {
        return locationRepo.save(location);
    }

    @Override
    public void deleteLocation(Long id) {
        locationRepo.deleteById(id);
    }

    @Override
    public ChargingStation saveStation(ChargingStation station) {
        return stationRepo.save(station);
    }

    @Override
    public void deleteStation(Long id) {
        stationRepo.deleteById(id);
    }

    //for random slots creating
//    @Override
//    public List<Slot> generateSlotsForStation(Long stationId, String dateStr, int durationMinutes) {
//        if (durationMinutes <= 0 || durationMinutes > 480) {
//            throw new IllegalArgumentException("Duration must be 1–480 minutes");
//        }
//
//        ChargingStation station = stationRepo.findById(stationId)
//                .orElseThrow(() -> new RuntimeException("Station not found"));
//
//        LocalDate date = LocalDate.parse(dateStr);
//
//        // Prevent duplicate generation
//        if (slotRepo.countByStationIdAndDate(stationId, date) > 0) {
//            throw new RuntimeException("Slots already generated for this date");
//        }
//
//        List<Slot> slots = new ArrayList<>();
//        int totalChargers = station.getTotalSlots(); // e.g., 6 or 10
//
//        // Create only as many slots as physical chargers
//        for (int i = 1; i <= totalChargers; i++) {
//            Slot slot = new Slot();
//            slot.setDate(date);
//            slot.setChargerNumber(i);           // ← HERE: Charger 1, 2, 3...
//            slot.setStartTime(null);            // User will set time when booking
//            slot.setEndTime(null);              // Will be calculated
//            slot.setStatus("AVAILABLE");
//            slot.setStation(station);
//            slot.setBookedBy(null);
//            slots.add(slot);
//        }
//
//        return slotRepo.saveAll(slots);
//    }


    // ONLY 10 SLOTS (Fixed – as you want)
    @Override
    public List<Slot> generateSlotsForStation(Long stationId, String dateStr, int durationMinutes) {
        ChargingStation station = stationRepo.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found"));

        LocalDate date = LocalDate.parse(dateStr);

        // Prevent duplicates
        if (slotRepo.countByStationIdAndDate(stationId, date) > 0) {
            throw new RuntimeException("Slots already generated for this date!");
        }

        List<Slot> slots = new ArrayList<>();

        // ONLY 10 SLOTS (Fixed – as you want)
        for (int i = 1; i <= 10; i++) {
            Slot slot = new Slot();
            slot.setDate(date);
            slot.setChargerNumber(i);
            slot.setStartTime(null);   // User will set this when booking
            slot.setEndTime(null);     // Will be calculated
            slot.setStatus("AVAILABLE");
            slot.setStation(station);
            slot.setBookedBy(null);
            slot.setChargerType(station.getChargerType());
            slots.add(slot);
        }

        return slotRepo.saveAll(slots);
    }

    @Override
    public void deleteSlot(Long slotId) {
        slotRepo.deleteById(slotId);
    }

    @Override
    public ChargingStation getStationWithId(Long id) {
        Optional<ChargingStation> presentStation = stationRepo.findById(id);
        if(presentStation.isEmpty()){
            throw new RuntimeException("No station found");
        }
        else {
            return presentStation.get();
        }
    }

    @Override
    public List<Booking> getStationReviews(Long stationId) {
        return bookingRepository.findBySlot_Station_IdAndRatingIsNotNull(stationId);
    }
}
