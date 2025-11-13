package com.dds.booking_service.service;

import com.dds.booking_service.model.*;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.google.gson.JsonParser;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@Service
public class FlightBookingService {

     public FlightBookingResponse searchFlights(FlightBookingRequest request) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

        String departureDate = formatter.format(request.getDepartureDate());
        String returnDate = formatter.format(request.getReturnDate());

        
        String apiUrl = String.format(
                "https://serpapi.com/search.json?engine=google_flights&departure_id=%s&arrival_id=%s&outbound_date=%s&return_date=%s&currency=USD&hl=en&api_key=c2ef9720e2e0b2a0302169ca6f5d9278269b1419d74eb26c909a7769ca601a8e",
                request.getDepartureId(),
                request.getArrivalId(),
                departureDate, 
                returnDate
        );

        RestTemplate restTemplate = new RestTemplate();
        String rawJson = restTemplate.getForObject(apiUrl, String.class);
        JsonObject root = JsonParser.parseString(rawJson).getAsJsonObject();

        List<Flight> flightsList = new ArrayList<>();

        JsonArray otherFlights = root.getAsJsonArray("other_flights");
        if (otherFlights != null) {
            for (JsonElement otherFlightElem : otherFlights) {
                JsonObject otherFlight = otherFlightElem.getAsJsonObject();
                JsonArray flights = otherFlight.getAsJsonArray("flights");
                if (flights != null) {
                    for (JsonElement flightElem : flights) {
                        JsonObject flightObj = flightElem.getAsJsonObject();

                        Flight flight = new Flight();
                        flight.setAirline(flightObj.get("airline").getAsString());
                        flight.setAirplane(flightObj.get("airplane").getAsString());
                        flight.setAirlineLogo(flightObj.get("airline_logo").getAsString());
                        flight.setTravelClass(flightObj.get("travel_class").getAsString());
                        flight.setDuration(flightObj.get("duration").getAsString()); 
                        flight.setFlightNumber(flightObj.get("flight_number").getAsString());

                        flightsList.add(flight);
                    }
                }
            }
        }

        FlightBookingResponse flightBookingResponse = new FlightBookingResponse();
        flightBookingResponse.setFlights(flightsList);
        return flightBookingResponse;
    }


}