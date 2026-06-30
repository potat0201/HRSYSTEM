package com.company.hrsystem.modules.late.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LateRequestDecisionRequest {

    @NotNull
    private Long adminId;
}
