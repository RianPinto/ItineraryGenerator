package com.dds.destination_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.dds.destination_service.model.*;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;
import com.dds.destination_service.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

@Service
public class ItineraryService {
    
    @Autowired
    private ItineraryRepository itineraryRepository;

    public ItineraryResponse generateItinerary(ItineraryRequest request) {

        long diffInMillis = request.getEndDate().getTime() - request.getStartDate().getTime();
        long durationInDays = (diffInMillis / (1000 * 60 * 60 * 24)) +1; 

        Client client = Client.builder().apiKey("AIzaSyAusechKag2hXN8XQOzhy_Or2tMYog6O9k").build();

        String prompt = String.format(
            "Create a detailed %s trip itinerary for %d people to %s for %s days with a budget of %.2f. "
            + "Include activities, tourist attractions and dining options. The output should be in JSON format with one field named itinerary containing a list of days, each day with 3 fields, Morning, afternoon, evening - each with time , description , estimated cost and notes. Ensure this format is strictly followed. Ensure all fields are in lowercase. Ensure the total estimated cost does not exceed the budget.",
            request.getType(),
            request.getMembers(),
            request.getCountry(),
            durationInDays,
            request.getBudget()
        );

        GenerateContentResponse response =
            client.models.generateContent(
                "gemini-2.5-flash-lite",
                prompt,
                null);
        client.close();

        String llmResponse = response.text().replaceAll("^```json\\s*", "")
                                 .replaceAll("\\s*```$", "");

        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(llmResponse, JsonObject.class);


        // System.out.println(gson.toJson(jsonObject));

        
        return parseItineraryResponse(jsonObject, response.text());


    }


    public Itinerary saveItinerary(Long userId, ItinerarySave itineraryJson) {
        Itinerary itinerary = new Itinerary();
        itinerary.setUserId(userId);
        itinerary.setDestination(itineraryJson.getDestination());
        itinerary.setStartDate(itineraryJson.getStartDate());
        itinerary.setEndDate(itineraryJson.getEndDate());
        itinerary.setBudget(itineraryJson.getBudget());
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> jsonMap = mapper.convertValue(
                itineraryJson,
                new TypeReference<Map<String, Object>>() {}
        );
        itinerary.setItineraryJson(jsonMap);
        return itineraryRepository.save(itinerary);
    }

    ItineraryResponse parseItineraryResponse(JsonObject jsonObject, String llmStringResponse) {
        Gson gson = new GsonBuilder().create();
        ItineraryResponse itineraryResponse = new ItineraryResponse();

        String itineraryJson = jsonObject.get("itinerary").toString();

        Type listType = new TypeToken<List<DayItinerary>>() {}.getType();

        List<DayItinerary> daysArray = gson.fromJson(itineraryJson, listType);
        System.out.println("Parsed Itinerary: " + daysArray);

        itineraryResponse.setItinerary(daysArray);

        return itineraryResponse;
    }



}