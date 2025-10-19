package com.example.backend.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;


import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final Key SECRET_KEY; // Using Key type for improved security

    // Constructor-based injection to inject the secret key from the application properties
    public JwtUtil(@Value("${jwt.secret}") String secretKey) {
        // Ensure the secret key is at least 256 bits for HS256 by using Keys.secretKeyFor(SignatureAlgorithm.HS256)
        this.SECRET_KEY = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
               
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))  // 10 hours expiration
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256) // Using the secure Key
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                   .setSigningKey(SECRET_KEY)  // Use the secure key for parsing
                   .build()
                   .parseClaimsJws(token)
                   .getBody()
                   .getSubject();
    }

    public boolean isTokenValid(String token, String email) {
        String extractedEmail = extractEmail(token);
        return extractedEmail.equals(email) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return Jwts.parserBuilder()
                   .setSigningKey(SECRET_KEY) // Use the secure key for parsing
                   .build()
                   .parseClaimsJws(token)
                   .getBody()
                   .getExpiration()
                   .before(new Date());
    }
}
