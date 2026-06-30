package com.company.hrsystem.modules.attendance.repository;

import com.company.hrsystem.modules.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByUserIdAndAttendanceDate(Long userId, LocalDate attendanceDate);

    List<Attendance> findByUserIdOrderByAttendanceDateDesc(Long userId);

    List<Attendance> findByUserIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(
            Long userId,
            LocalDate fromDate,
            LocalDate toDate
    );

    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

    List<Attendance> findByAttendanceDateBetween(LocalDate fromDate, LocalDate toDate);

    List<Attendance> findAllByOrderByAttendanceDateDesc();
}
