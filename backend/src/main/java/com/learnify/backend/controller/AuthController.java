package com.learnify.backend.controller;

import com.learnify.backend.dto.auth.ChangePasswordRequest;
import com.learnify.backend.dto.auth.LoginRequest;
import com.learnify.backend.dto.auth.LoginResponse;
import com.learnify.backend.dto.auth.ForgotPasswordRequestDto;
import com.learnify.backend.dto.auth.SignupRequest;
import com.learnify.backend.dto.auth.UserResponse;
import com.learnify.backend.entity.auth.PasswordResetRequest;
import com.learnify.backend.entity.auth.User;
import com.learnify.backend.repository.PasswordResetRequestRepository;
import com.learnify.backend.repository.UserRepository;
import com.learnify.backend.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordResetRequestRepository passwordResetRequestRepository;

    public AuthController(
            AuthService authService,
            UserRepository userRepository,
            PasswordResetRequestRepository passwordResetRequestRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordResetRequestRepository = passwordResetRequestRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody SignupRequest request) {

        UserResponse response = authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

        System.out.println("Login endpoint hit");

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password-request")
    public ResponseEntity<Map<String, String>> forgotPasswordRequest(
            @Valid @RequestBody ForgotPasswordRequestDto request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user != null && !passwordResetRequestRepository.existsByUserAndResolvedFalse(user)) {
            PasswordResetRequest resetRequest = new PasswordResetRequest();
            resetRequest.setUser(user);
            resetRequest.setResolved(false);
            passwordResetRequestRepository.save(resetRequest);
        }

        return ResponseEntity.ok(Map.of(
                "message",
                "If an account exists for this email, the reset request has been submitted to admin."
        ));
    }

    @PostMapping("/change-temporary-password")
    public ResponseEntity<Map<String, String>> changeTemporaryPassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        String message = authService.changeTemporaryPassword(authentication.getName(), request);

        return ResponseEntity.ok(Map.of("message", message));
    }
}