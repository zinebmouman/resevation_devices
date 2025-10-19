package com.example.backend.service;

import com.example.backend.dto.UserDto;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    // Initialize admin account after application startup
    @PostConstruct
    public void initializeAdminAccount() {
        String adminEmail = "admin@isetsfax.tn";
        String adminPassword = "isetsfax";

        // Check if the admin account already exists
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setFirstName("Admin"); // Optional: set admin first name
            admin.setLastName("IsetSfax"); // Optional: set admin last name
            userRepository.save(admin);
            System.out.println("Admin account initialized with email: " + adminEmail);
        } else {
            System.out.println("Admin account already exists.");
        }
    }

    // Register a new user and return JWT token
    public String register(UserDto userDto) {
        // Check if the user already exists
        Optional<User> existingUser = userRepository.findByEmail(userDto.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User already exists");
        }

        // Create a new user entity
        User newUser = new User();
        newUser.setEmail(userDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        newUser.setFirstName(userDto.getFirstName()); // Set first name
        newUser.setLastName(userDto.getLastName()); // Set last name
        userRepository.save(newUser);

        // Return JWT token
        return jwtUtil.generateToken(newUser.getEmail());
    }

    // Login the user and return JWT token
    public String login(UserDto userDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDto.getEmail(), userDto.getPassword())
        );

        // Check if the user exists in the database
        User user = userRepository.findByEmail(userDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Return JWT token
        String token = jwtUtil.generateToken(user.getEmail());
        return "Token: " + token + ", ID: " + user.getId() + ", First Name: " + user.getFirstName();

    }
}
