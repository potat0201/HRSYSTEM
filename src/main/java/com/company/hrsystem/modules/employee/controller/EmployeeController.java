package com.company.hrsystem.modules.employee.controller;

import com.company.hrsystem.common.constant.UserStatus;
import com.company.hrsystem.common.response.ApiResponse;
import com.company.hrsystem.modules.employee.dto.EmployeeCreateRequest;
import com.company.hrsystem.modules.employee.dto.EmployeeResponse;
import com.company.hrsystem.modules.employee.dto.EmployeeUpdateRequest;
import com.company.hrsystem.modules.employee.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    public ApiResponse<EmployeeResponse> createEmployee(@Valid @RequestBody EmployeeCreateRequest request) {
        return ApiResponse.success(employeeService.createEmployee(request));
    }

    @GetMapping
    public ApiResponse<List<EmployeeResponse>> getEmployees(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) UserStatus status
    ) {
        return ApiResponse.success(employeeService.getEmployees(fullName, status));
    }

    @GetMapping("/inactive")
    public ApiResponse<List<EmployeeResponse>> getInactiveEmployees() {
        return ApiResponse.success(employeeService.getInactiveEmployees());
    }

    @GetMapping("/admins")
    public ApiResponse<List<EmployeeResponse>> getAdmins() {
        return ApiResponse.success(employeeService.getAdmins());
    }

    @GetMapping("/{employeeId}")
    public ApiResponse<EmployeeResponse> getEmployeeById(@PathVariable Long employeeId) {
        return ApiResponse.success(employeeService.getEmployeeById(employeeId));
    }

    @PutMapping("/{employeeId}")
    public ApiResponse<EmployeeResponse> updateEmployee(
            @PathVariable Long employeeId,
            @Valid @RequestBody EmployeeUpdateRequest request
    ) {
        return ApiResponse.success(employeeService.updateEmployee(employeeId, request));
    }

    @DeleteMapping("/{employeeId}")
    public ApiResponse<Void> deactivateEmployee(@PathVariable Long employeeId) {
        employeeService.deactivateEmployee(employeeId);
        return ApiResponse.success("Employee deactivated", null);
    }

    @PatchMapping("/{employeeId}/grant-admin")
    public ApiResponse<EmployeeResponse> grantAdmin(@PathVariable Long employeeId) {
        return ApiResponse.success(employeeService.grantAdmin(employeeId));
    }

    @PatchMapping("/{employeeId}/revoke-admin")
    public ApiResponse<EmployeeResponse> revokeAdmin(@PathVariable Long employeeId) {
        return ApiResponse.success(employeeService.revokeAdmin(employeeId));
    }
}
