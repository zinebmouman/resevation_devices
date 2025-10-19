package com.example.backend.controller;

import com.example.backend.dto.DepartmentDto;
import com.example.backend.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    // Get all departments
    @GetMapping
    public List<DepartmentDto> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    // Get department by ID
    @GetMapping("/{id}")
    public DepartmentDto getDepartmentById(@PathVariable Long id) {
        return departmentService.getDepartmentById(id);
    }

    // Create a new department
    @PostMapping
    public DepartmentDto createDepartment(@RequestBody DepartmentDto departmentDto) {
        return departmentService.createDepartment(departmentDto);
    }
    // Update an existing department
    @PutMapping("/{id}")
    public DepartmentDto updateDepartment(@PathVariable Long id, @RequestBody DepartmentDto departmentDto) {
        return departmentService.updateDepartment(id, departmentDto);
    }

    // Delete a department
    @DeleteMapping("/{id}")
    public void deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
    }
}
