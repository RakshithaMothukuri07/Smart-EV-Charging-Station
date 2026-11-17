package com.project.smartEV.Repository;

import com.project.smartEV.Entity.ChargingStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChargingStationRepository extends JpaRepository<ChargingStation,Long> {
    List<ChargingStation> findByLocationId(Long locationId);
}
