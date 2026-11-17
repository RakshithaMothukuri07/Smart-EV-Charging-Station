package com.project.smartEV.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Slot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status = "AVAILABLE"; // AVAILABLE, BOOKED

    @ManyToOne
    @JoinColumn(name = "station_id")
    private ChargingStation station;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User bookedBy; // null if available

    private Integer chargerNumber; // e.g., Charger 1, Charger 2, etc.
    private String chargerType; // e.g., "DC Fast 50kW"
}