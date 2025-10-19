package com.example.backend.dto;

import java.time.LocalDate;

public class MaintenanceDto {

    private Long id;
    private String description;
    private LocalDate maintenanceDate;
    private Long deviceId;

    // Constructors
    public MaintenanceDto() {
    }

    public MaintenanceDto(Long id, String description, LocalDate maintenanceDate, Long deviceId) {
        this.id = id;
        this.description = description;
        this.maintenanceDate = maintenanceDate;
        this.deviceId = deviceId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getMaintenanceDate() {
        return maintenanceDate;
    }

    public void setMaintenanceDate(LocalDate maintenanceDate) {
        this.maintenanceDate = maintenanceDate;
    }

    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }
}
