package com.project.smartEV.Service.Impl;


import com.project.smartEV.DTO.LoginRequestDto;
import com.project.smartEV.Entity.Admin;
import com.project.smartEV.Repository.AdminRepository;
import com.project.smartEV.Service.IAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService implements IAdminService {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public Admin authenticate(LoginRequestDto dto) {
        Admin admin = adminRepository.findByEmail(dto.getEmail());
        if (admin != null && encoder.matches(dto.getPassword(), admin.getPassword())) {
            return admin;
        }
        throw new RuntimeException("Invalid Credentials");
    }

}
