package com.company.hrsystem.modules.employee.dto;

import com.company.hrsystem.common.constant.UserStatus;
import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeUpdateRequest {

    private String fullName;

    @Email
    private String email;

    private String phone;

    private String department;

    private UserStatus status;
}
