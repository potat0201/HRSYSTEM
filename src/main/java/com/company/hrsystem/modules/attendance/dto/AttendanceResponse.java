package com.company.hrsystem.modules.attendance.dto;

import com.company.hrsystem.common.constant.AttendanceStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class AttendanceResponse {

    private Long id;

    private Long userId;

    private String username;

    private String fullName;

    private LocalDate attendanceDate;

    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    private AttendanceStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
