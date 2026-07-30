package com.learnify.backend.service.impl;

import com.learnify.backend.dto.auth.LoginRequest;
import com.learnify.backend.dto.auth.LoginResponse;
import com.learnify.backend.dto.auth.ChangePasswordRequest;
import com.learnify.backend.dto.auth.ProfileUpdateRequest;
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

    private static final java.util.Set<String> COMMON_WEAK_PASSWORDS = java.util.Set.of(
            "password",
            "password123",
            "12345678",
            "qwerty123",
            "admin123",
            "letmein123");

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

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String firstName = request.getFirstName().trim();
        String lastName = request.getLastName().trim();
        String phoneNumber = request.getPhoneNumber() == null ? null : request.getPhoneNumber().trim();

        if (COMMON_WEAK_PASSWORDS.contains(request.getPassword().toLowerCase())) {
            throw new IllegalArgumentException("Choose a stronger password. This password is too common.");
        }

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResourceAlreadyExistsException("Email is already registered.");
        }

        Role selectedRole = roleRepository.findByName(RoleName.ROLE_STUDENT)
            .orElseThrow(() -> new ResourceNotFoundException("Default student role not found."));

        User user = new User();

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(normalizedEmail);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setPhoneNumber(phoneNumber == null || phoneNumber.isBlank() ? null : phoneNumber);

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

    @Override
    public UserResponse getCurrentUserProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        return toUserResponse(user);
    }

    @Override
    public UserResponse updateCurrentUserProfile(String email, ProfileUpdateRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setPhoneNumber(request.getPhoneNumber() == null ? null : request.getPhoneNumber().trim());

        User savedUser = userRepository.save(user);

        return toUserResponse(savedUser);
    }

    private UserResponse toUserResponse(User user) {

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

        return userResponse;
    }
}