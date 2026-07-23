package com.learnify.backend.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

    private String token;
    private String type = "Bearer";
    private UserResponse user;
}