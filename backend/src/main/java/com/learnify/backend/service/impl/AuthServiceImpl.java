package com.learnify.backend.service.impl;

import com.learnify.backend.dto.auth.SignupRequest;
import com.learnify.backend.dto.auth.UserResponse;
import com.learnify.backend.repository.RoleRepository;
import com.learnify.backend.repository.UserRepository;
import com.learnify.backend.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse register(SignupRequest request) {

        return null;
    }
}