package com.dds.destination_service.model;

import java.sql.Date;

import lombok.Data;

@Data
public class ItineraryRequest {
    private String country;
    private Date startDate;  
    private Date endDate;
    private double budget;
    private int members;
    private String type;  

}
