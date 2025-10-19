package com.example.backend.controller;

import com.example.backend.dto.ReservationDto;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping
    public List<ReservationDto> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/{id}")
    public ReservationDto getReservationById(@PathVariable Long id) {
        return reservationService.getReservationById(id);
    }

    @PostMapping
    public ReservationDto createReservation(@RequestBody ReservationDto reservationDto) {
        return reservationService.createReservation(reservationDto);
    }
    
    @GetMapping("/user/{userId}")
    public List<ReservationDto> getReservationsByUserId(@PathVariable Long userId) {
        return reservationService.getReservationsByUserId(userId);
    }

    @GetMapping("reserved/{id}")
    public ResponseEntity<ReservationDto> getReservationAndUpdateStatus(@PathVariable Long id) throws ResourceNotFoundException {
        ReservationDto reservationDto = reservationService.getAndUpdateReservation(id);
        return ResponseEntity.ok(reservationDto);
    }
    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }
    @PutMapping("/{id}")
public ReservationDto updateReservation(@PathVariable Long id, @RequestBody ReservationDto reservationDto) {
    return reservationService.updateReservation(id, reservationDto);
}

}

