package com.example.backend.repository;

import com.example.backend.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    @Query(value = "SELECT serial_number FROM devices WHERE serial_number = :serialNumber", nativeQuery = true)
    Optional<String> findSerialNumber(@Param("serialNumber") String serialNumber);

}

