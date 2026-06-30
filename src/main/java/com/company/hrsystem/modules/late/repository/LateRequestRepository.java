package com.company.hrsystem.modules.late.repository;

import com.company.hrsystem.common.constant.LateRequestStatus;
import com.company.hrsystem.modules.late.entity.LateRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LateRequestRepository extends JpaRepository<LateRequest, Long> {

    Optional<LateRequest> findByUserIdAndRequestDate(Long userId, LocalDate requestDate);

    List<LateRequest> findByUserIdOrderByRequestDateDesc(Long userId);

    List<LateRequest> findByStatus(LateRequestStatus status);

    List<LateRequest> findAllByOrderByRequestDateDesc();

    List<LateRequest> findByStatusOrderByRequestDateDesc(LateRequestStatus status);
}
