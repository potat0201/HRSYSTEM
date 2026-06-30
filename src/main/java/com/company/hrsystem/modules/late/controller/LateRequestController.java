package com.company.hrsystem.modules.late.controller;

import com.company.hrsystem.common.constant.LateRequestStatus;
import com.company.hrsystem.common.response.ApiResponse;
import com.company.hrsystem.modules.late.dto.LateRequestCreateRequest;
import com.company.hrsystem.modules.late.dto.LateRequestDecisionRequest;
import com.company.hrsystem.modules.late.dto.LateRequestResponse;
import com.company.hrsystem.modules.late.service.LateRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/late-requests")
@RequiredArgsConstructor
public class LateRequestController {

    private final LateRequestService lateRequestService;

    @PostMapping
    public ApiResponse<LateRequestResponse> createLateRequest(
            @Valid @RequestBody LateRequestCreateRequest request
    ) {
        return ApiResponse.success(lateRequestService.createLateRequest(request));
    }

    @PatchMapping("/{lateRequestId}/cancel")
    public ApiResponse<LateRequestResponse> cancelLateRequest(
            @PathVariable Long lateRequestId,
            @RequestParam Long userId
    ) {
        return ApiResponse.success(lateRequestService.cancelLateRequest(lateRequestId, userId));
    }

    @GetMapping("/my")
    public ApiResponse<List<LateRequestResponse>> getMyLateRequests(@RequestParam Long userId) {
        return ApiResponse.success(lateRequestService.getMyLateRequests(userId));
    }

    @GetMapping("/admin")
    public ApiResponse<List<LateRequestResponse>> getLateRequests(
            @RequestParam(required = false) LateRequestStatus status
    ) {
        return ApiResponse.success(lateRequestService.getLateRequests(status));
    }

    @PatchMapping("/admin/{lateRequestId}/approve")
    public ApiResponse<LateRequestResponse> approveLateRequest(
            @PathVariable Long lateRequestId,
            @Valid @RequestBody LateRequestDecisionRequest request
    ) {
        return ApiResponse.success(lateRequestService.approveLateRequest(lateRequestId, request));
    }

    @PatchMapping("/admin/{lateRequestId}/reject")
    public ApiResponse<LateRequestResponse> rejectLateRequest(
            @PathVariable Long lateRequestId,
            @Valid @RequestBody LateRequestDecisionRequest request
    ) {
        return ApiResponse.success(lateRequestService.rejectLateRequest(lateRequestId, request));
    }
}
