package com.example.backend.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "Devices")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String serialNumber;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations;

    @ManyToMany
    @JoinTable(
        name = "device_maintenance",
        joinColumns = @JoinColumn(name = "device_id"),
        inverseJoinColumns = @JoinColumn(name = "maintenance_id")
    )
    private List<Maintenance> maintenances;

    // Ensure this matches your database column name
    

    // Constructors
    public Device() {}

    public Device(String name, String serialNumber, Department department) {
        this.name = name;
        this.serialNumber = serialNumber;
        this.department = department;
        
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }

    public List<Maintenance> getMaintenances() {
        return maintenances;
    }

    public void setMaintenances(List<Maintenance> maintenances) {
        this.maintenances = maintenances;
    }

    // Admin getter and setter
    @Column(nullable = true)
private String imageUrl;

public String getImageUrl() {
    return imageUrl;
}

public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
}
   
}
