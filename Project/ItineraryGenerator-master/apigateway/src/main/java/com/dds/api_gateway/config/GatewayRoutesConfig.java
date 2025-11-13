package com.dds.api_gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("destination-service", r -> r.path("/api/destination/**")
                                                .uri("http://localhost:8080"))
            .route("flight-booking-service", r -> r.path("/api/flight/**")
                                                   .uri("http://localhost:8081"))
            .route("payment-service", r -> r.path("/api/transaction/**")
                                           .uri("http://localhost:8082"))
            .route("itinerary-service", r -> r.path("/api/itinerary/**")
                                             .uri("http://localhost:8083"))
            .route("user-service", r -> r.path("/api/auth/**")
                                        .uri("http://localhost:8084"))
            .route("hotel-booking-service", r -> r.path("/api/hotel/**")
                                                 .uri("http://localhost:8081"))
            .build();
    }
}
