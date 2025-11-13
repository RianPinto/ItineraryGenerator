package com.dds.destination_service.model;

import lombok.Data;
import java.util.List;

@Data
public class ItineraryResponse {
    private List<DayItinerary> itinerary;
}



