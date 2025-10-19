package com.example.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseConnectionLogger {

    @Bean
    public CommandLineRunner logDatabaseConnection(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                // Query to check the current database name
                String currentDatabase = jdbcTemplate.queryForObject("SELECT current_database()", String.class);
                System.out.println("Successfully connected to the PostgreSQL database: " + currentDatabase);

                // Additional simple query to test if the database is accessible
                jdbcTemplate.execute("SELECT 1");
                System.out.println("Test query executed successfully!");

            } catch (Exception e) {
                System.err.println("Failed to connect to the PostgreSQL database: " + e.getMessage());
            }
        };
    }
}

