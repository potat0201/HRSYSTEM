package com.company.hrsystem.modules.employee.service.impl;

import com.company.hrsystem.common.constant.Role;
import com.company.hrsystem.common.constant.UserStatus;
import com.company.hrsystem.common.exception.BusinessException;
import com.company.hrsystem.common.exception.ErrorCode;
import com.company.hrsystem.modules.employee.dto.EmployeeCreateRequest;
import com.company.hrsystem.modules.employee.dto.EmployeeResponse;
import com.company.hrsystem.modules.employee.dto.EmployeeUpdateRequest;
import com.company.hrsystem.modules.employee.entity.User;
import com.company.hrsystem.modules.employee.repository.UserRepository;
import com.company.hrsystem.modules.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public EmployeeResponse createEmployee(EmployeeCreateRequest request) {
        String username = request.getUsername().trim();
        String email = request.getEmail().trim();

        if (userRepository.existsByUsername(username)) {
            throw new BusinessException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        if (userRepository.existsByEmail(email)) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .email(email)
                .phone(trimToNull(request.getPhone()))
                .department(trimToNull(request.getDepartment()))
                .role(Role.EMPLOYEE)
                .status(UserStatus.ACTIVE)
                .build();

        return toResponse(userRepository.save(user));
    }

    @Override
    public EmployeeResponse updateEmployee(Long employeeId, EmployeeUpdateRequest request) {
        User user = getUser(employeeId);

        if (StringUtils.hasText(request.getEmail())) {
            String email = request.getEmail().trim();
            if (!email.equalsIgnoreCase(user.getEmail())
                    && userRepository.existsByEmailAndIdNot(email, employeeId)) {
                throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
            }
            user.setEmail(email);
        }

        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(trimToNull(request.getPhone()));
        }
        if (request.getDepartment() != null) {
            user.setDepartment(trimToNull(request.getDepartment()));
        }
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        return toResponse(userRepository.save(user));
    }

    @Override
    public void deactivateEmployee(Long employeeId) {
        User user = getUser(employeeId);
        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(Long employeeId) {
        return toResponse(getUser(employeeId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getEmployees(String fullName, UserStatus status) {
        List<User> users;
        if (StringUtils.hasText(fullName) && status != null) {
            users = userRepository.findByFullNameContainingIgnoreCaseAndStatus(fullName.trim(), status);
        } else if (StringUtils.hasText(fullName)) {
            users = userRepository.findByFullNameContainingIgnoreCase(fullName.trim());
        } else if (status != null) {
            users = userRepository.findByStatus(status);
        } else {
            users = userRepository.findAll();
        }
        return toResponses(users);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getInactiveEmployees() {
        return toResponses(userRepository.findByStatus(UserStatus.INACTIVE));
    }

    @Override
    public EmployeeResponse grantAdmin(Long employeeId) {
        User user = getUser(employeeId);
        user.setRole(Role.ADMIN);
        return toResponse(userRepository.save(user));
    }

    @Override
    public EmployeeResponse revokeAdmin(Long employeeId) {
        User user = getUser(employeeId);
        user.setRole(Role.EMPLOYEE);
        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAdmins() {
        return toResponses(userRepository.findByRole(Role.ADMIN));
    }

    private User getUser(Long employeeId) {
        return userRepository.findById(employeeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    private List<EmployeeResponse> toResponses(List<User> users) {
        return users.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private EmployeeResponse toResponse(User user) {
        return EmployeeResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .department(user.getDepartment())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private String trimToNull(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return value.trim();
    }
}
