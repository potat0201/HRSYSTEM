package com.company.hrsystem.modules.attendance.controller;

import com.company.hrsystem.common.response.ApiResponse;
import com.company.hrsystem.modules.attendance.dto.AttendanceManualRequest;
import com.company.hrsystem.modules.attendance.dto.AttendanceResponse;
import com.company.hrsystem.modules.attendance.dto.CheckInRequest;
import com.company.hrsystem.modules.attendance.dto.CheckOutRequest;
import com.company.hrsystem.modules.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check-in")
    public ApiResponse<AttendanceResponse> checkIn(@Valid @RequestBody CheckInRequest request) {
        return ApiResponse.success(attendanceService.checkIn(request));
    }

    @PostMapping("/check-out")
    public ApiResponse<AttendanceResponse> checkOut(@Valid @RequestBody CheckOutRequest request) {
        return ApiResponse.success(attendanceService.checkOut(request));
    }

    @GetMapping("/history")
    public ApiResponse<List<AttendanceResponse>> getMyHistory(@RequestParam Long userId) {
        return ApiResponse.success(attendanceService.getMyHistory(userId));
    }

    @GetMapping("/admin")
    public ApiResponse<List<AttendanceResponse>> getAllHistory(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ApiResponse.success(attendanceService.getAllHistory(fromDate, toDate));
    }

    @GetMapping("/admin/users/{userId}")
    public ApiResponse<List<AttendanceResponse>> getUserHistory(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ApiResponse.success(attendanceService.getUserHistory(userId, fromDate, toDate));
    }

    @PostMapping("/admin")
    public ApiResponse<AttendanceResponse> createManualAttendance(
            @Valid @RequestBody AttendanceManualRequest request
    ) {
        return ApiResponse.success(attendanceService.createManualAttendance(request));
    }

    @PutMapping("/admin/{attendanceId}")
    public ApiResponse<AttendanceResponse> updateManualAttendance(
            @PathVariable Long attendanceId,
            @Valid @RequestBody AttendanceManualRequest request
    ) {
        return ApiResponse.success(attendanceService.updateManualAttendance(attendanceId, request));
    }

    @DeleteMapping("/admin/{attendanceId}")
    public ApiResponse<Void> deleteManualAttendance(@PathVariable Long attendanceId) {
        attendanceService.deleteManualAttendance(attendanceId);
        return ApiResponse.success("Attendance deleted", null);
    }
}
