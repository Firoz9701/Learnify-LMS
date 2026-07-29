package com.learnify.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResolvePasswordResetRequest {

    @NotBlank(message = "Temporary password is required")
    @Size(min = 8, max = 50, message = "Password must be between 8 and 50 characters")
    private String temporaryPassword;
}
