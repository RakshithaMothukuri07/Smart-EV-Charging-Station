package com.project.smartEV.Config;


import com.project.smartEV.Entity.Admin;
import com.project.smartEV.Repository.AdminRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    @Autowired
    private AdminRepository adminRepository;

    @PostConstruct
    public void init() {
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setEmail("admin@gmail.com");
            admin.setPassword(new BCryptPasswordEncoder().encode("admin")); // ← HASH IT
            adminRepository.save(admin);
            System.out.println("Default Admin created: admin@gmail.com / admin");
        }}
}



