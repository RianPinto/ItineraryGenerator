package com.dds.booking_service.model;

import lombok.Data;
import java.util.Date;

@Data
public class HotelBookingRequest {
    private String country;
    private Date checkInDate;
    private Date checkOutDate;
    private String numberOfGuests;
}
