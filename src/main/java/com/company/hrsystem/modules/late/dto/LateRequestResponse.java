package com.company.hrsystem.modules.late.dto;

import com.company.hrsystem.common.constant.LateRequestStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class LateRequestResponse {

    private Long id;

    private Long userId;

    private String username;

    private String fullName;

    private LocalDate requestDate;

    private String reason;

    private LateRequestStatus status;

    private Long approvedBy;

    private LocalDateTime approvedAt;

    private LocalDateTime createdAt;
}
