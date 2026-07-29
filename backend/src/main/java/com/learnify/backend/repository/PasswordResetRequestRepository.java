package com.learnify.backend.repository;

import com.learnify.backend.entity.auth.PasswordResetRequest;
import com.learnify.backend.entity.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PasswordResetRequestRepository extends JpaRepository<PasswordResetRequest, Long> {

    List<PasswordResetRequest> findByResolvedFalseOrderByCreatedAtDesc();

    boolean existsByUserAndResolvedFalse(User user);
}
