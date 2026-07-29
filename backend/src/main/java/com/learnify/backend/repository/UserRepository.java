package com.learnify.backend.repository;

import com.learnify.backend.entity.auth.User;
import com.learnify.backend.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findFirstByRole_Name(RoleName roleName);

}