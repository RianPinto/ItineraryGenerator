package com.dds.destination_service.model;

import lombok.Data;
import java.sql.Date;
import java.util.List;

@Data
public class ItinerarySave {
    private List<DayItinerary> itinerary;
    private String destination;
    private Date startDate;  
    private Date endDate;
    private double budget;

}



