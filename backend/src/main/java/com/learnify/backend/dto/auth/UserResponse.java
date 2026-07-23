package com.learnify.backend.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String profileImage;

    private String role;
}