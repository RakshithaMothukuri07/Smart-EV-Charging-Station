package com.project.smartEV.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Slot slot;

    @ManyToOne
    private User user;

    private Double amount;
    private int durationMinutes;
    private String status; // PENDING_PAYMENT, PAID, CANCELLED
    private LocalDateTime bookingTime;


    private Integer rating; // Changed from Long to Integer, 1-5 stars
    private String reviewComment; // Added for review text
    private LocalDateTime reviewDate; // Added for when review was given
}
