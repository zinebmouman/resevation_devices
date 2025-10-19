package com.example.backend.dto;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

public class ReservationDto {

    private Long id;
    private Long userId;
    private Long deviceId;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endDate;

    private String status ;

    // Constructors
    public ReservationDto() {
    }

    public ReservationDto(Long id, Long userId, Long deviceId, LocalDateTime startDate, LocalDateTime endDate, String status) {
        this.id = id;
        this.userId = userId;
        this.deviceId = deviceId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
