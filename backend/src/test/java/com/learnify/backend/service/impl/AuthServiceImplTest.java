package com.learnify.backend.service.impl;

import com.learnify.backend.dto.auth.LoginRequest;
import com.learnify.backend.entity.auth.Role;
import com.learnify.backend.entity.auth.User;
import com.learnify.backend.enums.RoleName;
import com.learnify.backend.repository.RoleRepository;
import com.learnify.backend.repository.UserRepository;
import com.learnify.backend.service.jwt.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceImplTest {

    @Test
    void loginRejectsEmailThatHasNotBeenVerified() {
        UserRepository userRepository = mock(UserRepository.class);
        RoleRepository roleRepository = mock(RoleRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        JwtService jwtService = mock(JwtService.class);

        AuthServiceImpl authService = new AuthServiceImpl(
                userRepository,
                roleRepository,
                passwordEncoder,
                jwtService
        );

        User user = new User();
        user.setEmail("student@example.com");
        user.setPassword("hashedPassword");
        user.setEnabled(true);
        user.setEmailVerified(false);

        Role role = new Role();
        role.setName(RoleName.ROLE_STUDENT);
        user.setRole(role);

        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password123", "hashedPassword")).thenReturn(true);

        LoginRequest request = new LoginRequest();
        request.setEmail("student@example.com");
        request.setPassword("Password123");

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> authService.login(request)
        );

        assertEquals("Please verify your email before signing in.", ex.getMessage());
    }

    @Test
    void verifyEmailAcceptsTokensWithSurroundingWhitespace() {
        UserRepository userRepository = mock(UserRepository.class);
        RoleRepository roleRepository = mock(RoleRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        JwtService jwtService = mock(JwtService.class);

        AuthServiceImpl authService = new AuthServiceImpl(
                userRepository,
                roleRepository,
                passwordEncoder,
                jwtService
        );

        User user = new User();
        user.setEmailVerificationToken("  abc123-token  ");
        user.setEmailVerified(false);

        when(userRepository.findAll()).thenReturn(List.of(user));

        String message = authService.verifyEmail(" abc123-token ");

        assertEquals("Email verified successfully. You can now sign in.", message);
        assertTrue(user.getEmailVerified());
        assertNull(user.getEmailVerificationToken());
    }
}
