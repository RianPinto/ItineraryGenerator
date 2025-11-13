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
public class HotelBookingService {

     public HotelBookingResponse searchHotels(HotelBookingRequest request) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

        String checkIn = formatter.format(request.getCheckInDate());
        String checkOut = formatter.format(request.getCheckOutDate());

        String apiUrl = String.format(
                "https://serpapi.com/search.json?engine=google_hotels&q=%s+Resorts&check_in_date=%s&check_out_date=%s&adults=%s&currency=USD&gl=us&hl=en&api_key=c2ef9720e2e0b2a0302169ca6f5d9278269b1419d74eb26c909a7769ca601a8e",
                request.getCountry(),
                checkIn, 
                checkOut,
                request.getNumberOfGuests()
        );


        RestTemplate restTemplate = new RestTemplate();
        String rawJson = restTemplate.getForObject(apiUrl, String.class);
        JsonObject jsonObject = JsonParser.parseString(rawJson).getAsJsonObject();

        JsonArray adsArray = jsonObject.getAsJsonArray("ads");

        HotelBookingResponse bookingResponse = new HotelBookingResponse();
        
        List<Hotel> hotels = new ArrayList<>();
        for (JsonElement element : adsArray) {
            JsonObject ad = element.getAsJsonObject();

            Hotel hotel = new Hotel();
            hotel.setName(ad.get("name").getAsString());
            hotel.setThumbnailUrl(ad.get("thumbnail").getAsString());
            hotel.setRating(ad.has("overall_rating") ? ad.get("overall_rating").getAsString() : null);
            hotel.setPricePerNight(ad.has("price") ? ad.get("price").getAsString() : null);

            List<String> amenities = new ArrayList<>();
            if (ad.has("amenities")) {
                JsonArray amenityArray = ad.getAsJsonArray("amenities");
                for (JsonElement a : amenityArray) {
                    amenities.add(a.getAsString());
                }
            }
            hotel.setAmenities(amenities);

            hotels.add(hotel);
        }

        bookingResponse.setHotels(hotels);
        return bookingResponse;
    }


}