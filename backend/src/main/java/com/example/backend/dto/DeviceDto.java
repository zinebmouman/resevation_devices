package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceDto {
    private Long id;
    private String name;
    private String serialNumber; 
    private Long departmentId;   
    private String imageUrl;

}
