package com.example.backend.service;

import com.example.backend.dto.ReservationDto;
import com.example.backend.entity.Device;
import com.example.backend.entity.Reservation;
import com.example.backend.entity.User;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.repository.DeviceRepository;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    public List<ReservationDto> getAllReservations() {
        return reservationRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ReservationDto getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        return mapToDto(reservation);
    }

    public List<ReservationDto> getReservationsByUserId(Long userId) {
        List<Reservation> reservations = reservationRepository.findByUserId(userId);
        return reservations.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ReservationDto getAndUpdateReservation(Long id) throws ResourceNotFoundException {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found for id: " + id));

        // Update status to "reserved" if it is not already set
        if (!"reserved".equals(reservation.getStatus())) {
            reservation.setStatus("reserved");
            reservationRepository.save(reservation);
        }

        return mapToDto(reservation);
    }
    @Transactional
    public ReservationDto createReservation(ReservationDto reservationDto) {
        // Fetch the user and device
        User user = userRepository.findById(reservationDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Device device = deviceRepository.findById(reservationDto.getDeviceId())
                .orElseThrow(() -> new RuntimeException("Device not found"));

        // Adjust start and end dates if only date is provided
        LocalDateTime startDate = adjustToFullDate(reservationDto.getStartDate());
        LocalDateTime endDate = adjustToFullDate(reservationDto.getEndDate());

        // Check for existing reservations with overlapping date range
        if (isDeviceReserved(user, device, startDate, endDate)) {
            throw new RuntimeException("This device is already reserved for the user within the specified date range.");
        }

        // Create the reservation
        Reservation reservation = new Reservation(user, device, startDate, endDate, "wait");
        reservation = reservationRepository.save(reservation);
        return mapToDto(reservation);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    private LocalDateTime adjustToFullDate(LocalDateTime dateTime) {
        if (dateTime != null) {
            return dateTime;
        }
        // Default fallback date if input is null
        return LocalDateTime.parse("2024-12-01T00:00:00", DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    private boolean isDeviceReserved(User user, Device device, LocalDateTime startDate, LocalDateTime endDate) {
        // Check if there is any reservation for the same user, device, and overlapping date range
        return reservationRepository.existsByUserAndDeviceAndStartDateBeforeAndEndDateAfter(user, device, endDate, startDate);
    }

    private ReservationDto mapToDto(Reservation reservation) {
        return new ReservationDto(
                reservation.getId(),
                reservation.getUser().getId(),
                reservation.getDevice().getId(),
                reservation.getStartDate(),
                reservation.getEndDate(),
                reservation.getStatus()
        );
    }
    @Transactional
public ReservationDto updateReservation(Long id, ReservationDto reservationDto) {
    Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));

    // Fetch the user and device
    User user = userRepository.findById(reservationDto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

    Device device = deviceRepository.findById(reservationDto.getDeviceId())
            .orElseThrow(() -> new RuntimeException("Device not found"));

    // Adjust start and end dates
    LocalDateTime startDate = adjustToFullDate(reservationDto.getStartDate());
    LocalDateTime endDate = adjustToFullDate(reservationDto.getEndDate());

    // Check for existing reservations with overlapping date range
    if (isDeviceReserved(user, device, startDate, endDate)) {
        throw new RuntimeException("This device is already reserved for the user within the specified date range.");
    }

    // Update reservation details
    reservation.setUser(user);
    reservation.setDevice(device);
    reservation.setStartDate(startDate);
    reservation.setEndDate(endDate);

    // Save updated reservation
    reservation = reservationRepository.save(reservation);

    return mapToDto(reservation);
}
}
