package com.dds.itinerary_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import com.dds.itinerary_service.model.*;

@FeignClient("PAYMENT-SERVICE")
public interface ItineraryInterface {


    @PostMapping("/api/transaction/pay")
    public PaymentResponse pay(@RequestBody PaymentRequest request);

    @PostMapping("/api/transaction/tryagain")
    public PaymentResponse tryagain(@RequestBody Long id);

}