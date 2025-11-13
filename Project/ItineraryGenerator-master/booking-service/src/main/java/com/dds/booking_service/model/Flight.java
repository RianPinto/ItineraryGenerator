package com.dds.booking_service.model;

import lombok.Data;

@Data
public class Flight {
    String airline;
    String airplane;
    String airlineLogo;
    String travelClass;
    String duration;
    String flightNumber;
}
