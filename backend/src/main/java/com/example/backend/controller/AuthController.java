package com.example.backend.controller;

import com.example.backend.dto.UserDto;
import com.example.backend.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody UserDto userDto) {
        String token = authService.register(userDto);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    // Login endpoint
    @PostMapping("/login")
public ResponseEntity<Map<String, String>> login(@RequestBody UserDto userDto) {
    try {
        String token = authService.login(userDto);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Invalid credentials or other error");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }
}
}
