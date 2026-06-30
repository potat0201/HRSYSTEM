package com.company.hrsystem.modules.late.service.impl;

import com.company.hrsystem.common.constant.LateRequestStatus;
import com.company.hrsystem.common.constant.Role;
import com.company.hrsystem.common.constant.UserStatus;
import com.company.hrsystem.common.exception.BusinessException;
import com.company.hrsystem.common.exception.ErrorCode;
import com.company.hrsystem.modules.attendance.repository.AttendanceRepository;
import com.company.hrsystem.modules.employee.entity.User;
import com.company.hrsystem.modules.employee.repository.UserRepository;
import com.company.hrsystem.modules.late.dto.LateRequestCreateRequest;
import com.company.hrsystem.modules.late.dto.LateRequestDecisionRequest;
import com.company.hrsystem.modules.late.dto.LateRequestResponse;
import com.company.hrsystem.modules.late.entity.LateRequest;
import com.company.hrsystem.modules.late.repository.LateRequestRepository;
import com.company.hrsystem.modules.late.service.LateRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LateRequestServiceImpl implements LateRequestService {

    private final LateRequestRepository lateRequestRepository;

    private final UserRepository userRepository;

    private final AttendanceRepository attendanceRepository;

    @Override
    public LateRequestResponse createLateRequest(LateRequestCreateRequest request) {
        User user = getActiveUser(request.getUserId());
        LocalDate requestDate = request.getRequestDate();

        if (requestDate.isBefore(LocalDate.now())) {
            throw new BusinessException(ErrorCode.PAST_DATE_NOT_ALLOWED);
        }

        if (lateRequestRepository.findByUserIdAndRequestDate(user.getId(), requestDate).isPresent()) {
            throw new BusinessException(ErrorCode.LATE_REQUEST_ALREADY_EXISTS);
        }

        attendanceRepository.findByUserIdAndAttendanceDate(user.getId(), requestDate)
                .filter(attendance -> attendance.getCheckInTime() != null)
                .ifPresent(attendance -> {
                    throw new BusinessException(ErrorCode.ALREADY_CHECKED_IN);
                });

        LateRequest lateRequest = LateRequest.builder()
                .user(user)
                .requestDate(requestDate)
                .reason(request.getReason().trim())
                .status(LateRequestStatus.PENDING)
                .build();

        return toResponse(lateRequestRepository.save(lateRequest));
    }

    @Override
    public LateRequestResponse cancelLateRequest(Long lateRequestId, Long userId) {
        LateRequest lateRequest = getLateRequest(lateRequestId);

        if (!lateRequest.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        if (lateRequest.getStatus() != LateRequestStatus.PENDING) {
            throw new BusinessException(ErrorCode.LATE_REQUEST_ALREADY_PROCESSED);
        }

        lateRequest.setStatus(LateRequestStatus.CANCELLED);
        return toResponse(lateRequestRepository.save(lateRequest));
    }

    @Override
    public LateRequestResponse approveLateRequest(Long lateRequestId, LateRequestDecisionRequest request) {
        return decide(lateRequestId, request.getAdminId(), LateRequestStatus.APPROVED);
    }

    @Override
    public LateRequestResponse rejectLateRequest(Long lateRequestId, LateRequestDecisionRequest request) {
        return decide(lateRequestId, request.getAdminId(), LateRequestStatus.REJECTED);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LateRequestResponse> getMyLateRequests(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return toResponses(lateRequestRepository.findByUserIdOrderByRequestDateDesc(userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LateRequestResponse> getLateRequests(LateRequestStatus status) {
        if (status == null) {
            return toResponses(lateRequestRepository.findAllByOrderByRequestDateDesc());
        }
        return toResponses(lateRequestRepository.findByStatusOrderByRequestDateDesc(status));
    }

    private LateRequestResponse decide(Long lateRequestId, Long adminId, LateRequestStatus status) {
        User admin = getActiveUser(adminId);
        if (admin.getRole() != Role.ADMIN) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        LateRequest lateRequest = getLateRequest(lateRequestId);
        if (lateRequest.getStatus() != LateRequestStatus.PENDING) {
            throw new BusinessException(ErrorCode.LATE_REQUEST_ALREADY_PROCESSED);
        }

        lateRequest.setStatus(status);
        lateRequest.setApprovedBy(admin);
        lateRequest.setApprovedAt(LocalDateTime.now());

        return toResponse(lateRequestRepository.save(lateRequest));
    }

    private User getActiveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return user;
    }

    private LateRequest getLateRequest(Long lateRequestId) {
        return lateRequestRepository.findById(lateRequestId)
                .orElseThrow(() -> new BusinessException(ErrorCode.LATE_REQUEST_NOT_FOUND));
    }

    private List<LateRequestResponse> toResponses(List<LateRequest> requests) {
        return requests.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private LateRequestResponse toResponse(LateRequest lateRequest) {
        User user = lateRequest.getUser();
        User approvedBy = lateRequest.getApprovedBy();

        return LateRequestResponse.builder()
                .id(lateRequest.getId())
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .requestDate(lateRequest.getRequestDate())
                .reason(lateRequest.getReason())
                .status(lateRequest.getStatus())
                .approvedBy(approvedBy == null ? null : approvedBy.getId())
                .approvedAt(lateRequest.getApprovedAt())
                .createdAt(lateRequest.getCreatedAt())
                .build();
    }
}
