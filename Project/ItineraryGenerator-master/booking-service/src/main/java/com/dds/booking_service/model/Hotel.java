package com.dds.booking_service.model;

import lombok.Data;
import java.util.List;

@Data
public class Hotel {
    private String name;
    private String thumbnailUrl;
    private String rating;       
    private String pricePerNight;
    private List<String> amenities; 
}
