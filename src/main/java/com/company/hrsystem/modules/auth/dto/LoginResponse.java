package com.company.hrsystem.modules.auth.dto;

import com.company.hrsystem.common.constant.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LoginResponse {

    private Long userId;

    private String username;

    private String fullName;

    private Role role;

    private String token;
}
