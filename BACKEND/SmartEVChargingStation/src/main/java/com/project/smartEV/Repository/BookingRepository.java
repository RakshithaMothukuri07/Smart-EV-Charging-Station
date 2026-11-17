package com.project.smartEV.Repository;

import com.project.smartEV.Entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking,Long> {

    List<Booking> findByUserId(Long userId);

    @Query("SELECT b FROM Booking b JOIN b.slot s WHERE s.station.id = :stationId AND b.rating IS NOT NULL")
    List<Booking> findBySlot_Station_IdAndRatingIsNotNull(@Param("stationId") Long stationId);

    // Alternative query method
    List<Booking> findBySlot_Station_IdAndRatingNotNull(Long stationId);
}
