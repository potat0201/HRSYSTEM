package com.company.hrsystem.modules.attendance.dto;

import com.company.hrsystem.common.constant.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class AttendanceManualRequest {

    @NotNull
    private Long userId;

    @NotNull
    private LocalDate attendanceDate;

    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    @NotNull
    private AttendanceStatus status;
}
