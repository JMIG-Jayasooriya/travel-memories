package com.travelmemories.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TripDtos {

    public record TripRequest(
        @NotBlank String name,
        @NotBlank String destination,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        String coverPhotoUrl,
        String description,
        @NotBlank String travelType,
        @PositiveOrZero BigDecimal budget,
        boolean favourite
    ) {}
}
