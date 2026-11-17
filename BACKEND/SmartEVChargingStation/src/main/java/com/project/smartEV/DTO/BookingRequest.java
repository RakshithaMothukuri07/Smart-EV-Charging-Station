package com.project.smartEV.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long slotId;
    private Long userId;
    private String startTime; // e.g., "14:30"
    private int durationMinutes; // e.g., 60
}
