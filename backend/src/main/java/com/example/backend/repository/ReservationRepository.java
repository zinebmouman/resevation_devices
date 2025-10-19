package com.example.backend.repository;

import com.example.backend.entity.Device;
import com.example.backend.entity.Reservation;
import com.example.backend.entity.User;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsByUserAndDeviceAndStartDateBeforeAndEndDateAfter(User user, Device device, LocalDateTime endDate, LocalDateTime startDate);
    List<Reservation> findByUserId(Long userId);

}

