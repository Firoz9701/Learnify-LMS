package com.learnify.backend.service;

import com.learnify.backend.dto.auth.SignupRequest;
import com.learnify.backend.dto.auth.UserResponse;

public interface AuthService {

    UserResponse register(SignupRequest request);

}