package com.example.gym.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> result = new HashMap<>();
        result.put("app", "running");
        result.put("java_version", System.getProperty("java.version"));

        if (dataSource != null) {
            try (Connection conn = dataSource.getConnection()) {
                result.put("database", "CONNECTED_OK");
                result.put("catalog", conn.getCatalog());
            } catch (Exception e) {
                result.put("database", "FAILED");
                result.put("error", e.getMessage());
            }
        } else {
            result.put("database", "NO_DATASOURCE");
        }
        return result;
    }
}
