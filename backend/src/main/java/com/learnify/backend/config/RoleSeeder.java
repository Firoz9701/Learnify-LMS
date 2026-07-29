package com.learnify.backend.config;

import com.learnify.backend.entity.auth.Role;
import com.learnify.backend.enums.RoleName;
import com.learnify.backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {

        createRole(
                RoleName.ROLE_ADMIN,
                "System Administrator");

        createRole(
                RoleName.ROLE_INSTRUCTOR,
                "Course Instructor");

        createRole(
                RoleName.ROLE_STUDENT,
                "Student");

        System.out.println("Roles verified.");
    }

    private void createRole(RoleName roleName, String description) {

        if (roleRepository.findByName(roleName).isEmpty()) {

            Role role = new Role();

            role.setName(roleName);
            role.setDescription(description);

            roleRepository.save(role);

            System.out.println(roleName + " created.");
        }
    }
}
