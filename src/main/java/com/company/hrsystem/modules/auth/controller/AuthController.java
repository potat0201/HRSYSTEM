package com.company.hrsystem.modules.auth.controller;

import com.company.hrsystem.common.response.ApiResponse;
import com.company.hrsystem.modules.auth.dto.LoginRequest;
import com.company.hrsystem.modules.auth.dto.LoginResponse;
import com.company.hrsystem.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestParam Long userId) {
        authService.logout(userId);
        return ApiResponse.success("Logged out", null);
    }
}
