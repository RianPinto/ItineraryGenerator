package com.dds.payment_service.service;

import com.dds.payment_service.model.*;
import com.dds.payment_service.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Random;
import java.sql.Date;
import java.util.List;

@Service
public class PaymentService {

    private final Random random = new Random();

    @Autowired
    private PaymentRepository paymentRepository;

    public PaymentResponse pay(PaymentRequest request) {
        
        PaymentResponse response = new PaymentResponse();
        boolean success = random.nextInt(100) < 65;
        Payment payment = new Payment();
        payment.setUserId(request.getUserId());
        payment.setItem(request.getItem()); 
        payment.setAmount(request.getAmount());
        if (success) {
            response.setStatus("Payment Successful");
            payment.setStatus("SUCCESS");
       
        } else {
            response.setStatus("Payment Failed");
            payment.setStatus("FAILED");

        }

        payment.setTransactionTime(new Date(System.currentTimeMillis()));
        paymentRepository.save(payment);

        response.setPaymentId(payment.getId());




        return response;
    }

    public PaymentResponse tryagain(Long id) {
        
        PaymentRequest request = new PaymentRequest();
        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment == null) {
            PaymentResponse response = new PaymentResponse();
            response.setStatus("Payment Not Found");
            return response;
        }
        request.setUserId(payment.getUserId());
        request.setItem(payment.getItem());
        request.setAmount(payment.getAmount());
        return pay(request);
    }

    public List<Payment> getPaymentHistory(Long userId) {
        return paymentRepository.findByUserId(userId);
    }
}