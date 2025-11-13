package com.dds.itinerary_service.model;

import lombok.Data;

@Data
public class PaymentResponse {
    String status;
    Long paymentId;
}

