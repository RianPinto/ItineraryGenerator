package com.dds.destination_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dds.destination_service.model.*;


import java.util.List;

public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {
    List<Itinerary> findByUserId(Long userId);
}