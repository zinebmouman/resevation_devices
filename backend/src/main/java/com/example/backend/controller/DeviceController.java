package com.example.backend.controller;

import com.example.backend.dto.DeviceDto;
import com.example.backend.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    @Autowired
    private DeviceService deviceService;

    @GetMapping
    public List<DeviceDto> getAllDevices() {
        return deviceService.getAllDevices();
    }

    @GetMapping("/{id}")
    public DeviceDto getDeviceById(@PathVariable Long id) {
        return deviceService.getDeviceById(id);
    }

    @PostMapping()
    public ResponseEntity<DeviceDto> createDevice(
            @ModelAttribute DeviceDto deviceDto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        System.out.println(deviceDto.toString());
        if (deviceDto.getId() != null) {
            throw new IllegalArgumentException("ID should not be provided during creation.");
        }

        if (deviceDto.getDepartmentId() == null) {
            throw new IllegalArgumentException("Department ID must be provided.");
        }

        DeviceDto createdDevice = deviceService.createDevice(deviceDto, imageFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDevice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeviceDto> updateDevice(
        @PathVariable Long id,
        @ModelAttribute DeviceDto deviceDto,
        @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        DeviceDto updatedDevice = deviceService.updateDevice(id, deviceDto, imageFile);
        return ResponseEntity.ok(updatedDevice);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
