package com.company.hrsystem.modules.employee.service;

import com.company.hrsystem.common.constant.UserStatus;
import com.company.hrsystem.modules.employee.dto.EmployeeCreateRequest;
import com.company.hrsystem.modules.employee.dto.EmployeeResponse;
import com.company.hrsystem.modules.employee.dto.EmployeeUpdateRequest;

import java.util.List;

public interface EmployeeService {

    EmployeeResponse createEmployee(EmployeeCreateRequest request);

    EmployeeResponse updateEmployee(Long employeeId, EmployeeUpdateRequest request);

    void deactivateEmployee(Long employeeId);

    EmployeeResponse getEmployeeById(Long employeeId);

    List<EmployeeResponse> getEmployees(String fullName, UserStatus status);

    List<EmployeeResponse> getInactiveEmployees();

    EmployeeResponse grantAdmin(Long employeeId);

    EmployeeResponse revokeAdmin(Long employeeId);

    List<EmployeeResponse> getAdmins();
}
