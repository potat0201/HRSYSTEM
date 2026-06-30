package com.company.hrsystem.modules.late.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class LateRequestCreateRequest {

    @NotNull
    private Long userId;

    @NotNull
    private LocalDate requestDate;

    @NotBlank
    private String reason;
}
