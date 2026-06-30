package com.company.hrsystem.modules.attendance.service.impl;

import com.company.hrsystem.common.constant.AttendanceStatus;
import com.company.hrsystem.common.constant.LateRequestStatus;
import com.company.hrsystem.common.constant.UserStatus;
import com.company.hrsystem.common.exception.BusinessException;
import com.company.hrsystem.common.exception.ErrorCode;
import com.company.hrsystem.modules.attendance.dto.AttendanceManualRequest;
import com.company.hrsystem.modules.attendance.dto.AttendanceResponse;
import com.company.hrsystem.modules.attendance.dto.CheckInRequest;
import com.company.hrsystem.modules.attendance.dto.CheckOutRequest;
import com.company.hrsystem.modules.attendance.entity.Attendance;
import com.company.hrsystem.modules.attendance.repository.AttendanceRepository;
import com.company.hrsystem.modules.attendance.service.AttendanceService;
import com.company.hrsystem.modules.employee.entity.User;
import com.company.hrsystem.modules.employee.repository.UserRepository;
import com.company.hrsystem.modules.late.repository.LateRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private static final LocalTime WORK_START_TIME = LocalTime.of(8, 30);

    private final AttendanceRepository attendanceRepository;

    private final UserRepository userRepository;

    private final LateRequestRepository lateRequestRepository;

    @Override
    public AttendanceResponse checkIn(CheckInRequest request) {
        User user = getActiveUser(request.getUserId());
        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        Attendance attendance = attendanceRepository.findByUserIdAndAttendanceDate(user.getId(), today)
                .orElseGet(() -> Attendance.builder()
                        .user(user)
                        .attendanceDate(today)
                        .build());

        if (attendance.getCheckInTime() != null) {
            throw new BusinessException(ErrorCode.ALREADY_CHECKED_IN);
        }

        attendance.setCheckInTime(now);
        attendance.setStatus(resolveCheckInStatus(user.getId(), today, now.toLocalTime()));

        return toResponse(attendanceRepository.save(attendance));
    }

    @Override
    public AttendanceResponse checkOut(CheckOutRequest request) {
        User user = getActiveUser(request.getUserId());
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository.findByUserIdAndAttendanceDate(user.getId(), today)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHECK_IN_REQUIRED));

        if (attendance.getCheckInTime() == null) {
            throw new BusinessException(ErrorCode.CHECK_IN_REQUIRED);
        }

        if (attendance.getCheckOutTime() != null) {
            throw new BusinessException(ErrorCode.ALREADY_CHECKED_OUT);
        }

        attendance.setCheckOutTime(LocalDateTime.now());
        return toResponse(attendanceRepository.save(attendance));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getMyHistory(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return toResponses(attendanceRepository.findByUserIdOrderByAttendanceDateDesc(userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAllHistory(LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null && toDate == null) {
            return toResponses(attendanceRepository.findAllByOrderByAttendanceDateDesc());
        }

        LocalDate from = fromDate == null ? LocalDate.of(1970, 1, 1) : fromDate;
        LocalDate to = toDate == null ? LocalDate.now() : toDate;
        validateDateRange(from, to);

        return toResponses(attendanceRepository.findByAttendanceDateBetween(from, to));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getUserHistory(Long userId, LocalDate fromDate, LocalDate toDate) {
        if (!userRepository.existsById(userId)) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        if (fromDate == null && toDate == null) {
            return toResponses(attendanceRepository.findByUserIdOrderByAttendanceDateDesc(userId));
        }

        LocalDate from = fromDate == null ? LocalDate.of(1970, 1, 1) : fromDate;
        LocalDate to = toDate == null ? LocalDate.now() : toDate;
        validateDateRange(from, to);

        return toResponses(attendanceRepository.findByUserIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(
                userId,
                from,
                to
        ));
    }

    @Override
    public AttendanceResponse createManualAttendance(AttendanceManualRequest request) {
        User user = getUser(request.getUserId());

        attendanceRepository.findByUserIdAndAttendanceDate(user.getId(), request.getAttendanceDate())
                .ifPresent(attendance -> {
                    throw new BusinessException(ErrorCode.ATTENDANCE_ALREADY_EXISTS);
                });

        Attendance attendance = Attendance.builder()
                .user(user)
                .attendanceDate(request.getAttendanceDate())
                .checkInTime(request.getCheckInTime())
                .checkOutTime(request.getCheckOutTime())
                .status(request.getStatus())
                .build();

        validateManualAttendance(attendance);
        return toResponse(attendanceRepository.save(attendance));
    }

    @Override
    public AttendanceResponse updateManualAttendance(Long attendanceId, AttendanceManualRequest request) {
        Attendance attendance = getAttendance(attendanceId);
        User user = getUser(request.getUserId());

        attendanceRepository.findByUserIdAndAttendanceDate(user.getId(), request.getAttendanceDate())
                .filter(existing -> !existing.getId().equals(attendanceId))
                .ifPresent(existing -> {
                    throw new BusinessException(ErrorCode.ATTENDANCE_ALREADY_EXISTS);
                });

        attendance.setUser(user);
        attendance.setAttendanceDate(request.getAttendanceDate());
        attendance.setCheckInTime(request.getCheckInTime());
        attendance.setCheckOutTime(request.getCheckOutTime());
        attendance.setStatus(request.getStatus());

        validateManualAttendance(attendance);
        return toResponse(attendanceRepository.save(attendance));
    }

    @Override
    public void deleteManualAttendance(Long attendanceId) {
        Attendance attendance = getAttendance(attendanceId);
        attendanceRepository.delete(attendance);
    }

    @Override
    public void markAbsentForDate(LocalDate date) {
        List<User> activeUsers = userRepository.findByStatus(UserStatus.ACTIVE);

        for (User user : activeUsers) {
            Attendance attendance = attendanceRepository.findByUserIdAndAttendanceDate(user.getId(), date)
                    .orElseGet(() -> Attendance.builder()
                            .user(user)
                            .attendanceDate(date)
                            .build());

            if (attendance.getCheckInTime() == null || attendance.getCheckOutTime() == null) {
                attendance.setStatus(AttendanceStatus.ABSENT);
                attendanceRepository.save(attendance);
            }
        }
    }

    private AttendanceStatus resolveCheckInStatus(Long userId, LocalDate date, LocalTime checkInTime) {
        if (!checkInTime.isAfter(WORK_START_TIME)) {
            return AttendanceStatus.PRESENT;
        }

        boolean hasApprovedLateRequest = lateRequestRepository.findByUserIdAndRequestDate(userId, date)
                .filter(request -> request.getStatus() == LateRequestStatus.APPROVED)
                .isPresent();

        return hasApprovedLateRequest ? AttendanceStatus.PRESENT : AttendanceStatus.LATE;
    }

    private void validateDateRange(LocalDate fromDate, LocalDate toDate) {
        if (fromDate.isAfter(toDate)) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }
    }

    private void validateManualAttendance(Attendance attendance) {
        if (attendance.getCheckInTime() != null
                && attendance.getCheckOutTime() != null
                && attendance.getCheckOutTime().isBefore(attendance.getCheckInTime())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }
    }

    private User getActiveUser(Long userId) {
        User user = getUser(userId);
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return user;
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    private Attendance getAttendance(Long attendanceId) {
        return attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ATTENDANCE_NOT_FOUND));
    }

    private List<AttendanceResponse> toResponses(List<Attendance> attendances) {
        return attendances.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private AttendanceResponse toResponse(Attendance attendance) {
        User user = attendance.getUser();

        return AttendanceResponse.builder()
                .id(attendance.getId())
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .attendanceDate(attendance.getAttendanceDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .status(attendance.getStatus())
                .createdAt(attendance.getCreatedAt())
                .updatedAt(attendance.getUpdatedAt())
                .build();
    }
}
