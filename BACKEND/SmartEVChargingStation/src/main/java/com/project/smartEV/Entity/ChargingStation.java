package com.project.smartEV.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChargingStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stationName;
    private String address;
    private int totalSlots;
    private Double latitude;
    private Double longitude;
    private String status = "ACTIVE";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false)
    private String chargerType = "AC Type 2"; // or "DC Fast", "CCS", etc.

    private Double pricePerHour = 150.0; // ₹150/hour
}