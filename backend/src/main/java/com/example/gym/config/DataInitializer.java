package com.example.gym.config;

import com.example.gym.entity.User;
import com.example.gym.repository.AttendanceRepository;
import com.example.gym.repository.PaymentRepository;
import com.example.gym.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, AttendanceRepository attendanceRepository, PaymentRepository paymentRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@gym.com";
            User admin = userRepository.findByEmail(adminEmail).orElse(new User());
            admin.setFullName("Gym Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole("ADMIN");
            admin.setStatus("ACTIVE");
            userRepository.save(admin);
            System.out.println("✅ Default Admin account created/updated: " + adminEmail + " / admin");

            // Cleanup existing sample data (if any from previous deployments)
            String[] sampleUsers = {
                "john.doe@example.com", "jane.smith@example.com", "mike.johnson@example.com",
                "sarah.williams@example.com", "david.brown@example.com", "emily.davis@example.com"
            };
            
            for (String email : sampleUsers) {
                userRepository.findByEmail(email).ifPresent(user -> {
                    // Delete attendances
                    attendanceRepository.findByUserId(user.getId()).forEach(att -> attendanceRepository.delete(att));
                    // Delete payments
                    paymentRepository.findByUserId(user.getId()).forEach(pay -> paymentRepository.delete(pay));
                    // Delete user
                    userRepository.delete(user);
                    System.out.println("🗑️ Deleted sample user and associated data: " + email);
                });
            }
        };
    }
}
