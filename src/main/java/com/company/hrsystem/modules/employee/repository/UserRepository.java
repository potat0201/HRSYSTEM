package com.company.hrsystem.modules.employee.repository;

import com.company.hrsystem.common.constant.Role;
import com.company.hrsystem.common.constant.UserStatus;
import com.company.hrsystem.modules.employee.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    List<User> findByStatus(UserStatus status);

    List<User> findByRole(Role role);

    List<User> findByFullNameContainingIgnoreCase(String fullName);

    List<User> findByFullNameContainingIgnoreCaseAndStatus(String fullName, UserStatus status);
}
