package com.dds.itinerary_service.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "itinerary")
public class Itinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "destination_id", nullable = false)
    private Double destinationId;

    @Column(name = "hotel", nullable = false)
    private String hotel;

    @Column(name = "hotelStatus", nullable = false)
    private String hotelStatus;

    @Column(name = "hotelPaymentId", nullable = false)
    private Long hotelPaymentId;

    @Column(name = "flight", nullable = false)
    private String flight;

    @Column(name = "flightStatus", nullable = false)
    private String flightStatus;

    @Column(name = "flightPaymentId", nullable = false)
    private Long flightPaymentId;


}
