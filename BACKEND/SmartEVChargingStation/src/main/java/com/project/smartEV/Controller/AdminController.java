package com.project.smartEV.Controller;

import com.project.smartEV.DTO.LoginRequestDto;
import com.project.smartEV.Entity.*;
import com.project.smartEV.Repository.ChargingStationRepository;
import com.project.smartEV.Repository.LocationRepository;
import com.project.smartEV.Repository.SlotRepository;
import com.project.smartEV.Service.IAdminService;
import com.project.smartEV.Service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private IAdminService adminService;

    @Autowired
    private IUserService userService;

    @Autowired
    private LocationRepository locationRepo;

    @Autowired
    private ChargingStationRepository stationRepo;

    @Autowired
    private SlotRepository slotRepo;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto dto) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Admin admin = adminService.authenticate(dto);
            response.put("status", "success");
            response.put("message", "Login successful");
            response.put("data", admin);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        var res = new HashMap<String, Object>();
        try {
            List<User> users = userService.getAllUsers();
            res.put("msg", "All users fetched successfully");
            res.put("users", users);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        var res = new HashMap<String, Object>();
        try {
            userService.deleteUser(userId); // Add this method in UserService
            res.put("msg", "User deleted successfully");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    // ================== CITY MANAGEMENT ==================

    @PostMapping("/cities")
    public ResponseEntity<?> addCity(@RequestBody City city) {
        HashMap<String, Object> res = new HashMap<String, Object>();
        try {
            City saved = userService.saveCity(city);
            res.put("msg", "City added successfully");
            res.put("city", saved);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    @GetMapping("/cities")
    public ResponseEntity<?> getAllCities() {
        var res = new HashMap<String, Object>();
        try {
            List<City> cities = userService.getAllCities();
            res.put("msg", "All cities");
            res.put("cities", cities);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    @PutMapping("/cities/{id}")
    public ResponseEntity<?> updateCity(@PathVariable Long id, @RequestBody City city) {
        HashMap<String, Object> res = new HashMap<String, Object>();
        try {
            city.setId(id);
            City updated = userService.saveCity(city);
            res.put("msg", "City updated");
            res.put("city", updated);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    @DeleteMapping("/cities/{id}")
    public ResponseEntity<?> deleteCity(@PathVariable Long id) {
        HashMap<String, Object> res = new HashMap<String, Object>();
        try {
            userService.deleteCity(id);
            res.put("msg", "City deleted successfully");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    // ================== LOCATION MANAGEMENT ==================
    @PostMapping("/locations")
    public ResponseEntity<?> addLocation(@RequestBody Location location) {
        HashMap<String, Object> res = new HashMap<String, Object>();
        try {
            Location saved = userService.saveLocation(location);
            res.put("msg", "Location added");
            res.put("location", saved);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    @GetMapping("/locations")
    public ResponseEntity<?> getLocations() {
        HashMap<String, Object> res = new HashMap<String, Object>();
        try {
            List<Location> locations = locationRepo.findAll();
            res.put("msg", "Locations fetched successfully");
            res.put("location", locations);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    @DeleteMapping("/locations/{id}")
    public ResponseEntity<?> deleteLocation(@PathVariable Long id) {
        var res = new HashMap<String, Object>();
        try {
            userService.deleteLocation(id);
            res.put("msg", "Location deleted");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    // ================== CHARGING STATION MANAGEMENT ==================
    @PostMapping("/stations")
    public ResponseEntity<?> addStation(@RequestBody ChargingStation station) {
        var res = new HashMap<String, Object>();
        try {
            ChargingStation saved = userService.saveStation(station);
            res.put("msg", "Station added successfully");
            res.put("station", saved);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    @GetMapping("/stations")
    public ResponseEntity<?> getStation() {
        var res = new HashMap<String, Object>();
        try {
            List<ChargingStation> stations = stationRepo.findAll();
            res.put("msg", "Station fetched successfully");
            res.put("stations", stations);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    @PutMapping("/stations/{id}")
    public ResponseEntity<?> updateStation(@PathVariable Long id, @RequestBody ChargingStation station) {
        var res = new HashMap<String, Object>();
        try {
            station.setId(id);
            ChargingStation updated = userService.saveStation(station);
            res.put("msg", "Station updated");
            res.put("station", updated);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    @DeleteMapping("/stations/{id}")
    public ResponseEntity<?> deleteStation(@PathVariable Long id) {
        var res = new HashMap<String, Object>();
        try {
            userService.deleteStation(id);
            res.put("msg", "Station deleted");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    // ================== SLOT MANAGEMENT (BULK CREATE FOR A DAY) ==================
    @PostMapping("/stations/{stationId}/generate-slots")
    public ResponseEntity<?> generateDailySlots(
            @PathVariable Long stationId,
            @RequestParam String date, // YYYY-MM-DD
            @RequestParam int slotDurationMinutes) { // e.g., 60

        var res = new HashMap<String, Object>();
        try {
            List<Slot> slots = userService.generateSlotsForStation(stationId, date, slotDurationMinutes);
            res.put("msg", slots.size() + " slots created for " + date);
            res.put("slots", slots);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    @DeleteMapping("/slots/{slotId}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long slotId) {
        var res = new HashMap<String, Object>();
        try {
            userService.deleteSlot(slotId);
            res.put("msg", "Slot deleted");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    // AdminController.java - ADD THIS ENDPOINT
    @GetMapping("/bookings/all")
    public ResponseEntity<?> getAllBookedSlots() {
        var res = new HashMap<String, Object>();
        try {
            List<Slot> bookedSlots = slotRepo.findAllBookedSlots(); // Use the query above

            res.put("msg", "All booked slots fetched successfully");
            res.put("bookings", bookedSlots);
            res.put("total", bookedSlots.size());

            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }
}
