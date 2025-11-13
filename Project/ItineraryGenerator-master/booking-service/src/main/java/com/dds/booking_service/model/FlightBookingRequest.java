package com.dds.booking_service.model;

import java.util.Date;
import lombok.Data;

@Data
public class FlightBookingRequest {
    String departureId;
    String arrivalId;
    Date departureDate;
    Date returnDate;

}
