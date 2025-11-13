package com.dds.payment_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dds.payment_service.model.*;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);

} 