package com.company.hrsystem.modules.attendance.service;

import com.company.hrsystem.modules.attendance.dto.AttendanceManualRequest;
import com.company.hrsystem.modules.attendance.dto.AttendanceResponse;
import com.company.hrsystem.modules.attendance.dto.CheckInRequest;
import com.company.hrsystem.modules.attendance.dto.CheckOutRequest;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {

    AttendanceResponse checkIn(CheckInRequest request);

    AttendanceResponse checkOut(CheckOutRequest request);

    List<AttendanceResponse> getMyHistory(Long userId);

    List<AttendanceResponse> getAllHistory(LocalDate fromDate, LocalDate toDate);

    List<AttendanceResponse> getUserHistory(Long userId, LocalDate fromDate, LocalDate toDate);

    AttendanceResponse createManualAttendance(AttendanceManualRequest request);

    AttendanceResponse updateManualAttendance(Long attendanceId, AttendanceManualRequest request);

    void deleteManualAttendance(Long attendanceId);

    void markAbsentForDate(LocalDate date);
}
