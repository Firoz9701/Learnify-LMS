package com.learnify.backend.config;

import com.learnify.backend.entity.auth.Role;
import com.learnify.backend.entity.auth.User;
import com.learnify.backend.enums.RoleName;
import com.learnify.backend.repository.RoleRepository;
import com.learnify.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        createAdmin();
        createInstructor();
        createStudent();

        System.out.println("Demo users verified.");
    }

    private void createAdmin() {

        if (userRepository.existsByEmail("firoz@gmail.com"))
            return;

        Role role = roleRepository.findByName(RoleName.ROLE_ADMIN).orElseThrow();

        User user = new User();

        user.setFirstName("Firoz");
        user.setLastName("Khan");
        user.setEmail("firoz@gmail.com");
        user.setPhoneNumber("9876543210");
        user.setPassword(passwordEncoder.encode("Password123"));
        user.setEnabled(true);
        user.setRole(role);

        userRepository.save(user);
    }

    private void createInstructor() {

        if (userRepository.existsByEmail("instructor@learnify.com"))
            return;

        Role role = roleRepository.findByName(RoleName.ROLE_INSTRUCTOR).orElseThrow();

        User user = new User();

        user.setFirstName("Learnify");
        user.setLastName("Instructor");
        user.setEmail("instructor@learnify.com");
        user.setPhoneNumber("9999999999");
        user.setPassword(passwordEncoder.encode("instructor123"));
        user.setEnabled(true);
        user.setRole(role);

        userRepository.save(user);
    }

    private void createStudent() {

        if (userRepository.existsByEmail("student@learnify.com"))
            return;

        Role role = roleRepository.findByName(RoleName.ROLE_STUDENT).orElseThrow();

        User user = new User();

        user.setFirstName("Learnify");
        user.setLastName("Student");
        user.setEmail("student@learnify.com");
        user.setPhoneNumber("8888888888");
        user.setPassword(passwordEncoder.encode("student123"));
        user.setEnabled(true);
        user.setRole(role);

        userRepository.save(user);
    }
}