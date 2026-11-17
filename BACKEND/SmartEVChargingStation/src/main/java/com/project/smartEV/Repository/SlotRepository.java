package com.project.smartEV.Repository;

import com.project.smartEV.Entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SlotRepository extends JpaRepository<Slot,Long> {
    List<Slot> findByStationIdAndDateAndStatus(Long stationId, LocalDate date, String available);

    List<Slot> findByBookedById(Long userId);

    int countByStationIdAndDate(Long stationId, LocalDate date);


    @Query("SELECT s FROM Slot s WHERE s.status = 'BOOKED' ORDER BY s.date DESC, s.startTime DESC")
    List<Slot> findAllBookedSlots();
}
