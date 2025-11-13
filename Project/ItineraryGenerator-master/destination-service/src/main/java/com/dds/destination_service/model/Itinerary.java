package com.dds.destination_service.model;

import com.vladmihalcea.hibernate.type.json.JsonType;
import org.hibernate.annotations.Type;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Map;
import java.sql.Date;

@Data
@Entity
@Table(name = "destination") // table name in PostgreSQL
public class Itinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "destination", nullable = false)
    private String destination;

    @Column(name = "start_date", nullable = false)
    private Date startDate;

    @Column(name = "end_date", nullable = false)
    private Date endDate;

    @Column(name = "budget", nullable = false)
    private double budget;

    @Type(JsonType.class) // <-- important
    @Column(name = "itinerary_json", columnDefinition = "jsonb")
    private Map<String, Object> itineraryJson;

}
