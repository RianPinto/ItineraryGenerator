package com.dds.destination_service.model;

import lombok.Data;

@Data
public class DayItinerary {
    private String day;
    private Activity morning;
    private Activity afternoon;
    private Activity evening;
}
