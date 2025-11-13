package com.dds.booking_service.controller;

import com.dds.booking_service.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.dds.booking_service.service.HotelBookingService;

@RestController
@RequestMapping("/api/hotel")
public class HotelBookingController {

    @Autowired
    private HotelBookingService hotelBookingService;

    @PostMapping("/search")
    public HotelBookingResponse bookHotel(@RequestBody HotelBookingRequest request) {
        return hotelBookingService.searchHotels(request);
    }
}
