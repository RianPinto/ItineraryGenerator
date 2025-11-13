package com.dds.itinerary_service.service;

import com.dds.itinerary_service.feign.ItineraryInterface;
import com.dds.itinerary_service.model.*;
import com.dds.itinerary_service.repository.ItineraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ItineraryService {


    @Autowired
    private ItineraryRepository itineraryRepository;

    @Autowired
    private ItineraryInterface paymentClient;

    public PaymentResponse call(String item, Double amount, Long userId){
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setItem(item);
        paymentRequest.setAmount(amount);
        paymentRequest.setUserId(userId);
        return paymentClient.pay(paymentRequest);

    }

    public PaymentResponse call(Long id){
        return paymentClient.tryagain(id);

    }


    public Itinerary confirm(ItineraryRequest request) {
        Itinerary itinerary = new Itinerary();

        PaymentResponse flightResponse = call(request.getFlight(), request.getFlightAmount(), request.getUserId());
        itinerary.setFlightStatus("Success");
        itinerary.setFlightPaymentId(flightResponse.getPaymentId());
        if(!flightResponse.getStatus().equals("Payment Successful")){
            itinerary.setFlightStatus("Failed");
        }
        
        PaymentResponse hotelResponse = call(request.getHotel(), request.getHotelAmount(), request.getUserId());
        itinerary.setHotelStatus("Success");
        itinerary.setHotelPaymentId(hotelResponse.getPaymentId());
        if(!hotelResponse.getStatus().equals("Payment Successful")){
            itinerary.setHotelStatus("Failed");

        }

        itinerary.setUserId(request.getUserId());
        itinerary.setFlight(request.getFlight());
        itinerary.setHotel(request.getHotel());
        itinerary.setDestinationId(request.getDestinationId());
        itineraryRepository.save(itinerary);

        return itinerary;
    
    }

    public RepeatResponse tryagain(RepeatRequest request) {

        Optional<Itinerary> optionalItinerary = itineraryRepository.findById(request.getItineraryId());
        RepeatResponse repeatResponse = new RepeatResponse();
        Itinerary failedItinerary;

        if (optionalItinerary.isPresent()) {
            failedItinerary = optionalItinerary.get();
        } else {
            repeatResponse.setStatus("Itinerary not found");
            return repeatResponse;
        }
        PaymentResponse response;
        if(request.getItem().equalsIgnoreCase("flight")){
            response = call(failedItinerary.getFlightPaymentId());
        }
        else{
            response = call(failedItinerary.getHotelPaymentId());
        }

        if(response.getStatus().equals("Payment Successful")){
            repeatResponse.setStatus("Success");
            if(request.getItem().equals("flight")){
                Itinerary itinerary = itineraryRepository.findById(request.getItineraryId()).get();
                itinerary.setFlightStatus("Success");
                itineraryRepository.save(itinerary);
            } else if(request.getItem().equals("hotel")){
                Itinerary itinerary = itineraryRepository.findById(request.getItineraryId()).get();
                itinerary.setHotelStatus("Success");
                itineraryRepository.save(itinerary);
            }

        } else {
            repeatResponse.setStatus("Success");
        }
        return repeatResponse;

    }






    public List<Itinerary> getHistory(Long userId) {
        return itineraryRepository.findByUserId(userId);
    }
}