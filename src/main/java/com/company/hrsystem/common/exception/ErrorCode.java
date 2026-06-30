package com.company.hrsystem.common.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    USERNAME_ALREADY_EXISTS("Username already exists"),
    EMAIL_ALREADY_EXISTS("Email already exists"),
    USER_NOT_FOUND("User not found"),
    INVALID_REQUEST("Invalid request"),
    INVALID_LOGIN("Invalid username or password"),
    ACCESS_DENIED("Access denied"),
    ATTENDANCE_NOT_FOUND("Attendance not found"),
    ATTENDANCE_ALREADY_EXISTS("Attendance already exists"),
    ALREADY_CHECKED_IN("User already checked in today"),
    ALREADY_CHECKED_OUT("User already checked out today"),
    CHECK_IN_REQUIRED("User must check in before check out"),
    LATE_REQUEST_NOT_FOUND("Late request not found"),
    LATE_REQUEST_ALREADY_EXISTS("Late request already exists for this date"),
    LATE_REQUEST_ALREADY_PROCESSED("Late request is already processed"),
    PAST_DATE_NOT_ALLOWED("Past date is not allowed");

    private final String message;

    ErrorCode(String message) {
        this.message = message;
    }
}
