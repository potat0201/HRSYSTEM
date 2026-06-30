package com.company.hrsystem.modules.auth.service;

import com.company.hrsystem.modules.auth.dto.LoginRequest;
import com.company.hrsystem.modules.auth.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    void logout(Long userId);
}
