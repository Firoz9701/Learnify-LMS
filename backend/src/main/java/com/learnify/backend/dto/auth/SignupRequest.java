package com.learnify.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters")
    @Pattern(regexp = "^[A-Za-z][A-Za-z\\s'\\-]{1,99}$", message = "First name can contain letters, spaces, apostrophe, and hyphen only")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters")
    @Pattern(regexp = "^[A-Za-z][A-Za-z\\s'\\-]{1,99}$", message = "Last name can contain letters, spaces, apostrophe, and hyphen only")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email")
    @Size(max = 255, message = "Email is too long")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 50, message = "Password must be between 8 and 50 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,50}$",
            message = "Password must include uppercase, lowercase, number, and special character")
    private String password;

    @Pattern(regexp = "^$|^[0-9]{10,15}$", message = "Phone number must contain only digits and be between 10 and 15 digits")
    private String phoneNumber;

    private String role;
}