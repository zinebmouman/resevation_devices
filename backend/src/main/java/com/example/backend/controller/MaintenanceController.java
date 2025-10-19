package com.example.backend.controller;

import com.example.backend.dto.MaintenanceDto;
import com.example.backend.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenances")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    @GetMapping
    public List<MaintenanceDto> getAllMaintenances() {
        return maintenanceService.getAllMaintenances();
    }

    @GetMapping("/{id}")
    public MaintenanceDto getMaintenanceById(@PathVariable Long id) {
        return maintenanceService.getMaintenanceById(id);
    }

    @PostMapping
    public MaintenanceDto createMaintenance(@RequestBody MaintenanceDto maintenanceDto) {
        return maintenanceService.createMaintenance(maintenanceDto);
    }

    @DeleteMapping("/{id}")
    public void deleteMaintenance(@PathVariable Long id) {
        maintenanceService.deleteMaintenance(id);
    }
    @PutMapping("/{id}")
public MaintenanceDto updateMaintenance(@PathVariable Long id, @RequestBody MaintenanceDto maintenanceDto) {
    return maintenanceService.updateMaintenance(id, maintenanceDto);
}
}

