package com.travelmemories.controller;

import com.travelmemories.dto.TripDtos.TripRequest;
import com.travelmemories.model.Trip;
import com.travelmemories.model.User;
import com.travelmemories.repository.TripRepository;
import com.travelmemories.repository.UserRepository;
import com.travelmemories.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Users can only ever see or modify their own trips: every query and
// mutation below is scoped to the userId pulled from the verified JWT,
// never a client-supplied id.
@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TripController(TripRepository tripRepository, UserRepository userRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Trip> list(@AuthenticationPrincipal AuthenticatedUser me) {
        return tripRepository.findByUserIdOrderByStartDateDesc(me.id());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id, @AuthenticationPrincipal AuthenticatedUser me) {
        Trip trip = tripRepository.findById(id).orElse(null);
        if (trip == null || !trip.getUser().getId().equals(me.id())) {
            return ResponseEntity.status(404).body("Trip not found.");
        }
        return ResponseEntity.ok(trip);
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody TripRequest req, @AuthenticationPrincipal AuthenticatedUser me) {
        if (req.endDate().isBefore(req.startDate())) {
            return ResponseEntity.badRequest().body("End date cannot be before start date.");
        }
        User user = userRepository.findById(me.id()).orElseThrow();

        Trip trip = new Trip();
        applyRequest(trip, req);
        trip.setUser(user);
        tripRepository.save(trip);
        return ResponseEntity.ok(trip);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody TripRequest req,
                                     @AuthenticationPrincipal AuthenticatedUser me) {
        if (req.endDate().isBefore(req.startDate())) {
            return ResponseEntity.badRequest().body("End date cannot be before start date.");
        }
        Trip trip = tripRepository.findById(id).orElse(null);
        if (trip == null || !trip.getUser().getId().equals(me.id())) {
            return ResponseEntity.status(404).body("Trip not found.");
        }
        applyRequest(trip, req);
        tripRepository.save(trip);
        return ResponseEntity.ok(trip);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @AuthenticationPrincipal AuthenticatedUser me) {
        Trip trip = tripRepository.findById(id).orElse(null);
        if (trip == null || !trip.getUser().getId().equals(me.id())) {
            return ResponseEntity.status(404).body("Trip not found.");
        }
        tripRepository.delete(trip);
        return ResponseEntity.noContent().build();
    }

    private void applyRequest(Trip trip, TripRequest req) {
        trip.setName(req.name());
        trip.setDestination(req.destination());
        trip.setStartDate(req.startDate());
        trip.setEndDate(req.endDate());
        trip.setCoverPhotoUrl(req.coverPhotoUrl());
        trip.setDescription(req.description());
        trip.setTravelType(req.travelType());
        trip.setBudget(req.budget());
        trip.setFavourite(req.favourite());
    }
}
