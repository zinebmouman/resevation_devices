package com.example.backend.service;

import com.example.backend.dto.DepartmentDto;
import com.example.backend.entity.Department;
import com.example.backend.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    // Get all departments
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get department by ID
    public DepartmentDto getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        return mapToDto(department);
    }

    // Create a new department
    @Transactional
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        Department department = new Department(departmentDto.getName());
        department = departmentRepository.save(department);
        return mapToDto(department);
    }
    // Update an existing department
    @Transactional
    public DepartmentDto updateDepartment(Long id, DepartmentDto departmentDto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department with id " + id + " not found"));

        // Update department details
        department.setName(departmentDto.getName());

        // Save the updated department
        department = departmentRepository.save(department);
        return mapToDto(department);
    }

    // Delete a department
    @Transactional
    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }

    // Map entity to DTO
    private DepartmentDto mapToDto(Department department) {
        return new DepartmentDto(department.getId(), department.getName());
    }
}
