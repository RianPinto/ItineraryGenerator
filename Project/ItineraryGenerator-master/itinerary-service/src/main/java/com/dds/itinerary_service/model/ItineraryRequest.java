package com.dds.itinerary_service.model;

import lombok.Data;

@Data
public class ItineraryRequest {

    private Long userId;
    private String hotel;
    private Double hotelAmount;
    private String flight;
    private Double flightAmount;
    private Double destinationId;
    

}
