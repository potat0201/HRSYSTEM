package com.company.hrsystem.modules.attendance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckOutRequest {

    @NotNull
    private Long userId;
}
