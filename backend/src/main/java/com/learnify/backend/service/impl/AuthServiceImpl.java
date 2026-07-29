package com.learnify.backend.service.impl;

import com.learnify.backend.dto.auth.LoginRequest;
import com.learnify.backend.dto.auth.LoginResponse;
import com.learnify.backend.dto.auth.ChangePasswordRequest;
import com.learnify.backend.dto.auth.SignupRequest;
import com.learnify.backend.dto.auth.UserResponse;
import com.learnify.backend.enums.RoleName;

import com.learnify.backend.exception.ResourceAlreadyExistsException;
import com.learnify.backend.exception.ResourceNotFoundException;
import com.learnify.backend.repository.RoleRepository;
import com.learnify.backend.repository.UserRepository;

import com.learnify.backend.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.learnify.backend.entity.auth.Role;
import com.learnify.backend.entity.auth.User;

import com.learnify.backend.service.jwt.JwtService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public UserResponse register(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email is already registered.");
        }

        Role selectedRole = roleRepository.findByName(RoleName.ROLE_STUDENT)
            .orElseThrow(() -> new ResourceNotFoundException("Default student role not found."));

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setPhoneNumber(request.getPhoneNumber());

        user.setEnabled(true);

        user.setEmailVerified(false);

        user.setForcePasswordChange(false);

        user.setRole(selectedRole);

        User savedUser = userRepository.save(user);

        UserResponse response = new UserResponse();

        response.setId(savedUser.getId());
        response.setFirstName(savedUser.getFirstName());
        response.setLastName(savedUser.getLastName());
        response.setEmail(savedUser.getEmail());
        response.setPhoneNumber(savedUser.getPhoneNumber());
        response.setProfileImage(savedUser.getProfileImage());
        response.setRole(savedUser.getRole().getName().name());
        response.setEnabled(savedUser.getEnabled());
        response.setForcePasswordChange(savedUser.getForcePasswordChange());

        return response;
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password."));

        if (Boolean.FALSE.equals(user.getEnabled())) {
            throw new IllegalArgumentException("This account has been disabled. Please contact admin.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid email or password.");
        }

        String token = jwtService.generateToken(user.getEmail());

        UserResponse userResponse = new UserResponse();

        userResponse.setId(user.getId());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setEmail(user.getEmail());
        userResponse.setPhoneNumber(user.getPhoneNumber());
        userResponse.setProfileImage(user.getProfileImage());
        userResponse.setRole(user.getRole().getName().name());
        userResponse.setEnabled(user.getEnabled());
        userResponse.setForcePasswordChange(user.getForcePasswordChange());

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUser(userResponse);

        return response;
    }

    @Override
    public String changeTemporaryPassword(String email, ChangePasswordRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setForcePasswordChange(false);
        userRepository.save(user);

        return "Password changed successfully.";
    }
}