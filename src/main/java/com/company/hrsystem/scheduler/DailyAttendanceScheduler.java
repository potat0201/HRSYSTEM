package com.company.hrsystem.scheduler;

import com.company.hrsystem.modules.attendance.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DailyAttendanceScheduler {

    private final AttendanceService attendanceService;

    @Scheduled(cron = "0 59 23 * * *", zone = "Asia/Ho_Chi_Minh")
    public void markAbsentAtEndOfDay() {
        attendanceService.markAbsentForDate(LocalDate.now());
    }
}
