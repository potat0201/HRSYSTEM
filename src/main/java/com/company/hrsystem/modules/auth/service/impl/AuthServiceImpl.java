package com.company.hrsystem.modules.auth.service.impl;

import com.company.hrsystem.common.constant.UserStatus;
import com.company.hrsystem.common.exception.BusinessException;
import com.company.hrsystem.common.exception.ErrorCode;
import com.company.hrsystem.modules.auth.dto.LoginRequest;
import com.company.hrsystem.modules.auth.dto.LoginResponse;
import com.company.hrsystem.modules.auth.service.AuthService;
import com.company.hrsystem.modules.employee.entity.User;
import com.company.hrsystem.modules.employee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername().trim())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_LOGIN));

        if (user.getStatus() != UserStatus.ACTIVE
                || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_LOGIN);
        }

        return LoginResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .token(UUID.randomUUID().toString())
                .build();
    }

    @Override
    public void logout(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
    }
}
