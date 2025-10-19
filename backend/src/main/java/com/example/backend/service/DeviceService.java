package com.example.backend.service;

import com.example.backend.dto.DeviceDto;
import com.example.backend.entity.Device;
import com.example.backend.entity.Department;
import com.example.backend.repository.DeviceRepository;
import com.example.backend.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    // Get all devices
    public List<DeviceDto> getAllDevices() {
        List<Device> devices = deviceRepository.findAll();
        return devices.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get device by ID
    public DeviceDto getDeviceById(Long id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        return convertToDto(device);
    }

    @Transactional
    // Create a new device
    public DeviceDto createDevice(DeviceDto deviceDto, MultipartFile imageFile) {
        // Check if the department exists

        Department department = departmentRepository.findById(deviceDto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));


        Optional<String> deviceSerial = deviceRepository.findSerialNumber(deviceDto.getSerialNumber()).orElse("null").describeConstable();

        if (!deviceSerial.get().equals("null")) {
            throw new RuntimeException("Serial number already exist");
        }

        // Save image if provided
        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imageUrl = saveImage(imageFile);
        }

        // Create and save the device
        Device device = new Device();
        device.setName(deviceDto.getName());
        device.setSerialNumber(deviceDto.getSerialNumber());
        device.setDepartment(department);
        device.setImageUrl(imageUrl);

        device = deviceRepository.save(device);
        return convertToDto(device);
    }

    @Transactional
    // Update a device
    public DeviceDto updateDevice(Long id, DeviceDto deviceDto, MultipartFile imageFile) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        Department department = departmentRepository.findById(deviceDto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        // Update the image only if a new one is provided
        String imageUrl = device.getImageUrl(); // Retain the existing URL if no new image is provided
        if (imageFile != null && !imageFile.isEmpty()) {
            imageUrl = saveImage(imageFile);
        }

        // Update the device details
        device.setName(deviceDto.getName());
        device.setSerialNumber(deviceDto.getSerialNumber());
        device.setDepartment(department);
        device.setImageUrl(imageUrl);

        device = deviceRepository.save(device);
        return convertToDto(device);
    }

    @Transactional
    // Delete a device by ID
    public void deleteDevice(Long id) {
        deviceRepository.deleteById(id);
    }

    // Helper method to convert Device to DeviceDto
    private DeviceDto convertToDto(Device device) {
        return new DeviceDto(
                device.getId(),
                device.getName(),
                device.getSerialNumber(),
                Optional.ofNullable(device.getDepartment())
                        .map(Department::getId)
                        .orElse(null),
                device.getImageUrl()
        );
    }

    // Helper method to save image
    private String saveImage(MultipartFile imageFile) {
        try {
            Path directoryPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath); // Create directory if it doesn't exist
            }
            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path filePath = directoryPath.resolve(fileName);
            Files.write(filePath, imageFile.getBytes());
            return fileName; // Return only the file name, not the full path
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image", e);
        }
    }
}
