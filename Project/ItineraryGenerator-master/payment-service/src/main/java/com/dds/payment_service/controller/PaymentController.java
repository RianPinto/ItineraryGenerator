package com.dds.payment_service.controller;

import com.dds.payment_service.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.dds.payment_service.model.*;
import java.util.List;

@RestController
@RequestMapping("/api/transaction/")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/pay")
    public PaymentResponse pay(@RequestBody PaymentRequest request) {
        return paymentService.pay(request);
    }

    @GetMapping("/history/{userId}")
    public List<Payment> getPaymentHistory(@PathVariable Long userId) {
        return paymentService.getPaymentHistory(userId);
    }

     @PostMapping("/tryagain")
    public PaymentResponse tryagain(@RequestBody Long id) {
        return paymentService.tryagain(id);
    }


}
