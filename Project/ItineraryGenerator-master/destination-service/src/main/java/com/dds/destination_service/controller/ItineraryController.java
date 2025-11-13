package com.dds.destination_service.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import com.dds.destination_service.model.*;
import com.dds.destination_service.service.ItineraryService;
import com.dds.destination_service.repository.ItineraryRepository;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/destination")
public class ItineraryController {

    private final ItineraryService itineraryService;
    private final ItineraryRepository itineraryRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ItineraryController(ItineraryService itineraryService, ItineraryRepository itineraryRepository) {
        this.itineraryService = itineraryService;
        this.itineraryRepository = itineraryRepository;
    }

    @PostMapping("/generate")
    public ItineraryResponse generateItinerary(@RequestBody ItineraryRequest request) {
        return itineraryService.generateItinerary(request);
    }

    @PostMapping("/save/{userId}")
    public ResponseEntity<Itinerary> saveItinerary(
            @PathVariable Long userId,
            @RequestBody ItinerarySave itineraryJson
    ) {
        Itinerary saved = itineraryService.saveItinerary(userId, itineraryJson);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/get/{userId}")
    public List<ItinerarySave> getItinerariesByUser(@PathVariable Long userId) {
        List<Itinerary> list = itineraryRepository.findByUserId(userId);

        return list.stream()
                .map(it -> objectMapper.convertValue(it.getItineraryJson(), ItinerarySave.class))
                .collect(Collectors.toList());
    }

}
