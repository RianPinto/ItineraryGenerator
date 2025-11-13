package com.dds.destination_service.model;

import lombok.Data;

@Data
public class Activity {
    private String time;
    private String description;
    private String estimated_cost;
    private String notes;
}