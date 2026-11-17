package com.project.smartEV.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
    private Long bookingId;
    private Long userId;
    private Long stationId;
    private String stationName;
    private Integer rating;
    private String comment;
    private LocalDateTime reviewDate;
}
