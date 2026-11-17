package com.project.smartEV.Service;


import com.project.smartEV.DTO.LoginRequestDto;
import com.project.smartEV.Entity.Admin;

public interface IAdminService {
    Admin authenticate(LoginRequestDto loginRequestDto);
}
