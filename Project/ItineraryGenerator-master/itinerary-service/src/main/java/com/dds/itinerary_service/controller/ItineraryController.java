package com.dds.itinerary_service.controller;

import com.dds.itinerary_service.service.ItineraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.dds.itinerary_service.model.*;
import java.util.List;

@RestController
@RequestMapping("/api/itinerary/")
public class ItineraryController {

    @Autowired
    private ItineraryService itineraryService;

    @PostMapping("/confirm")
    public Itinerary confirm(@RequestBody ItineraryRequest request) {
        return itineraryService.confirm(request);
    }

    @GetMapping("/history/{userId}")
    public List<Itinerary> getPaymentHistory(@PathVariable Long userId) {
        return itineraryService.getHistory(userId);
    }

    @PostMapping("/tryagain")
    public RepeatResponse tryagain(@RequestBody RepeatRequest request) {
        return itineraryService.tryagain(request);
    }



}
