package com.learnify.backend.service;

import com.learnify.backend.dto.auth.LoginRequest;
import com.learnify.backend.dto.auth.LoginResponse;
import com.learnify.backend.dto.auth.ChangePasswordRequest;
import com.learnify.backend.dto.auth.SignupRequest;
import com.learnify.backend.dto.auth.UserResponse;

public interface AuthService {

    UserResponse register(SignupRequest request);

    LoginResponse login(LoginRequest request);

    String changeTemporaryPassword(String email, ChangePasswordRequest request);
}