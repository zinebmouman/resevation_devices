package com.example.backend.service;

import com.example.backend.dto.MaintenanceDto;
import com.example.backend.entity.Device;
import com.example.backend.entity.Maintenance;
import com.example.backend.repository.DeviceRepository;
import com.example.backend.repository.MaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    // Method to get all maintenance records
    public List<MaintenanceDto> getAllMaintenances() {
        return maintenanceRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Method to get a maintenance record by ID
    public MaintenanceDto getMaintenanceById(Long id) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance not found"));
        return mapToDto(maintenance);
    }

    @Transactional // Ensures transaction management
    public MaintenanceDto createMaintenance(MaintenanceDto maintenanceDto) {
        // Check if maintenance already exists for the same device and date
        if (maintenanceRepository.existsByDeviceIdAndMaintenanceDate(maintenanceDto.getDeviceId(), maintenanceDto.getMaintenanceDate())) {
            throw new RuntimeException("Maintenance for this device on this date already exists");
        }

        // Fetch the device to associate with the maintenance
        Device device = deviceRepository.findById(maintenanceDto.getDeviceId())
                .orElseThrow(() -> new RuntimeException("Device not found"));

        // Create new maintenance record
        Maintenance maintenance = new Maintenance(
                maintenanceDto.getDescription(),
                maintenanceDto.getMaintenanceDate(),
                device
        );

        maintenance = maintenanceRepository.save(maintenance); // Save maintenance to DB
        return mapToDto(maintenance); // Return maintenance as DTO
    }

    // Method to delete a maintenance record by ID
    public void deleteMaintenance(Long id) {
        maintenanceRepository.deleteById(id);
    }

    // Helper method to map Maintenance entity to DTO
    private MaintenanceDto mapToDto(Maintenance maintenance) {
        return new MaintenanceDto(
                maintenance.getId(),
                maintenance.getDescription(),
                maintenance.getMaintenanceDate(),
                maintenance.getDevice().getId()
        );
    }
    @Transactional
public MaintenanceDto updateMaintenance(Long id, MaintenanceDto maintenanceDto) {
    // Check if the maintenance record exists
    Maintenance maintenance = maintenanceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Maintenance not found"));

    // Check if the device exists
    Device device = deviceRepository.findById(maintenanceDto.getDeviceId())
            .orElseThrow(() -> new RuntimeException("Device not found"));

    // Update maintenance record fields
    maintenance.setDescription(maintenanceDto.getDescription());
    maintenance.setMaintenanceDate(maintenanceDto.getMaintenanceDate());
    maintenance.setDevice(device);

    // Save and return the updated maintenance as DTO
    maintenance = maintenanceRepository.save(maintenance);
    return mapToDto(maintenance);
}
}
