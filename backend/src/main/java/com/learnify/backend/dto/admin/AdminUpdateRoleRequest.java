package com.learnify.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUpdateRoleRequest {

    @NotBlank(message = "Role is required")
    private String role;
}
