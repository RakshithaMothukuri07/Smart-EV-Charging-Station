package com.project.smartEV.Service;


import com.project.smartEV.Entity.*;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    User registerTheUser(User user);
    Optional<User> loginTheUser(String email, String password);
    Optional<User> getProfileById(Long userId);
    User updateUserProfile(User user, Long userId);
    User forgotPasswordOfUser(String email, String encodedPassword);
    List<User> getAllUsers();
    void deleteUser(Long userId);

    List<City> getAllCities();
    List<Location> getLocationsByCityId(Long cityId);
    List<ChargingStation> getStationsByLocationId(Long locationId);
    List<Slot> getAvailableSlots(Long stationId, String dateStr); // date format: YYYY-MM-DD
    Slot bookSlot(Long slotId, Long userId);
    List<Slot> getMyBookings(Long userId);

    City saveCity(City city);

    void deleteCity(Long id);

    Location saveLocation(Location location);

    void deleteLocation(Long id);

    ChargingStation saveStation(ChargingStation station);

    void deleteStation(Long id);

    List<Slot> generateSlotsForStation(Long stationId, String date, int slotDurationMinutes);

    void deleteSlot(Long slotId);

    ChargingStation getStationWithId(Long id);

    List<Booking> getStationReviews(Long stationId);
}
