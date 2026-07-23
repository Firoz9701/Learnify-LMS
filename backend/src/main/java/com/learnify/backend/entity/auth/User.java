package com.learnify.backend.entity.auth;

import com.learnify.backend.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 15)
    private String phoneNumber;

    private String profileImage;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Column(nullable = false)
    private Boolean emailVerified = false;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
}