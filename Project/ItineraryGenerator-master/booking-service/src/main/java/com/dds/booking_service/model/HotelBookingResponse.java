package com.dds.booking_service.model;

import lombok.Data;
import java.util.List;
@Data
public class HotelBookingResponse {
    private List<Hotel> hotels;
}
