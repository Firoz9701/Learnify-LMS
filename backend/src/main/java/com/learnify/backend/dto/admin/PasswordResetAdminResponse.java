package com.learnify.backend.dto.admin;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PasswordResetAdminResponse {

    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private Boolean enabled;
    private LocalDateTime createdAt;
    private boolean resolved;
}
