package com.dds.itinerary_service.model;

import lombok.Data;

@Data
public class RepeatRequest {
    private Long itineraryId;
    private String item;
}

