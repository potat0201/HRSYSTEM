package com.company.hrsystem.modules.late.service;

import com.company.hrsystem.common.constant.LateRequestStatus;
import com.company.hrsystem.modules.late.dto.LateRequestCreateRequest;
import com.company.hrsystem.modules.late.dto.LateRequestDecisionRequest;
import com.company.hrsystem.modules.late.dto.LateRequestResponse;

import java.util.List;

public interface LateRequestService {

    LateRequestResponse createLateRequest(LateRequestCreateRequest request);

    LateRequestResponse cancelLateRequest(Long lateRequestId, Long userId);

    LateRequestResponse approveLateRequest(Long lateRequestId, LateRequestDecisionRequest request);

    LateRequestResponse rejectLateRequest(Long lateRequestId, LateRequestDecisionRequest request);

    List<LateRequestResponse> getMyLateRequests(Long userId);

    List<LateRequestResponse> getLateRequests(LateRequestStatus status);
}
