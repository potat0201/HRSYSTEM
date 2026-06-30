package com.company.hrsystem.modules.employee.dto;

import com.company.hrsystem.common.constant.Role;
import com.company.hrsystem.common.constant.UserStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class EmployeeResponse {

    private Long id;

    private String username;

    private String fullName;

    private String email;

    private String phone;

    private String department;

    private Role role;

    private UserStatus status;

    private LocalDateTime createdAt;
}