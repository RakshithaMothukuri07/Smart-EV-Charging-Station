package com.project.smartEV.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest {
    private Long bookingId;  // Changed from userId to bookingId
    private Integer rating;  // 1-5 stars
    private String comment;
}
