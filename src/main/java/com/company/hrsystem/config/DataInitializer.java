package com.company.hrsystem.config;

import com.company.hrsystem.common.constant.AttendanceStatus;
import com.company.hrsystem.common.constant.Role;
import com.company.hrsystem.common.constant.UserStatus;
import com.company.hrsystem.modules.attendance.entity.Attendance;
import com.company.hrsystem.modules.attendance.repository.AttendanceRepository;
import com.company.hrsystem.modules.employee.entity.User;
import com.company.hrsystem.modules.employee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("Database is empty. Initializing default admin and mock employees...");

            // 1. Create Default Admin
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("System Administrator")
                    .email("admin@hrsystem.com")
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
            log.info("Admin user created.");

            // 2. Create Mock Employees
            List<User> employees = new ArrayList<>();
            
            employees.add(User.builder()
                    .username("nguyenvanan")
                    .password(passwordEncoder.encode("user123"))
                    .fullName("Nguyễn Văn An")
                    .email("an.nv@hrsystem.com")
                    .phone("0912345678")
                    .department("IT Department")
                    .role(Role.EMPLOYEE)
                    .status(UserStatus.ACTIVE)
                    .createdAt(LocalDateTime.now().minusDays(10))
                    .build());

            employees.add(User.builder()
                    .username("tranthisinh")
                    .password(passwordEncoder.encode("user123"))
                    .fullName("Trần Thị Sinh")
                    .email("sinh.tt@hrsystem.com")
                    .phone("0987654321")
                    .department("Human Resources")
                    .role(Role.EMPLOYEE)
                    .status(UserStatus.ACTIVE)
                    .createdAt(LocalDateTime.now().minusDays(10))
                    .build());

            employees.add(User.builder()
                    .username("lehoangnam")
                    .password(passwordEncoder.encode("user123"))
                    .fullName("Lê Hoàng Nam")
                    .email("nam.lh@hrsystem.com")
                    .phone("0905123456")
                    .department("Sales & Marketing")
                    .role(Role.EMPLOYEE)
                    .status(UserStatus.ACTIVE)
                    .createdAt(LocalDateTime.now().minusDays(10))
                    .build());

            employees.add(User.builder()
                    .username("phamminhduc")
                    .password(passwordEncoder.encode("user123"))
                    .fullName("Phạm Minh Đức")
                    .email("duc.pm@hrsystem.com")
                    .phone("0934567890")
                    .department("IT Department")
                    .role(Role.EMPLOYEE)
                    .status(UserStatus.ACTIVE)
                    .createdAt(LocalDateTime.now().minusDays(10))
                    .build());

            employees.add(User.builder()
                    .username("vuthimai")
                    .password(passwordEncoder.encode("user123"))
                    .fullName("Vũ Thị Mai")
                    .email("mai.vt@hrsystem.com")
                    .phone("0978123456")
                    .department("Finance")
                    .role(Role.EMPLOYEE)
                    .status(UserStatus.ACTIVE)
                    .createdAt(LocalDateTime.now().minusDays(10))
                    .build());

            userRepository.saveAll(employees);
            log.info("5 Mock employees created.");

            // 3. Create Mock Attendance Records for the last 5 days
            log.info("Initializing mock attendance records for the last 5 days...");
            LocalDate today = LocalDate.now();
            List<Attendance> attendances = new ArrayList<>();

            for (int i = 0; i < 5; i++) {
                LocalDate date = today.minusDays(i);
                // Skip weekends for mock records
                if (date.getDayOfWeek().getValue() >= 6) {
                    continue;
                }

                // Nguyễn Văn An - Present (Early/On time)
                attendances.add(Attendance.builder()
                        .user(employees.get(0))
                        .attendanceDate(date)
                        .checkInTime(LocalDateTime.of(date, LocalTime.of(8, 15)))
                        .checkOutTime(LocalDateTime.of(date, LocalTime.of(17, 30)))
                        .status(AttendanceStatus.PRESENT)
                        .build());

                // Trần Thị Sinh - Present (Late sometimes)
                if (i % 3 == 0) {
                    attendances.add(Attendance.builder()
                            .user(employees.get(1))
                            .attendanceDate(date)
                            .checkInTime(LocalDateTime.of(date, LocalTime.of(9, 15)))
                            .checkOutTime(LocalDateTime.of(date, LocalTime.of(17, 45)))
                            .status(AttendanceStatus.LATE)
                            .build());
                } else {
                    attendances.add(Attendance.builder()
                            .user(employees.get(1))
                            .attendanceDate(date)
                            .checkInTime(LocalDateTime.of(date, LocalTime.of(8, 25)))
                            .checkOutTime(LocalDateTime.of(date, LocalTime.of(17, 35)))
                            .status(AttendanceStatus.PRESENT)
                            .build());
                }

                // Lê Hoàng Nam - Absent once, otherwise present
                if (i == 2) {
                    attendances.add(Attendance.builder()
                            .user(employees.get(2))
                            .attendanceDate(date)
                            .status(AttendanceStatus.ABSENT)
                            .build());
                } else {
                    attendances.add(Attendance.builder()
                            .user(employees.get(2))
                            .attendanceDate(date)
                            .checkInTime(LocalDateTime.of(date, LocalTime.of(8, 20)))
                            .checkOutTime(LocalDateTime.of(date, LocalTime.of(17, 30)))
                            .status(AttendanceStatus.PRESENT)
                            .build());
                }

                // Phạm Minh Đức - Present (On time)
                attendances.add(Attendance.builder()
                        .user(employees.get(3))
                        .attendanceDate(date)
                        .checkInTime(LocalDateTime.of(date, LocalTime.of(8, 10)))
                        .checkOutTime(LocalDateTime.of(date, LocalTime.of(17, 30)))
                        .status(AttendanceStatus.PRESENT)
                        .build());

                // Vũ Thị Mai - Late twice, otherwise present
                if (i == 1 || i == 4) {
                    attendances.add(Attendance.builder()
                            .user(employees.get(4))
                            .attendanceDate(date)
                            .checkInTime(LocalDateTime.of(date, LocalTime.of(9, 05)))
                            .checkOutTime(LocalDateTime.of(date, LocalTime.of(17, 30)))
                            .status(AttendanceStatus.LATE)
                            .build());
                } else {
                    attendances.add(Attendance.builder()
                            .user(employees.get(4))
                            .attendanceDate(date)
                            .checkInTime(LocalDateTime.of(date, LocalTime.of(8, 18)))
                            .checkOutTime(LocalDateTime.of(date, LocalTime.of(17, 32)))
                            .status(AttendanceStatus.PRESENT)
                            .build());
                }
            }

            attendanceRepository.saveAll(attendances);
            log.info("Mock attendance records created successfully!");
        } else {
            log.info("Database already contains data. Skipping mock data initialization.");
        }
    }
}
