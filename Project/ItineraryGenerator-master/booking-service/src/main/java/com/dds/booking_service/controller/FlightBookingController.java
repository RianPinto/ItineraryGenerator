package com.dds.booking_service.controller;

import com.dds.booking_service.model.*;
import com.dds.booking_service.service.FlightBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flight")
public class FlightBookingController {

    @Autowired
    private FlightBookingService flightBookingService;

    @PostMapping("/search")
    public FlightBookingResponse searchFlights(@RequestBody FlightBookingRequest request) {
        return flightBookingService.searchFlights(request);
    }
}
