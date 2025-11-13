package com.dds.payment_service.model;

import lombok.Data;

@Data
public class PaymentRequest {

    private Long userId;
    private String item;
    private Double amount;

}
