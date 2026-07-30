package com.learnify.backend.controller;

import com.learnify.backend.dto.admin.AdminUpdateRoleRequest;
import com.learnify.backend.dto.admin.AdminUpdateStatusRequest;
import com.learnify.backend.dto.admin.PasswordResetAdminResponse;
import com.learnify.backend.dto.admin.ResolvePasswordResetRequest;
import com.learnify.backend.dto.auth.SignupRequest;
import com.learnify.backend.dto.auth.UserResponse;
import com.learnify.backend.entity.auth.PasswordResetRequest;
import com.learnify.backend.entity.auth.Role;
import com.learnify.backend.entity.auth.User;
import com.learnify.backend.enums.RoleName;
import com.learnify.backend.exception.ResourceAlreadyExistsException;
import com.learnify.backend.exception.ResourceNotFoundException;
import com.learnify.backend.repository.PasswordResetRequestRepository;
import com.learnify.backend.repository.RoleRepository;
import com.learnify.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PasswordResetRequestRepository passwordResetRequestRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(
            PasswordResetRequestRepository passwordResetRequestRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.passwordResetRequestRepository = passwordResetRequestRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers(
            @RequestParam(required = false) String role) {

        List<User> users = userRepository.findAll();

        if (role != null && !role.isBlank()) {
            try {
                RoleName roleName = RoleName.valueOf(role.trim().toUpperCase());
                users = users.stream()
                        .filter(user -> user.getRole().getName() == roleName)
                        .toList();
            } catch (IllegalArgumentException ignored) {
                users = List.of();
            }
        }

        List<UserResponse> response = users.stream()
                .map(this::toUserResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email is already registered.");
        }

        RoleName roleName;
        try {
            roleName = request.getRole() == null || request.getRole().isBlank()
                    ? RoleName.ROLE_STUDENT
                    : RoleName.valueOf(request.getRole().trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid role selected.");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found."));

        User user = new User();
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(request.getEmail().trim());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);
        user.setEmailVerified(false);
        user.setRole(role);

        User savedUser = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(toUserResponse(savedUser));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateRoleRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        RoleName roleName;
        try {
            roleName = RoleName.valueOf(request.getRole().trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid role selected.");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found."));

        user.setRole(role);

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(toUserResponse(savedUser));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateStatusRequest request) {

        if (request.getEnabled() == null) {
            throw new IllegalArgumentException("Enabled status is required.");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        user.setEnabled(request.getEnabled());

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(toUserResponse(savedUser));
    }

    @GetMapping("/password-reset-requests")
    public ResponseEntity<List<PasswordResetAdminResponse>> getPasswordResetRequests() {
        List<PasswordResetAdminResponse> response = passwordResetRequestRepository
                .findByResolvedFalseOrderByCreatedAtDesc()
                .stream()
                .map(this::toPasswordResetResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/password-reset-requests/{id}/resolve")
    public ResponseEntity<PasswordResetAdminResponse> resolvePasswordResetRequest(
            @PathVariable Long id,
            @Valid @RequestBody ResolvePasswordResetRequest request) {

        PasswordResetRequest resetRequest = passwordResetRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Password reset request not found."));

        User user = resetRequest.getUser();
        user.setPassword(passwordEncoder.encode(request.getTemporaryPassword()));
        user.setForcePasswordChange(true);
        userRepository.save(user);

        resetRequest.setResolved(true);
        resetRequest.setTemporaryPasswordPlain(request.getTemporaryPassword());
        resetRequest.setTemporaryPasswordViewed(false);
        PasswordResetRequest savedRequest = passwordResetRequestRepository.save(resetRequest);

        return ResponseEntity.ok(toPasswordResetResponse(savedRequest));
    }

    private UserResponse toUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setProfileImage(user.getProfileImage());
        response.setRole(user.getRole().getName().name());
        response.setEnabled(user.getEnabled());
        response.setForcePasswordChange(user.getForcePasswordChange());
        return response;
    }

    private PasswordResetAdminResponse toPasswordResetResponse(PasswordResetRequest request) {
        PasswordResetAdminResponse response = new PasswordResetAdminResponse();
        response.setId(request.getId());
        response.setUserId(request.getUser().getId());
        response.setFirstName(request.getUser().getFirstName());
        response.setLastName(request.getUser().getLastName());
        response.setEmail(request.getUser().getEmail());
        response.setRole(request.getUser().getRole().getName().name());
        response.setEnabled(request.getUser().getEnabled());
        response.setCreatedAt(request.getCreatedAt());
        response.setResolved(request.isResolved());
        return response;
    }
}
